import { useState, useEffect, useCallback, useRef } from 'react';
import { parseSSML, SSMLSegment } from '@/lib/ssml-parser';

export type VoiceGender = 'female' | 'male' | 'neutral';
export type VoicePitch = 'low' | 'normal' | 'high';
export type VoiceSpeed = 'slow' | 'normal' | 'fast';

export interface VoiceSettings {
  enabled: boolean;
  gender: VoiceGender;
  pitch: VoicePitch;
  speed: VoiceSpeed;
  volume: number;
  voiceName?: string;
  enableSSML?: boolean;
}

export interface SpeechState {
  isSpeaking: boolean;
  isLoading: boolean;
  currentText: string;
  progress: number;
  currentSegment?: number;
  totalSegments?: number;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  gender: 'female',
  pitch: 'normal',
  speed: 'normal',
  volume: 0.8,
  enableSSML: true,
};

const PITCH_VALUES = {
  low: 0.8,
  normal: 1.0,
  high: 1.3,
};

const SPEED_VALUES = {
  slow: 0.8,
  normal: 1.0,
  fast: 1.3,
};

export function useSpeechSynthesis(settings: VoiceSettings = DEFAULT_SETTINGS) {
  const [speechState, setSpeechState] = useState<SpeechState>({
    isSpeaking: false,
    isLoading: false,
    currentText: '',
    progress: 0,
  });
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true);
      speechSynthesisRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      return () => {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.cancel();
        }
      };
    }
  }, []);

  const selectVoice = useCallback((gender: VoiceGender, voiceName?: string): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    if (voiceName) {
      const namedVoice = availableVoices.find(v => v.name === voiceName);
      if (namedVoice) return namedVoice;
    }

    const genderPreferences: Record<VoiceGender, string[]> = {
      female: ['female', 'woman', 'samantha', 'victoria', 'zira', 'google us english female', 'google uk english female'],
      male: ['male', 'man', 'david', 'mark', 'google us english male', 'google uk english male'],
      neutral: ['english', 'us', 'gb'],
    };

    const preferences = genderPreferences[gender];
    
    for (const pref of preferences) {
      const voice = availableVoices.find(v => 
        v.name.toLowerCase().includes(pref) || 
        v.lang.toLowerCase().includes('en')
      );
      if (voice) return voice;
    }

    const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
    return englishVoice || availableVoices[0];
  }, [availableVoices]);

  const speakSegment = useCallback(
    (segment: SSMLSegment, basePitch: number, baseRate: number, baseVolume: number, onPhonemeChange?: (phoneme: string) => void) => {
      return new Promise<void>((resolve, reject) => {
        if (!segment.text.trim()) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(segment.text);
        utteranceRef.current = utterance;

        const voice = selectVoice(settings.gender, settings.voiceName);
        if (voice) {
          utterance.voice = voice;
        }

        let pitch = basePitch;
        let rate = baseRate;
        let volume = baseVolume;

        if (segment.emphasis) {
          const emphasisMap = {
            strong: { pitch: 1.2, rate: 0.9, volume: 1.2 },
            moderate: { pitch: 1.1, rate: 0.95, volume: 1.1 },
            reduced: { pitch: 0.9, rate: 1.1, volume: 0.8 },
            none: { pitch: 1.0, rate: 1.0, volume: 1.0 },
          };
          const emphasis = emphasisMap[segment.emphasis];
          pitch *= emphasis.pitch;
          rate *= emphasis.rate;
          volume *= emphasis.volume;
        }

        if (segment.pitch !== undefined) {
          pitch = Math.max(0, Math.min(2, segment.pitch));
        }
        if (segment.rate !== undefined) {
          rate = Math.max(0.1, Math.min(10, segment.rate));
        }
        if (segment.volume !== undefined) {
          volume = Math.max(0, Math.min(1, segment.volume));
        }

        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = volume;

        utterance.onstart = () => {
          if (onPhonemeChange) {
            onPhonemeChange('speech');
          }
        };

        utterance.onboundary = (event) => {
          if (onPhonemeChange && event.name === 'word') {
            const currentWord = segment.text.substring(event.charIndex, event.charIndex + 10).split(' ')[0];
            const phoneme = mapWordToPhoneme(currentWord);
            onPhonemeChange(phoneme);
          }
        };

        utterance.onend = () => {
          if (onPhonemeChange) {
            onPhonemeChange('silence');
          }
          resolve();
        };

        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          if (onPhonemeChange) {
            onPhonemeChange('silence');
          }
          reject(error);
        };

        speechSynthesisRef.current?.speak(utterance);
      });
    },
    [settings, selectVoice]
  );

  const speak = useCallback(
    async (text: string, onPhonemeChange?: (phoneme: string) => void) => {
      if (!isSupported || !settings.enabled || !text.trim()) {
        return Promise.resolve();
      }

      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }

      setSpeechState(prev => ({
        ...prev,
        isLoading: true,
        currentText: text,
        progress: 0,
      }));

      try {
        const parseResult = settings.enableSSML ? parseSSML(text) : { segments: [{ text }], plainText: text, hasSSML: false };
        const segments = parseResult.segments;
        
        setSpeechState(prev => ({
          ...prev,
          isSpeaking: true,
          isLoading: false,
          totalSegments: segments.length,
          currentSegment: 0,
        }));

        const basePitch = PITCH_VALUES[settings.pitch];
        const baseRate = SPEED_VALUES[settings.speed];
        const baseVolume = settings.volume;

        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];
          
          setSpeechState(prev => ({
            ...prev,
            currentSegment: i,
            progress: (i / segments.length) * 100,
          }));

          if (segment.pause && segment.pause > 0) {
            if (onPhonemeChange) {
              onPhonemeChange('silence');
            }
            await new Promise(resolve => setTimeout(resolve, segment.pause));
          }

          if (segment.text.trim()) {
            await speakSegment(segment, basePitch, baseRate, baseVolume, onPhonemeChange);
          }
        }

        setSpeechState({
          isSpeaking: false,
          isLoading: false,
          currentText: '',
          progress: 100,
          currentSegment: segments.length,
          totalSegments: segments.length,
        });
        
        if (onPhonemeChange) {
          onPhonemeChange('silence');
        }
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setSpeechState({
          isSpeaking: false,
          isLoading: false,
          currentText: '',
          progress: 0,
        });
        if (onPhonemeChange) {
          onPhonemeChange('silence');
        }
        throw error;
      }
    },
    [isSupported, settings, speakSegment]
  );

  const stop = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setSpeechState({
        isSpeaking: false,
        isLoading: false,
        currentText: '',
        progress: 0,
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (speechSynthesisRef.current && speechState.isSpeaking) {
      speechSynthesisRef.current.pause();
      setSpeechState(prev => ({
        ...prev,
        isSpeaking: false,
      }));
    }
  }, [speechState.isSpeaking]);

  const resume = useCallback(() => {
    if (speechSynthesisRef.current && !speechState.isSpeaking && speechState.currentText) {
      speechSynthesisRef.current.resume();
      setSpeechState(prev => ({
        ...prev,
        isSpeaking: true,
      }));
    }
  }, [speechState.isSpeaking, speechState.currentText]);

  return {
    speak,
    stop,
    pause,
    resume,
    speechState,
    availableVoices,
    isSupported,
  };
}

function mapWordToPhoneme(word: string): string {
  const lowerWord = word.toLowerCase();
  
  if (/^[aeiou]/.test(lowerWord)) return 'a';
  if (/^[bf]/.test(lowerWord)) return 'b';
  if (/^[dt]/.test(lowerWord)) return 'd';
  if (/^[mn]/.test(lowerWord)) return 'm';
  if (/^[ou]/.test(lowerWord)) return 'o';
  if (/^[pv]/.test(lowerWord)) return 'p';
  if (/^[sz]/.test(lowerWord)) return 's';
  if (/^[lr]/.test(lowerWord)) return 'l';
  
  return 'speech';
}
