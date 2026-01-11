export type EmotionType = "neutral" | "happy" | "excited" | "thinking" | "confused" | "surprised" | "sad";

export interface EmotionConfig {
  emotion: EmotionType;
  intensity: number;
  duration: number;
  transition?: number;
}

export interface CommentaryEmotionSync {
  text: string;
  emotions: EmotionConfig[];
  phonemeBoost?: number;
}

const SENTIMENT_TO_EMOTION_MAP: Record<string, EmotionType> = {
  positive: 'happy',
  negative: 'confused',
  neutral: 'neutral',
  excited: 'excited',
  question: 'thinking',
  surprise: 'surprised',
  sad: 'sad',
};

const EMOTION_KEYWORDS: Record<EmotionType, string[]> = {
  excited: ['wow', 'amazing', 'incredible', 'awesome', 'epic', 'insane', 'crazy', 'fire', 'pog', '!', 'hype'],
  happy: ['good', 'nice', 'great', 'love', 'happy', 'glad', 'enjoy', 'fun', 'yay', 'cool'],
  thinking: ['hmm', 'think', 'wonder', 'maybe', 'consider', 'interesting', 'curious', '?'],
  confused: ['what', 'why', 'confused', 'strange', 'weird', 'huh', 'wait', 'really'],
  surprised: ['whoa', 'wait', 'oh', 'unexpected', 'sudden', 'surprise', 'omg'],
  sad: ['unfortunately', 'sad', 'sorry', 'miss', 'lost', 'fail', 'bad', 'oh no'],
  neutral: [],
};

export function analyzeCommentaryEmotion(text: string, sentiment?: string): EmotionConfig[] {
  const emotions: EmotionConfig[] = [];
  const words = text.toLowerCase().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  
  const baseDuration = (text.length / 15) * 1000;
  const durationPerSentence = baseDuration / Math.max(sentences.length, 1);
  
  if (sentiment && SENTIMENT_TO_EMOTION_MAP[sentiment]) {
    emotions.push({
      emotion: SENTIMENT_TO_EMOTION_MAP[sentiment],
      intensity: 0.7,
      duration: baseDuration * 0.3,
      transition: 200,
    });
  }
  
  sentences.forEach((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    let detectedEmotion: EmotionType = 'neutral';
    let maxMatches = 0;
    
    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
      const matches = sentenceWords.filter(word => 
        keywords.some(keyword => word.includes(keyword))
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedEmotion = emotion as EmotionType;
      }
    }
    
    if (sentence.includes('!')) {
      detectedEmotion = 'excited';
    } else if (sentence.includes('?')) {
      detectedEmotion = 'thinking';
    }
    
    const intensity = Math.min(0.5 + (maxMatches * 0.2), 1.0);
    
    emotions.push({
      emotion: detectedEmotion,
      intensity,
      duration: durationPerSentence,
      transition: 150,
    });
  });
  
  emotions.push({
    emotion: 'neutral',
    intensity: 0.3,
    duration: 500,
    transition: 300,
  });
  
  return emotions;
}

export function getPhonemeBoostForEmotion(emotion: EmotionType): number {
  const boosts: Record<EmotionType, number> = {
    excited: 1.4,
    happy: 1.2,
    surprised: 1.3,
    thinking: 0.9,
    confused: 1.0,
    sad: 0.8,
    neutral: 1.0,
  };
  return boosts[emotion] || 1.0;
}

export class EmotionSequencer {
  private emotions: EmotionConfig[] = [];
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private currentIndex: number = 0;
  private onEmotionChange?: (emotion: EmotionType, intensity: number) => void;
  private animationFrame?: number;
  private lastEmotion: EmotionType = 'neutral';

  constructor(
    emotions: EmotionConfig[],
    onEmotionChange?: (emotion: EmotionType, intensity: number) => void
  ) {
    this.emotions = emotions;
    this.onEmotionChange = onEmotionChange;
  }

  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.startTime = Date.now();
    this.currentIndex = 0;
    this.animate();
  }

  stop() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.onEmotionChange?.('neutral', 0.3);
  }

  private animate = () => {
    if (!this.isPlaying) return;

    const elapsed = Date.now() - this.startTime;
    let totalDuration = 0;

    for (let i = 0; i < this.emotions.length; i++) {
      const emotion = this.emotions[i];
      totalDuration += emotion.duration;
      
      if (elapsed < totalDuration) {
        const emotionElapsed = elapsed - (totalDuration - emotion.duration);
        const progress = emotionElapsed / emotion.duration;
        
        const transitionProgress = emotion.transition 
          ? Math.min(emotionElapsed / emotion.transition, 1)
          : 1;
        
        const intensityWithTransition = emotion.intensity * transitionProgress;
        
        if (this.lastEmotion !== emotion.emotion || this.currentIndex !== i) {
          this.onEmotionChange?.(emotion.emotion, intensityWithTransition);
          this.lastEmotion = emotion.emotion;
          this.currentIndex = i;
        }
        
        break;
      }
    }

    if (elapsed >= totalDuration) {
      this.stop();
      return;
    }

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  isActive(): boolean {
    return this.isPlaying;
  }

  getTotalDuration(): number {
    return this.emotions.reduce((sum, emotion) => sum + emotion.duration, 0);
  }
}

export function createSyncedCommentary(
  text: string,
  sentiment?: string
): CommentaryEmotionSync {
  const emotions = analyzeCommentaryEmotion(text, sentiment);
  const primaryEmotion = emotions.find(e => e.intensity > 0.5)?.emotion || 'neutral';
  const phonemeBoost = getPhonemeBoostForEmotion(primaryEmotion);
  
  return {
    text,
    emotions,
    phonemeBoost,
  };
}
