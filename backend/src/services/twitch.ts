import tmi from 'tmi.js';
import axios from 'axios';

interface ChatMessage {
  username: string;
  message: string;
  timestamp: Date;
}

type MessageCallback = (message: ChatMessage) => void;

export class TwitchService {
  private client: tmi.Client | null = null;
  private channel: string = '';
  private accessToken: string = '';
  private clientId: string = '';
  private messageCallback: MessageCallback | null = null;

  async connect(channel: string, accessToken: string, clientId: string): Promise<void> {
    this.channel = channel;
    this.accessToken = accessToken;
    this.clientId = clientId;

    const options: tmi.Options = {
      options: { debug: true },
      connection: {
        reconnect: true,
        secure: true
      },
      identity: {
        username: channel,
        password: `oauth:${accessToken}`
      },
      channels: [channel]
    };

    this.client = new tmi.Client(options);

    this.client.on('message', (channel, tags, message, self) => {
      if (self) return;

      const chatMessage: ChatMessage = {
        username: tags['display-name'] || tags.username || 'Anonymous',
        message: message,
        timestamp: new Date()
      };

      if (this.messageCallback) {
        this.messageCallback(chatMessage);
      }
    });

    this.client.on('connected', () => {
      console.log(`✅ Connected to Twitch channel: ${channel}`);
    });

    this.client.on('disconnected', () => {
      console.log(`❌ Disconnected from Twitch channel: ${channel}`);
    });

    await this.client.connect();
  }

  disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.client || !this.channel) {
      throw new Error('Not connected to Twitch');
    }

    await this.client.say(this.channel, message);
  }

  async createPoll(question: string, options: string[], duration: number = 60): Promise<any> {
    if (!this.accessToken || !this.clientId) {
      throw new Error('Twitch credentials not configured');
    }

    const broadcasterId = await this.getBroadcasterId();

    const response = await axios.post(
      'https://api.twitch.tv/helix/polls',
      {
        broadcaster_id: broadcasterId,
        title: question,
        choices: options.map(option => ({ title: option })),
        duration: duration
      },
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }

  private async getBroadcasterId(): Promise<string> {
    const response = await axios.get(
      'https://api.twitch.tv/helix/users',
      {
        params: { login: this.channel },
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Client-Id': this.clientId
        }
      }
    );

    if (response.data.data.length === 0) {
      throw new Error('Broadcaster not found');
    }

    return response.data.data[0].id;
  }

  onMessage(callback: MessageCallback): void {
    this.messageCallback = callback;
  }

  isConnected(): boolean {
    return this.client !== null && this.client.readyState() === 'OPEN';
  }
}
