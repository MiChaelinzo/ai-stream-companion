import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waveform, SmileyXEyes, Lightning, Brain } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentarySyncMonitorProps {
  isSpeaking: boolean;
  currentPhoneme?: string;
  currentEmotion?: string;
  emotionIntensity?: number;
  speechText?: string;
}

export function CommentarySyncMonitor({
  isSpeaking,
  currentPhoneme = 'silence',
  currentEmotion = 'neutral',
  emotionIntensity = 0,
  speechText = ''
}: CommentarySyncMonitorProps) {
  
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      excited: '#ec4899',
      happy: '#eab308',
      thinking: '#3b82f6',
      confused: '#a855f7',
      surprised: '#f97316',
      sad: '#6b7280',
      neutral: '#9ca3af'
    };
    return colors[emotion] || colors.neutral;
  };

  const getPhonemeColor = (phoneme: string) => {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    if (vowels.includes(phoneme)) return '#ec4899';
    if (phoneme === 'silence') return '#4b5563';
    return '#8b5cf6';
  };

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightning size={18} weight="fill" className="text-primary" />
          <h3 className="font-semibold text-sm">Commentary Sync Monitor</h3>
          {isSpeaking && (
            <Badge className="bg-accent/20 text-accent border-accent/30 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse" />
              Active
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Waveform size={14} weight="bold" />
                Phoneme
              </span>
              <span className="font-mono font-bold" style={{ color: getPhonemeColor(currentPhoneme) }}>
                {currentPhoneme}
              </span>
            </div>
            
            <AnimatePresence>
              {isSpeaking && (
                <motion.div
                  className="h-1.5 bg-muted rounded-full overflow-hidden"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: getPhonemeColor(currentPhoneme),
                      boxShadow: `0 0 10px ${getPhonemeColor(currentPhoneme)}40`
                    }}
                    animate={{ 
                      width: currentPhoneme === 'silence' ? '0%' : '100%',
                      opacity: currentPhoneme === 'silence' ? 0.3 : 1
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <SmileyXEyes size={14} weight="fill" />
                Emotion
              </span>
              <span className="font-semibold capitalize" style={{ color: getEmotionColor(currentEmotion) }}>
                {currentEmotion}
              </span>
            </div>
            
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: getEmotionColor(currentEmotion),
                  boxShadow: `0 0 10px ${getEmotionColor(currentEmotion)}40`
                }}
                animate={{ 
                  width: `${emotionIntensity * 100}%`
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Brain size={14} weight="fill" />
              <span>Sync Status</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1 items-center justify-center bg-muted/50 rounded-lg p-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Lip Sync</span>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
              </div>
              
              <div className="flex flex-col gap-1 items-center justify-center bg-muted/50 rounded-lg p-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Emotion</span>
                <div className={`w-2 h-2 rounded-full ${isSpeaking && emotionIntensity > 0.3 ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
              </div>
              
              <div className="flex flex-col gap-1 items-center justify-center bg-muted/50 rounded-lg p-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Timing</span>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
              </div>
            </div>
          </div>

          {isSpeaking && speechText && (
            <motion.div
              className="bg-muted/30 rounded-lg p-3 border border-primary/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xs text-muted-foreground line-clamp-2">
                {speechText}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
