import { Card, CardContent } from "@/components/ui/card";
import { SpeakerHigh, SpeakerSimpleSlash } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpeechState } from "@/hooks/use-speech-synthesis";

interface VoiceActivityMonitorProps {
  speechState: SpeechState;
  isEnabled: boolean;
}

export function VoiceActivityMonitor({ speechState, isEnabled }: VoiceActivityMonitorProps) {
  if (!isEnabled) {
    return (
      <Card className="border-muted">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <SpeakerSimpleSlash size={20} weight="bold" className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Voice Disabled</p>
              <p className="text-xs text-muted-foreground">Enable in Voice settings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={speechState.isSpeaking ? "border-primary bg-primary/5" : "border-muted"}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              speechState.isSpeaking 
                ? 'bg-primary text-primary-foreground animate-pulse' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <SpeakerHigh size={20} weight="bold" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Voice Activity</p>
                <Badge 
                  variant={speechState.isSpeaking ? "default" : "secondary"}
                  className="text-xs"
                >
                  {speechState.isSpeaking ? "Speaking" : speechState.isLoading ? "Loading..." : "Silent"}
                </Badge>
              </div>
              {speechState.currentText && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  "{speechState.currentText}"
                </p>
              )}
            </div>
          </div>

          {speechState.isSpeaking && (
            <div className="space-y-1">
              <Progress value={speechState.progress} className="h-1" />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(speechState.progress)}%
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
