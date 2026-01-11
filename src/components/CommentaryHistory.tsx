import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { GameplayAnalysis } from "@/lib/types";
import { ChatCircle, Clock, GameController, Sparkle, Trash } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

interface CommentaryHistoryProps {
  analyses: GameplayAnalysis[];
  onClear?: () => void;
}

export function CommentaryHistory({ analyses, onClear }: CommentaryHistoryProps) {
  const commentariesWithText = analyses.filter(a => a.commentary);
  
  const emotionColors: Record<string, string> = {
    exciting: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    tense: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    calm: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    chaotic: "bg-red-500/20 text-red-500 border-red-500/30",
    intense: "bg-purple-500/20 text-purple-500 border-purple-500/30",
    triumphant: "bg-green-500/20 text-green-500 border-green-500/30",
    challenging: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  };

  const getEmotionColor = (emotion: string) => {
    return emotionColors[emotion.toLowerCase()] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ChatCircle size={20} weight="fill" className="text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Commentary History
                <Badge variant="secondary">{commentariesWithText.length}</Badge>
              </CardTitle>
              <CardDescription>
                AI-generated commentary from your gameplay
              </CardDescription>
            </div>
          </div>
          {commentariesWithText.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="gap-2">
              <Trash size={16} weight="bold" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {commentariesWithText.length === 0 ? (
          <div className="text-center py-12">
            <Sparkle size={48} weight="duotone" className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No commentary generated yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Enable auto-commentary and start analyzing gameplay
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
              {commentariesWithText.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="gap-1">
                        <GameController size={12} weight="bold" />
                        {analysis.game}
                      </Badge>
                      <Badge className={getEmotionColor(analysis.emotion)}>
                        {analysis.emotion}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock size={12} weight="bold" />
                        {new Date(analysis.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <ChatCircle size={16} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-primary">
                        "{analysis.commentary}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <strong>Scene:</strong> {analysis.scene}
                    </p>
                    {analysis.action && (
                      <p className="text-xs text-muted-foreground">
                        <strong>Action:</strong> {analysis.action}
                      </p>
                    )}
                  </div>

                  {analysis.highlights && analysis.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {analysis.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          ⚡ {highlight}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {analysis.suggestion && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-accent italic">
                        💡 {analysis.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
