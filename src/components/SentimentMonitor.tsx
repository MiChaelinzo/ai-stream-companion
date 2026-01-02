import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";
import { Smiley, SmileyMeh, SmileyXEyes, TrendUp, TrendDown, Minus, WarningCircle, ChartLine, ArrowsClockwise } from "@phosphor-icons/react";
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
      return { 
        score: 0, 
        classification: 'neutral' as const, 
        trend: 'stable' as const,
        velocity: 0,
        stability: 100
      };
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
    
    const velocity = recentAvg - olderAvg;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (velocity > 0.15) trend = 'up';
    else if (velocity < -0.15) trend = 'down';

    const variance = sentimentScores.length > 1
      ? sentimentScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / sentimentScores.length
      : 0;
    const stability = Math.max(0, 100 - (variance * 100));

    return { score: avgScore, classification, trend, velocity, stability };
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
  const shouldShowWarning = sentiment.stability < 50 && recentMessages.length > 10;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smiley size={20} weight="bold" className="text-primary" />
              Live Sentiment Monitor
            </CardTitle>
            <CardDescription>Real-time chat mood and engagement tracking</CardDescription>
          </div>
          {isLive && (
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isLive && (
          <Alert>
            <ChartLine size={18} />
            <AlertDescription>
              Sentiment monitoring is active when you're streaming live. Start monitoring to see real-time analysis.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {getSentimentIcon(sentiment.classification)}
              {isLive && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-2xl font-bold capitalize">{sentiment.classification}</div>
              <div className="text-sm text-muted-foreground">Current mood</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 justify-end">
            {getTrendIcon(sentiment.trend)}
            <div className="text-right">
              <div className="text-lg font-semibold capitalize">{sentiment.trend}</div>
              <div className="text-xs text-muted-foreground">
                {sentiment.velocity !== 0 && (
                  <span className={sentiment.velocity > 0 ? 'text-green-500' : 'text-red-500'}>
                    {sentiment.velocity > 0 ? '+' : ''}{(sentiment.velocity * 100).toFixed(1)}%
                  </span>
                )}
                {sentiment.velocity === 0 && 'Stable'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sentiment Score</span>
            <span className="font-medium">{(sentiment.score * 100).toFixed(0)}%</span>
          </div>
          <div className="relative h-10 rounded-full bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 overflow-hidden border border-border/50">
            <div 
              className="absolute top-0 bottom-0 w-1 bg-foreground shadow-lg transition-all duration-500"
              style={{ left: `${((sentiment.score + 1) / 2) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex w-full justify-between px-4 text-xs font-medium">
                <span className="drop-shadow">Negative</span>
                <span className="drop-shadow">Neutral</span>
                <span className="drop-shadow">Positive</span>
              </div>
            </div>
          </div>
        </div>

        {shouldShowAlert && (
          <Alert variant="destructive" className="animate-pulse">
            <WarningCircle size={18} weight="fill" />
            <AlertDescription>
              <strong>Alert:</strong> Chat sentiment is trending negative. Consider engaging with viewers or addressing concerns immediately.
            </AlertDescription>
          </Alert>
        )}

        {shouldShowWarning && !shouldShowAlert && (
          <Alert>
            <ArrowsClockwise size={18} />
            <AlertDescription>
              Chat sentiment is fluctuating significantly. Viewer reactions are mixed - monitor closely for patterns.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="text-2xl font-bold text-green-500">
              {recentMessages.filter(m => m.sentiment === 'positive').length}
            </div>
            <div className="text-xs text-muted-foreground">Positive</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-500">
              {recentMessages.filter(m => m.sentiment === 'neutral').length}
            </div>
            <div className="text-xs text-muted-foreground">Neutral</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-2xl font-bold text-red-500">
              {recentMessages.filter(m => m.sentiment === 'negative').length}
            </div>
            <div className="text-xs text-muted-foreground">Negative</div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sentiment Stability</span>
            <span className="font-medium">{sentiment.stability.toFixed(0)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                sentiment.stability > 70 ? 'bg-green-500' : 
                sentiment.stability > 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${sentiment.stability}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Based on last {recentMessages.length} messages</span>
          {isLive && (
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-6 px-2">
              <ArrowsClockwise size={12} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
