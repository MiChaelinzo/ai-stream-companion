export type Phoneme = 
  | 'silence'
  | 'A'
  | 'E' 
  | 'I'
  | 'O'
  | 'U'
  | 'M'
  | 'B'
  | 'P'
  | 'F'
  | 'V'
  | 'TH'
  | 'L'
  | 'R'
  | 'W';

export interface PhonemeFrame {
  phoneme: Phoneme;
  duration: number;
  intensity: number;
}

export interface MouthShape {
  openness: number;
  width: number;
  height: number;
  roundness: number;
  tension: number;
}

const PHONEME_MOUTH_SHAPES: Record<Phoneme, MouthShape> = {
  silence: { openness: 0, width: 1, height: 0, roundness: 0.3, tension: 0.1 },
  A: { openness: 0.9, width: 1.3, height: 1.2, roundness: 0.4, tension: 0.8 },
  E: { openness: 0.6, width: 1.5, height: 0.8, roundness: 0.2, tension: 0.6 },
  I: { openness: 0.4, width: 1.6, height: 0.6, roundness: 0.1, tension: 0.5 },
  O: { openness: 0.8, width: 1.1, height: 1.1, roundness: 0.9, tension: 0.7 },
  U: { openness: 0.5, width: 0.8, height: 0.7, roundness: 1.0, tension: 0.6 },
  M: { openness: 0.1, width: 1.0, height: 0.2, roundness: 0.4, tension: 1.0 },
  B: { openness: 0.1, width: 1.0, height: 0.2, roundness: 0.4, tension: 1.0 },
  P: { openness: 0.1, width: 1.0, height: 0.2, roundness: 0.4, tension: 1.0 },
  F: { openness: 0.3, width: 1.1, height: 0.4, roundness: 0.3, tension: 0.7 },
  V: { openness: 0.3, width: 1.1, height: 0.4, roundness: 0.3, tension: 0.7 },
  TH: { openness: 0.4, width: 1.2, height: 0.5, roundness: 0.3, tension: 0.6 },
  L: { openness: 0.5, width: 1.2, height: 0.7, roundness: 0.3, tension: 0.5 },
  R: { openness: 0.5, width: 1.1, height: 0.6, roundness: 0.5, tension: 0.6 },
  W: { openness: 0.4, width: 0.9, height: 0.5, roundness: 0.9, tension: 0.6 },
};

const PHONEME_PATTERNS: Array<{ pattern: RegExp; phoneme: Phoneme; duration: number }> = [
  { pattern: /[aA@]/g, phoneme: 'A', duration: 100 },
  { pattern: /[eE]/g, phoneme: 'E', duration: 90 },
  { pattern: /[iI]/g, phoneme: 'I', duration: 80 },
  { pattern: /[oO]/g, phoneme: 'O', duration: 100 },
  { pattern: /[uU]/g, phoneme: 'U', duration: 90 },
  { pattern: /[mM]/g, phoneme: 'M', duration: 100 },
  { pattern: /[bB]/g, phoneme: 'B', duration: 80 },
  { pattern: /[pP]/g, phoneme: 'P', duration: 80 },
  { pattern: /[fF]/g, phoneme: 'F', duration: 90 },
  { pattern: /[vV]/g, phoneme: 'V', duration: 90 },
  { pattern: /th/gi, phoneme: 'TH', duration: 90 },
  { pattern: /[lL]/g, phoneme: 'L', duration: 80 },
  { pattern: /[rR]/g, phoneme: 'R', duration: 80 },
  { pattern: /[wW]/g, phoneme: 'W', duration: 90 },
];

export function textToPhonemes(text: string): PhonemeFrame[] {
  const frames: PhonemeFrame[] = [];
  const words = text.split(/\s+/);
  
  words.forEach((word, wordIndex) => {
    const chars = word.split('');
    
    chars.forEach((char, charIndex) => {
      let matched = false;
      
      for (const { pattern, phoneme, duration } of PHONEME_PATTERNS) {
        const testStr = charIndex < chars.length - 1 ? char + chars[charIndex + 1] : char;
        
        if (testStr.match(pattern)) {
          const intensity = 0.7 + Math.random() * 0.3;
          frames.push({ phoneme, duration, intensity });
          matched = true;
          break;
        }
      }
      
      if (!matched && /[a-zA-Z]/.test(char)) {
        const vowels = 'aeiou';
        const isVowel = vowels.includes(char.toLowerCase());
        const phoneme = isVowel ? 'A' : 'TH';
        frames.push({ phoneme, duration: 80, intensity: 0.6 });
      }
    });
    
    if (wordIndex < words.length - 1) {
      frames.push({ phoneme: 'silence', duration: 50, intensity: 0 });
    }
  });
  
  frames.push({ phoneme: 'silence', duration: 150, intensity: 0 });
  
  return frames;
}

export function getMouthShapeForPhoneme(phoneme: Phoneme, intensity: number = 1): MouthShape {
  const baseShape = PHONEME_MOUTH_SHAPES[phoneme];
  return {
    openness: baseShape.openness * intensity,
    width: 1 + (baseShape.width - 1) * intensity,
    height: baseShape.height * intensity,
    roundness: baseShape.roundness,
    tension: baseShape.tension * intensity,
  };
}

export function interpolateMouthShape(
  from: MouthShape,
  to: MouthShape,
  progress: number
): MouthShape {
  const ease = progress < 0.5 
    ? 2 * progress * progress 
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  
  return {
    openness: from.openness + (to.openness - from.openness) * ease,
    width: from.width + (to.width - from.width) * ease,
    height: from.height + (to.height - from.height) * ease,
    roundness: from.roundness + (to.roundness - from.roundness) * ease,
    tension: from.tension + (to.tension - from.tension) * ease,
  };
}

export class PhonemeSequencer {
  private frames: PhonemeFrame[] = [];
  private startTime: number = 0;
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private onUpdate?: (shape: MouthShape, phoneme: Phoneme) => void;
  private animationFrame?: number;

  constructor(text: string, onUpdate?: (shape: MouthShape, phoneme: Phoneme) => void) {
    this.frames = textToPhonemes(text);
    this.onUpdate = onUpdate;
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
    this.onUpdate?.(getMouthShapeForPhoneme('silence'), 'silence');
  }

  private animate = () => {
    if (!this.isPlaying) return;

    const elapsed = Date.now() - this.startTime;
    let totalDuration = 0;

    for (let i = 0; i < this.frames.length; i++) {
      totalDuration += this.frames[i].duration;
      
      if (elapsed < totalDuration) {
        const frame = this.frames[i];
        const nextFrame = this.frames[i + 1] || frame;
        
        const frameDuration = frame.duration;
        const frameElapsed = elapsed - (totalDuration - frameDuration);
        const progress = Math.min(frameElapsed / frameDuration, 1);
        
        const currentShape = getMouthShapeForPhoneme(frame.phoneme, frame.intensity);
        const nextShape = getMouthShapeForPhoneme(nextFrame.phoneme, nextFrame.intensity);
        const interpolatedShape = interpolateMouthShape(currentShape, nextShape, progress);
        
        this.onUpdate?.(interpolatedShape, frame.phoneme);
        this.currentIndex = i;
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

  getDuration(): number {
    return this.frames.reduce((sum, frame) => sum + frame.duration, 0);
  }
}
