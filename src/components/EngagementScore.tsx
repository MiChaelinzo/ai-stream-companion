import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChatMessage, EngagementMetrics } from "@/lib/types";
import { TrendUp, TrendDown, Minus, Fire, Users, Lightning } from "@phosphor-icons/react";
import { useMemo } from "react";

interface EngagementScoreProps {
  messages: ChatMessage[];
  isLive: boolean;
}

export function EngagementScore({ messages, isLive }: EngagementScoreProps) {
  const engagement: EngagementMetrics = useMemo(() => {
    if (messages.length === 0) {
      return {
        score: 0,
        level: 'low',
        messageRate: 0,
        responseRate: 0,
        sentimentTrend: 'stable',
      };
    }

    const recentMessages = messages.slice(-20);
    const olderMessages = messages.slice(-40, -20);

    const recentSentimentScore = recentMessages.reduce((sum, msg) => {
      if (msg.sentiment === 'positive') return sum + 1;
      if (msg.sentiment === 'negative') return sum - 0.5;
      return sum;
    }, 0) / recentMessages.length;

    const olderSentimentScore = olderMessages.length > 0
      ? olderMessages.reduce((sum, msg) => {
          if (msg.sentiment === 'positive') return sum + 1;
          if (msg.sentiment === 'negative') return sum - 0.5;
          return sum;
        }, 0) / olderMessages.length
      : recentSentimentScore;

    let sentimentTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentSentimentScore - olderSentimentScore > 0.15) sentimentTrend = 'improving';
    else if (recentSentimentScore - olderSentimentScore < -0.15) sentimentTrend = 'declining';

    const now = new Date();
    const recentTime = messages.length > 0 
      ? (now.getTime() - new Date(messages[0].timestamp).getTime()) / 1000 / 60
      : 1;
    const messageRate = messages.length / Math.max(recentTime, 1);

    const aiMessages = messages.filter(m => m.sender === 'ai').length;
    const userMessages = messages.filter(m => m.sender === 'user').length;
    const responseRate = userMessages > 0 ? aiMessages / userMessages : 0;

    const uniqueUsers = new Set(
      messages.filter(m => m.username).map(m => m.username)
    ).size;

    const engagementScore = Math.min(100, 
      (recentSentimentScore * 30) +
      (Math.min(messageRate * 5, 30)) +
      (responseRate * 20) +
      (Math.min(uniqueUsers * 2, 20))
    );

    let level: 'low' | 'medium' | 'high' | 'very-high' = 'low';
    if (engagementScore >= 75) level = 'very-high';
    else if (engagementScore >= 50) level = 'high';
    else if (engagementScore >= 25) level = 'medium';

    return {
      score: Math.max(0, engagementScore),
      level,
      messageRate,
      responseRate,
      sentimentTrend,
    };
  }, [messages]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'high': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
      default: return 'text-muted-foreground border-border bg-muted/30';
    }
  };

  const getLevelIcon = (level: string) => {
    if (level === 'very-high' || level === 'high') {
      return <Fire size={20} weight="fill" className="animate-pulse" />;
    }
    return <Users size={20} weight="fill" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendUp size={16} weight="bold" className="text-green-500" />;
      case 'declining': return <TrendDown size={16} weight="bold" className="text-red-500" />;
      default: return <Minus size={16} weight="bold" className="text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightning size={20} weight="fill" className="text-accent" />
          Engagement Score
        </CardTitle>
        <CardDescription>Overall chat engagement and activity level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center bg-card">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  {Math.round(engagement.score)}
                </div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={`${getLevelColor(engagement.level)} px-4 py-2 text-sm font-semibold uppercase tracking-wide`}
          >
            {getLevelIcon(engagement.level)}
            <span className="ml-2">{engagement.level.replace('-', ' ')} Engagement</span>
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Engagement Level</span>
              <span className="font-medium">{Math.round(engagement.score)}%</span>
            </div>
            <Progress value={engagement.score} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div className="p-3 rounded-lg bg-background/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Message Rate</span>
                <Lightning size={14} weight="fill" className="text-primary" />
              </div>
              <p className="text-lg font-bold">
                {engagement.messageRate.toFixed(1)}
                <span className="text-xs font-normal text-muted-foreground ml-1">/min</span>
              </p>
            </div>

            <div className="p-3 rounded-lg bg-background/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Response Rate</span>
                <Users size={14} weight="fill" className="text-secondary" />
              </div>
              <p className="text-lg font-bold">
                {(engagement.responseRate * 100).toFixed(0)}
                <span className="text-xs font-normal text-muted-foreground ml-1">%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm font-medium">Sentiment Trend</span>
            <div className="flex items-center gap-2">
              {getTrendIcon(engagement.sentimentTrend)}
              <span className="text-sm font-semibold capitalize">{engagement.sentimentTrend}</span>
            </div>
          </div>
        </div>

        {!isLive && (
          <div className="text-xs text-center text-muted-foreground bg-muted/20 rounded-lg p-3">
            Start monitoring to track live engagement metrics
          </div>
        )}
      </CardContent>
    </Card>
  );
}
