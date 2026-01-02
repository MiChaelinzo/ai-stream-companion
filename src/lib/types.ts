export interface AIPersonality {
  name: string;
  bio: string;
  tone: string;
  interests: string[];
  responseStyle: 'concise' | 'detailed' | 'playful' | 'professional';
  tonePreset?: 'energetic' | 'chill' | 'sarcastic' | 'supportive' | 'chaotic' | 'wholesome' | 'custom';
  emoji?: boolean;
  slang?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  username?: string;
  platform?: 'twitch' | 'youtube' | 'simulator';
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'poll' | 'question' | 'game';
  content: string;
  timestamp: Date;
}

export type PlatformType = 'twitch' | 'youtube';

export interface PlatformConnection {
  platform: PlatformType;
  isConnected: boolean;
  username?: string;
  channelId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isLive?: boolean;
}

export interface StreamSettings {
  autoRespond: boolean;
  responseDelay: number;
  pollInterval: number;
  enablePolls: boolean;
  enableGreetings: boolean;
  messageFrequency: number;
  maxMessagesPerMinute: number;
}
