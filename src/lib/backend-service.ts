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
  private maxReconnectAttempts = 5;
  private readonly PING_INTERVAL = 30000;
  private readonly PONG_TIMEOUT = 5000;
  private isConnecting = false;
  private shouldReconnect = true;

  constructor(url: string = 'ws://localhost:3001') {
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

    this.shouldReconnect = true;

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
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
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', { message: 'WebSocket connection error' });
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('❌ Disconnected from backend server');
          this.isConnecting = false;
          this.stopKeepalive();
          this.emit('disconnected', {});
          
          if (this.shouldReconnect) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.shouldReconnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.stopKeepalive();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
  }

  private startKeepalive(): void {
    this.stopKeepalive();
    
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', payload: {} }));
        this.emit('ping', {});
        
        this.pongTimeout = setTimeout(() => {
          console.warn('⚠️ Pong timeout - reconnecting...');
          this.ws?.close();
        }, this.PONG_TIMEOUT);
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
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
        console.error('Reconnection failed');
      });
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
}

export const backendService = new BackendService();
