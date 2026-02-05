export interface AIPersonality {
  name: string;
  bio: string;
  tone: string;
  interests: string[];
  responseStyle: 'concise' | 'detailed' | 'playful' | 'professional';
  tonePreset?: 'energetic' | 'chill' | 'sarcastic' | 'supportive' | 'chaotic' | 'wholesome' | 'mysterious' | 'competitive' | 'elegant' | 'dreamy' | 'philosophical' | 'nostalgic' | 'brutal' | 'rhythmic' | 'custom';
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

export interface SupportChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: Date;
  type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  voiceRecording?: boolean;
  duration?: number;
  isRecommendation?: boolean;
  recommendationType?: 'quick-reply' | 'suggestion' | 'tip' | 'guide';
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  reactions?: string[];
}

export interface SupportChatRecommendation {
  id: string;
  text: string;
  category: 'setup' | 'troubleshooting' | 'feature' | 'best-practice' | 'general';
  priority: number;
  context?: string;
}

export interface SupportChatSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: SupportChatMessage[];
  resolved?: boolean;
  rating?: number;
  feedback?: string;
  category?: string;
  tags?: string[];
}

export interface VideoFrame {
  timestamp: number;
  dataUrl: string;
  analysis?: GameplayAnalysis;
}

export interface VideoAnalysisResult {
  id: string;
  fileName: string;
  fileSize: number;
  duration: number;
  frameCount: number;
  fps: number;
  analyzedFrames: VideoFrame[];
  overallSummary: string;
  keyMoments: {
    timestamp: number;
    description: string;
    type: 'highlight' | 'action' | 'event' | 'scene-change';
  }[];
  gameDetection?: {
    gameName: string;
    confidence: number;
    genre: string;
  };
  commentary: string[];
  performanceInsights?: {
    skillLevel: string;
    strengths: string[];
    improvements: string[];
  };
  uploadedAt: Date;
  processingTime: number;
}

export interface VideoAnalysisSettings {
  frameInterval: number;
  maxFrames: number;
  detectKeyMoments: boolean;
  generateCommentary: boolean;
  analyzePerformance: boolean;
  commentaryStyle: 'hype' | 'analytical' | 'casual' | 'educational' | 'comedic';
}

export interface StreamGoal {
  id: string;
  title: string;
  description: string;
  type: 'followers' | 'subscribers' | 'viewers' | 'donations' | 'custom';
  currentValue: number;
  targetValue: number;
  icon: 'trophy' | 'users' | 'heart' | 'star' | 'fire';
  color: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface StreamHighlight {
  id: string;
  timestamp: Date;
  type: 'chat-spike' | 'sentiment-peak' | 'key-moment' | 'milestone' | 'interaction';
  title: string;
  description: string;
  intensity: number;
  context: {
    messageCount?: number;
    averageSentiment?: number;
    keyPhrases?: string[];
    viewers?: number;
  };
  autoDetected: boolean;
  clipWorthy: boolean;
}

