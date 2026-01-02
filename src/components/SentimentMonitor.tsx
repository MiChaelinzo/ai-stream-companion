import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChatMessage } from "@/lib/types";
import { Smiley, SmileyMeh, SmileyXEyes, TrendUp, TrendDown, Minus, WarningCircle } from "@phosphor-icons/react";
import { useMemo } from "react";

interface SentimentMonitorProps {
  messages: ChatMessage[];
  isLive: boolean;
}

export function SentimentMonitor({ messages, isLive }: SentimentMonitorProps) {
  const recentMessages = useMemo(() => {
    return messages.slice(-50);
  }, [messages]);

  const sentiment = useMemo(() => {
    if (recentMessages.length === 0) {
      return { score: 0, classification: 'neutral' as const, trend: 'stable' as const };
    }

    const sentimentScores = recentMessages
      .filter(m => m.sentiment)
      .map(m => {
        switch (m.sentiment) {
          case 'positive': return 1;
          case 'negative': return -1;
          default: return 0;
        }
      });

    const avgScore = sentimentScores.length > 0 
      ? sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length 
      : 0;

    let classification: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (avgScore > 0.2) classification = 'positive';
    else if (avgScore < -0.2) classification = 'negative';

    const recentScores = sentimentScores.slice(-10);
    const olderScores = sentimentScores.slice(-20, -10);
    const recentAvg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
    const olderAvg = olderScores.length > 0 ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length : 0;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg - olderAvg > 0.15) trend = 'up';
    else if (recentAvg - olderAvg < -0.15) trend = 'down';

    return { score: avgScore, classification, trend };
  }, [recentMessages]);

  const getSentimentColor = (classification: string) => {
    switch (classification) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSentimentIcon = (classification: string) => {
    switch (classification) {
      case 'positive': return <Smiley size={32} weight="fill" className="text-green-500" />;
      case 'negative': return <SmileyXEyes size={32} weight="fill" className="text-red-500" />;
      default: return <SmileyMeh size={32} weight="fill" className="text-yellow-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendUp size={20} weight="bold" className="text-green-500" />;
      case 'down': return <TrendDown size={20} weight="bold" className="text-red-500" />;
      default: return <Minus size={20} weight="bold" className="text-muted-foreground" />;
    }
  };

  const shouldShowAlert = sentiment.classification === 'negative' && sentiment.trend === 'down';

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smiley size={20} weight="bold" className="text-primary" />
          Live Sentiment Monitor
        </CardTitle>
        <CardDescription>Real-time chat mood tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isLive && (
          <Alert>
            <AlertDescription>
              Sentiment monitoring is active when you're streaming live
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getSentimentIcon(sentiment.classification)}
            <div>
              <div className="text-2xl font-bold capitalize">{sentiment.classification}</div>
              <div className="text-sm text-muted-foreground">Current mood</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(sentiment.trend)}
            <div className="text-right">
              <div className="text-lg font-semibold capitalize">{sentiment.trend}</div>
              <div className="text-xs text-muted-foreground">Trend</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sentiment Score</span>
            <span className="font-medium">{(sentiment.score * 100).toFixed(0)}%</span>
          </div>
          <div className="relative h-8 rounded-full bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 overflow-hidden">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-foreground transition-all duration-500"
              style={{ left: `${((sentiment.score + 1) / 2) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex w-full justify-between px-4 text-xs font-medium">
                <span>Negative</span>
                <span>Neutral</span>
                <span>Positive</span>
              </div>
            </div>
          </div>
        </div>

        {shouldShowAlert && (
          <Alert variant="destructive">
            <WarningCircle size={18} weight="fill" />
            <AlertDescription>
              Chat sentiment is trending negative. Consider engaging with viewers or addressing concerns.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center p-3 rounded-lg bg-green-500/10">
            <div className="text-2xl font-bold text-green-500">
              {recentMessages.filter(m => m.sentiment === 'positive').length}
            </div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-500/10">
            <div className="text-2xl font-bold text-yellow-500">
              {recentMessages.filter(m => m.sentiment === 'neutral').length}
            </div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-500/10">
            <div className="text-2xl font-bold text-red-500">
              {recentMessages.filter(m => m.sentiment === 'negative').length}
            </div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Based on last {recentMessages.length} messages
        </div>
      </CardContent>
    </Card>
  );
}
