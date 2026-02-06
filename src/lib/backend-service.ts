export interface BackendMessage {
  type: string;
  payload: any;
}

export interface ChatMessagePayload {
  platform: 'twitch' | 'youtube';
  username: string;
  message: string;
  timestamp: Date;
  aiResponse?: string;
}

export class BackendService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, ((payload: any) => void)[]> = new Map();
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private readonly PING_INTERVAL = 15000;
  private readonly PONG_TIMEOUT = 10000;
  private isConnecting = false;
  private shouldReconnect = true;
  private manualDisconnect = false;

  constructor(url: string = 'ws://localhost:3001') {
    this.url = url;
  }

  setUrl(url: string): void {
    if (this.isConnected()) {
      console.warn('⚠️ Cannot change URL while connected. Disconnect first.');
      return;
    }
    this.url = url;
  }

  private emit(type: string, payload: any): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  connect(): Promise<void> {
    if (this.isConnecting) {
      console.log('⚠️ Connection already in progress, ignoring duplicate request');
      return Promise.resolve();
    }

    if (this.isConnected()) {
      console.log('⚠️ Already connected, ignoring duplicate connection request');
      return Promise.resolve();
    }

    this.cleanup();
    this.shouldReconnect = true;
    this.manualDisconnect = false;

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;
        console.log(`🔌 Attempting to connect to ${this.url}...`);
        this.ws = new WebSocket(this.url);

        const connectionTimeout = setTimeout(() => {
          if (this.isConnecting) {
            console.error('⏱️ Connection timeout after 15 seconds');
            this.isConnecting = false;
            if (this.ws) {
              this.ws.close();
              this.ws = null;
            }
            reject(new Error('Connection timeout'));
          }
        }, 15000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('✅ Connected to backend server');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          this.startKeepalive();
          this.emit('connected', {});
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: BackendMessage = JSON.parse(event.data);
            
            if (message.type === 'pong') {
              this.handlePong();
              return;
            }
            
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse backend message:', error);
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', { message: 'WebSocket connection error' });
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            reject(new Error('WebSocket connection failed'));
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          const wasConnecting = this.isConnecting;
          this.isConnecting = false;
          this.stopKeepalive();
          this.ws = null;
          
          if (!this.manualDisconnect) {
            console.log('❌ Disconnected from backend server', { code: event.code, reason: event.reason });
            this.emit('disconnected', { code: event.code, reason: event.reason });
            
            if (event.code === 1006 && this.reconnectAttempts === 0 && wasConnecting) {
              reject(new Error('Connection failed - backend may not be running'));
            }
            
            if (this.shouldReconnect && !this.manualDisconnect) {
              this.attemptReconnect();
            }
          } else {
            console.log('🔌 Disconnected from backend server (manual)');
            this.emit('disconnected', { code: event.code, reason: 'manual disconnect' });
          }
        };
      } catch (error) {
        this.isConnecting = false;
        this.ws = null;
        reject(error);
      }
    });
  }

  private cleanup(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopKeepalive();

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  disconnect(): void {
    console.log('🔌 Manually disconnecting from backend...');
    this.shouldReconnect = false;
    this.manualDisconnect = true;
    this.reconnectAttempts = 0;
    this.isConnecting = false;

    this.cleanup();
  }

  private startKeepalive(): void {
    this.stopKeepalive();
    
    console.log('🏓 Starting keepalive (ping every 15s)');
    
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping', payload: {} }));
          this.emit('ping', {});
          
          this.pongTimeout = setTimeout(() => {
            console.warn('⚠️ Pong timeout - no response from server - closing connection');
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.close(1000, 'Pong timeout');
            }
          }, this.PONG_TIMEOUT);
        } catch (error) {
          console.error('Failed to send ping:', error);
        }
      } else {
        console.warn('⚠️ Cannot send ping - WebSocket not open');
      }
    }, this.PING_INTERVAL);
  }

  private stopKeepalive(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  private handlePong(): void {
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
    this.emit('pong', {});
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect || this.manualDisconnect) {
      console.log('⚠️ Reconnection disabled, not attempting');
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.emit('max-reconnect-attempts-reached', { attempts: this.reconnectAttempts });
      this.shouldReconnect = false;
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.emit('reconnect-attempt', { 
      attemptNumber: this.reconnectAttempts, 
      maxAttempts: this.maxReconnectAttempts,
      delay 
    });

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (this.shouldReconnect && !this.manualDisconnect) {
        this.connect().catch((error) => {
          console.error('🚫 Reconnection failed:', error.message);
        });
      }
    }, delay);
  }

  private handleMessage(message: BackendMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message.payload));
    }

    const allHandlers = this.messageHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => handler(message));
    }
  }

  on(type: string, handler: (payload: any) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  off(type: string, handler: (payload: any) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  send(type: string, payload: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    const message: BackendMessage = { type, payload };
    this.ws.send(JSON.stringify(message));
  }

  connectTwitch(channel: string, accessToken: string, clientId: string): void {
    this.send('connect_twitch', { channel, accessToken, clientId });
  }

  disconnectTwitch(): void {
    this.send('disconnect_twitch', {});
  }

  connectYouTube(liveChatId: string, apiKey: string): void {
    this.send('connect_youtube', { liveChatId, apiKey });
  }

  disconnectYouTube(): void {
    this.send('disconnect_youtube', {});
  }

  sendMessage(platform: 'twitch' | 'youtube', message: string): void {
    this.send('send_message', { platform, message });
  }

  createPoll(platform: 'twitch' | 'youtube', question: string, options: string[], duration: number = 60): void {
    this.send('create_poll', { platform, question, options, duration });
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getConnectionState(): { 
    isConnected: boolean; 
    isConnecting: boolean; 
    reconnectAttempts: number;
    shouldReconnect: boolean;
  } {
    return {
      isConnected: this.isConnected(),
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      shouldReconnect: this.shouldReconnect,
    };
  }

  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }
}

export const backendService = new BackendService();
