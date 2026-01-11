import { useState, useEffect, useCallback, useRef } from 'react';

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
}

export interface SpeechState {
  isSpeaking: boolean;
  isLoading: boolean;
  currentText: string;
  progress: number;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  gender: 'female',
  pitch: 'normal',
  speed: 'normal',
  volume: 0.8,
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

  const speak = useCallback(
    (text: string, onPhonemeChange?: (phoneme: string) => void) => {
      if (!isSupported || !settings.enabled || !text.trim()) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.cancel();
        }

        setSpeechState(prev => ({
          ...prev,
          isLoading: true,
          currentText: text,
        }));

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        const voice = selectVoice(settings.gender, settings.voiceName);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.pitch = PITCH_VALUES[settings.pitch];
        utterance.rate = SPEED_VALUES[settings.speed];
        utterance.volume = settings.volume;

        utterance.onstart = () => {
          setSpeechState(prev => ({
            ...prev,
            isSpeaking: true,
            isLoading: false,
            progress: 0,
          }));
          if (onPhonemeChange) {
            onPhonemeChange('speech');
          }
        };

        utterance.onboundary = (event) => {
          const progress = event.charIndex / text.length;
          setSpeechState(prev => ({
            ...prev,
            progress: progress * 100,
          }));

          if (onPhonemeChange && event.name === 'word') {
            const currentWord = text.substring(event.charIndex, event.charIndex + 10).split(' ')[0];
            const phoneme = mapWordToPhoneme(currentWord);
            onPhonemeChange(phoneme);
          }
        };

        utterance.onend = () => {
          setSpeechState({
            isSpeaking: false,
            isLoading: false,
            currentText: '',
            progress: 100,
          });
          if (onPhonemeChange) {
            onPhonemeChange('silence');
          }
          resolve();
        };

        utterance.onerror = (error) => {
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
          reject(error);
        };

        speechSynthesisRef.current?.speak(utterance);
      });
    },
    [isSupported, settings, selectVoice]
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
