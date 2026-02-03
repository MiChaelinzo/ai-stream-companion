import { google, youtube_v3 } from 'googleapis';
import axios from 'axios';

interface ChatMessage {
  username: string;
  message: string;
  timestamp: Date;
}

type MessageCallback = (message: ChatMessage) => void;

export class YouTubeService {
  private youtube: youtube_v3.Youtube;
  private liveChatId: string = '';
  private apiKey: string = '';
  private messageCallback: MessageCallback | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private nextPageToken: string | undefined;

  constructor() {
    this.youtube = google.youtube('v3');
  }

  async connect(liveChatId: string, apiKey: string): Promise<void> {
    this.liveChatId = liveChatId;
    this.apiKey = apiKey;

    this.startPolling();
    console.log(`✅ Connected to YouTube live chat: ${liveChatId}`);
  }

  disconnect(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    console.log(`❌ Disconnected from YouTube live chat`);
  }

  private startPolling(): void {
    this.pollMessages();
    
    this.pollInterval = setInterval(() => {
      this.pollMessages();
    }, 5000);
  }

  private async pollMessages(): Promise<void> {
    try {
      const response = await this.youtube.liveChatMessages.list({
        liveChatId: this.liveChatId,
        part: ['snippet', 'authorDetails'],
        key: this.apiKey,
        pageToken: this.nextPageToken
      });

      if (response.data.items) {
        for (const item of response.data.items) {
          const chatMessage: ChatMessage = {
            username: item.authorDetails?.displayName || 'Anonymous',
            message: item.snippet?.displayMessage || '',
            timestamp: new Date(item.snippet?.publishedAt || Date.now())
          };

          if (this.messageCallback) {
            this.messageCallback(chatMessage);
          }
        }
      }

      this.nextPageToken = response.data.nextPageToken || undefined;
    } catch (error) {
      console.error('Error polling YouTube messages:', error);
    }
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.liveChatId || !this.apiKey) {
      throw new Error('Not connected to YouTube');
    }

    await this.youtube.liveChatMessages.insert({
      part: ['snippet'],
      key: this.apiKey,
      requestBody: {
        snippet: {
          liveChatId: this.liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: message
          }
        }
      }
    });
  }

  onMessage(callback: MessageCallback): void {
    this.messageCallback = callback;
  }

  isConnected(): boolean {
    return this.pollInterval !== null;
  }
}
