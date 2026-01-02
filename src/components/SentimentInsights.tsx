import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage, SentimentInsight } from "@/lib/types";
import { Lightbulb, Warning, CheckCircle, Info, Sparkle } from "@phosphor-icons/react";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

interface SentimentInsightsProps {
  messages: ChatMessage[];
}

export function SentimentInsights({ messages }: SentimentInsightsProps) {
  const insights: SentimentInsight[] = useMemo(() => {
    const generatedInsights: SentimentInsight[] = [];
    
    if (messages.length === 0) {
      return [{
        id: 'empty',
        type: 'info',
        title: 'Getting Started',
        message: 'Start chatting to receive AI-powered sentiment insights and recommendations.',
        timestamp: new Date(),
        actionable: false,
      }];
    }

    const recentMessages = messages.slice(-20);
    const negativeCount = recentMessages.filter(m => m.sentiment === 'negative').length;
    const positiveCount = recentMessages.filter(m => m.sentiment === 'positive').length;
    const neutralCount = recentMessages.filter(m => m.sentiment === 'neutral').length;

    if (negativeCount >= 5 && negativeCount > positiveCount) {
      generatedInsights.push({
        id: 'negative-spike',
        type: 'warning',
        title: 'Negative Sentiment Spike',
        message: 'Multiple negative messages detected. Consider addressing viewer concerns, changing gameplay, or engaging more positively with chat.',
        timestamp: new Date(),
        actionable: true,
      });
    }

    if (positiveCount >= 8) {
      generatedInsights.push({
        id: 'positive-engagement',
        type: 'success',
        title: 'High Positive Engagement',
        message: 'Chat is loving the content! This is a great time to encourage subscriptions, polls, or community activities.',
        timestamp: new Date(),
        actionable: true,
      });
    }

    const recentRate = recentMessages.length / Math.max((new Date().getTime() - new Date(messages[Math.max(0, messages.length - 20)].timestamp).getTime()) / 1000 / 60, 1);
    if (recentRate > 5) {
      generatedInsights.push({
        id: 'high-activity',
        type: 'success',
        title: 'High Chat Activity',
        message: `Chat is very active with ${recentRate.toFixed(1)} messages per minute. Great engagement!`,
        timestamp: new Date(),
        actionable: false,
      });
    } else if (recentRate < 0.5 && messages.length > 10) {
      generatedInsights.push({
        id: 'low-activity',
        type: 'info',
        title: 'Chat Activity is Low',
        message: 'Consider asking questions, starting a poll, or directly engaging with viewers to boost participation.',
        timestamp: new Date(),
        actionable: true,
      });
    }

    if (neutralCount === recentMessages.length && recentMessages.length >= 10) {
      generatedInsights.push({
        id: 'neutral-trend',
        type: 'info',
        title: 'Neutral Sentiment Pattern',
        message: 'Chat is relatively neutral. Try injecting more energy, humor, or exciting moments to elevate mood.',
        timestamp: new Date(),
        actionable: true,
      });
    }

    const aiResponses = recentMessages.filter(m => m.sender === 'ai').length;
    const userMessages = recentMessages.filter(m => m.sender === 'user').length;
    if (userMessages > 5 && aiResponses / userMessages < 0.3) {
      generatedInsights.push({
        id: 'low-response-rate',
        type: 'tip',
        title: 'AI Response Opportunity',
        message: 'Your AI companion could respond more frequently. Consider adjusting auto-response settings for better engagement.',
        timestamp: new Date(),
        actionable: true,
      });
    }

    const uniqueViewers = new Set(recentMessages.filter(m => m.username).map(m => m.username)).size;
    if (uniqueViewers >= 5) {
      generatedInsights.push({
        id: 'diverse-audience',
        type: 'success',
        title: 'Diverse Audience Engagement',
        message: `${uniqueViewers} unique viewers are participating in chat. Community is active and growing!`,
        timestamp: new Date(),
        actionable: false,
      });
    }

    if (generatedInsights.length === 0) {
      generatedInsights.push({
        id: 'all-good',
        type: 'success',
        title: 'Everything Looks Good',
        message: 'Chat sentiment is healthy and engagement is stable. Keep up the great work!',
        timestamp: new Date(),
        actionable: false,
      });
    }

    return generatedInsights;
  }, [messages]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Warning size={20} weight="fill" className="text-yellow-500" />;
      case 'success': return <CheckCircle size={20} weight="fill" className="text-green-500" />;
      case 'tip': return <Sparkle size={20} weight="fill" className="text-purple-500" />;
      default: return <Info size={20} weight="fill" className="text-blue-500" />;
    }
  };

  const getInsightVariant = (type: string): "default" | "destructive" => {
    if (type === 'warning') return 'destructive';
    return 'default';
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb size={20} weight="fill" className="text-accent" />
          AI Insights & Recommendations
        </CardTitle>
        <CardDescription>Smart suggestions based on chat sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {insights.map((insight) => (
              <Alert 
                key={insight.id} 
                variant={getInsightVariant(insight.type)}
                className="relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-50" />
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                    <AlertDescription className="text-sm">
                      {insight.message}
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground pt-1">
                      {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
