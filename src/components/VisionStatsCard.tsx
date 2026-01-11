import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GameplayAnalysis } from "@/lib/types";
import { Eye, Sparkle, Target, ChatCircle } from "@phosphor-icons/react";

interface VisionStatsCardProps {
  analyses: GameplayAnalysis[];
  isActive: boolean;
}

export function VisionStatsCard({ analyses, isActive }: VisionStatsCardProps) {
  const totalAnalyses = analyses.length;
  const totalHighlights = analyses.reduce((sum, a) => sum + (a.highlights?.length || 0), 0);
  const totalCommentaries = analyses.filter(a => a.commentary).length;
  const gamesDetected = new Set(analyses.map(a => a.game)).size;

  const recentGame = analyses[0]?.game || "No game detected";
  const recentEmotion = analyses[0]?.emotion || "neutral";

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Eye size={20} weight="bold" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Vision Analysis Stats</CardTitle>
              <CardDescription>Gemini 3 Vision API metrics</CardDescription>
            </div>
          </div>
          {isActive && (
            <Badge className="bg-accent/20 text-accent border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Target size={14} weight="bold" />
              <span>Analyses</span>
            </div>
            <p className="text-2xl font-bold">{totalAnalyses}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Sparkle size={14} weight="fill" />
              <span>Highlights</span>
            </div>
            <p className="text-2xl font-bold text-accent">{totalHighlights}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ChatCircle size={14} weight="fill" />
              <span>Commentary</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalCommentaries}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye size={14} weight="bold" />
              <span>Games</span>
            </div>
            <p className="text-2xl font-bold">{gamesDetected}</p>
          </div>
        </div>

        {totalAnalyses > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Game</span>
              <Badge variant="secondary">{recentGame}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Latest Emotion</span>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {recentEmotion}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
