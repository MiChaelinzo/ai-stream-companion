export interface AIPersonality {
  name: string;
  bio: string;
  tone: string;
  interests: string[];
  responseStyle: 'concise' | 'detailed' | 'playful' | 'professional';
  tonePreset?: 'energetic' | 'chill' | 'sarcastic' | 'supportive' | 'chaotic' | 'wholesome' | 'custom';
  emoji?: boolean;
  slang?: boolean;
  avatarSkin?: 'default' | 'cyberpunk' | 'pastel' | 'neon' | 'fantasy' | 'retro' | 'monochrome' | 'cosmic';
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  username?: string;
  platform?: 'twitch' | 'youtube' | 'simulator';
  sentiment?: 'positive' | 'neutral' | 'negative';
  rating?: number;
  votes?: { up: number; down: number };
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

export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  shortcut?: string;
  variables?: string[];
  usageCount?: number;
  createdAt: Date;
}

export interface ChatCommand {
  id: string;
  trigger: string;
  response: string;
  cooldown: number;
  permissions: 'viewer' | 'subscriber' | 'moderator' | 'broadcaster';
  enabled: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
}

export interface SentimentData {
  timestamp: Date;
  score: number;
  classification: 'positive' | 'neutral' | 'negative';
  messageCount: number;
}

export interface EmotionAnalysis {
  joy: number;
  excitement: number;
  frustration: number;
  confusion: number;
  appreciation: number;
}

export interface EngagementMetrics {
  score: number;
  level: 'low' | 'medium' | 'high' | 'very-high';
  messageRate: number;
  responseRate: number;
  sentimentTrend: 'improving' | 'stable' | 'declining';
}

export interface SentimentInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  actionable?: boolean;
}

export interface AnalyticsData {
  totalMessages: number;
  aiResponses: number;
  averageResponseTime: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topKeywords: { word: string; count: number }[];
  messagesPerHour: { hour: string; count: number }[];
  responseRating: number;
}

export interface GameplayAnalysis {
  id: string;
  timestamp: Date;
  game: string;
  scene: string;
  objects: string[];
  action: string;
  emotion: string;
  suggestion?: string;
  commentary?: string;
  highlights?: string[];
}

export interface VisionSettings {
  enabled: boolean;
  analysisInterval: number;
  autoCommentary: boolean;
  detectHighlights: boolean;
  gameContext?: string;
  confidenceThreshold: number;
  commentaryStyle?: 'hype' | 'analytical' | 'casual' | 'educational' | 'comedic';
  commentaryFrequency?: 'all' | 'highlights-only' | 'occasional';
  includeGameplayTips?: boolean;
  reactToActions?: boolean;
}

export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  apm: number;
  accuracy: number;
  combo: number;
  reactionTime?: number;
  decisionsPerMinute?: number;
}

export interface PerformanceSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  game: string;
  gameType: 'fps' | 'moba' | 'fighting' | 'racing' | 'rhythm' | 'strategy' | 'other';
  metrics: PerformanceMetric[];
  averageAPM: number;
  averageAccuracy: number;
  maxCombo: number;
  totalActions: number;
  duration: number;
  skillRating?: number;
}

export interface AICoachingSuggestion {
  id: string;
  timestamp: Date;
  category: 'apm' | 'accuracy' | 'combo' | 'strategy' | 'positioning' | 'timing' | 'mechanics';
  severity: 'info' | 'suggestion' | 'warning' | 'critical';
  title: string;
  message: string;
  improvementTips: string[];
  targetMetric?: string;
  currentValue?: number;
  targetValue?: number;
  priority: number;
}

export interface SkillProgress {
  game: string;
  gameType: string;
  sessionsPlayed: number;
  totalPlayTime: number;
  averageAPM: number;
  averageAccuracy: number;
  maxCombo: number;
  skillRating: number;
  trend: 'improving' | 'stable' | 'declining';
  lastPlayed: Date;
  milestones: {
    title: string;
    achieved: boolean;
    achievedAt?: Date;
  }[];
}
