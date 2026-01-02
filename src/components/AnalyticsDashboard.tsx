import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsData, ChatMessage, SentimentData } from "@/lib/types";
import { ChartLine, ChatCircle, Lightning, TrendUp, Smiley, SmileyMeh, SmileyXEyes, Hash } from "@phosphor-icons/react";
import { useMemo } from "react";

interface AnalyticsDashboardProps {
  messages: ChatMessage[];
}

export function AnalyticsDashboard({ messages }: AnalyticsDashboardProps) {
  const analytics: AnalyticsData = useMemo(() => {
    const aiMessages = messages.filter(m => m.sender === 'ai');
    const sentimentCounts = messages.reduce(
      (acc, msg) => {
        if (msg.sentiment) acc[msg.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const keywords = messages
      .map(m => m.content.toLowerCase().split(/\s+/))
      .flat()
      .filter(word => word.length > 4)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topKeywords = Object.entries(keywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    const messagesPerHour = messages.reduce((acc, msg) => {
      const hour = new Date(msg.timestamp).getHours();
      const key = `${hour}:00`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const hourData = Object.entries(messagesPerHour)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, count]) => ({ hour, count }));

    const totalRating = aiMessages.reduce((sum, msg) => {
      if (msg.votes) {
        return sum + (msg.votes.up - msg.votes.down);
      }
      return sum;
    }, 0);
    const avgRating = aiMessages.length > 0 ? totalRating / aiMessages.length : 0;

    return {
      totalMessages: messages.length,
      aiResponses: aiMessages.length,
      averageResponseTime: 1.2,
      sentimentBreakdown: sentimentCounts,
      topKeywords,
      messagesPerHour: hourData,
      responseRating: avgRating,
    };
  }, [messages]);

  const sentimentPercentages = useMemo(() => {
    const total = analytics.sentimentBreakdown.positive + 
                  analytics.sentimentBreakdown.neutral + 
                  analytics.sentimentBreakdown.negative;
    
    if (total === 0) return { positive: 0, neutral: 0, negative: 0 };
    
    return {
      positive: (analytics.sentimentBreakdown.positive / total) * 100,
      neutral: (analytics.sentimentBreakdown.neutral / total) * 100,
      negative: (analytics.sentimentBreakdown.negative / total) * 100,
    };
  }, [analytics.sentimentBreakdown]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ChatCircle size={16} weight="fill" className="text-primary" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">All chat messages</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightning size={16} weight="fill" className="text-accent" />
              AI Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.aiResponses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.totalMessages > 0 
                ? `${Math.round((analytics.aiResponses / analytics.totalMessages) * 100)}% of total`
                : '0% of total'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendUp size={16} weight="bold" className="text-secondary" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.averageResponseTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">Average time to respond</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smiley size={16} weight="fill" className="text-green-500" />
              Response Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.responseRating >= 0 ? '+' : ''}{analytics.responseRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Upvotes - downvotes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sentiment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Overall mood of chat messages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smiley size={20} weight="fill" className="text-green-500" />
                      <span className="font-medium">Positive</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.sentimentBreakdown.positive} ({sentimentPercentages.positive.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${sentimentPercentages.positive}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SmileyMeh size={20} weight="fill" className="text-yellow-500" />
                      <span className="font-medium">Neutral</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.sentimentBreakdown.neutral} ({sentimentPercentages.neutral.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${sentimentPercentages.neutral}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SmileyXEyes size={20} weight="fill" className="text-red-500" />
                      <span className="font-medium">Negative</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {analytics.sentimentBreakdown.negative} ({sentimentPercentages.negative.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${sentimentPercentages.negative}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Messages Per Hour</CardTitle>
              <CardDescription>Chat activity distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {analytics.messagesPerHour.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ChartLine size={48} weight="thin" className="mx-auto mb-4 opacity-50" />
                    <p>No activity data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.messagesPerHour.map((data) => (
                      <div key={data.hour} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{data.hour}</span>
                          <span className="text-muted-foreground">{data.count} messages</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ 
                              width: `${(data.count / Math.max(...analytics.messagesPerHour.map(d => d.count))) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Keywords</CardTitle>
              <CardDescription>Most frequently used words in chat</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topKeywords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Hash size={48} weight="thin" className="mx-auto mb-4 opacity-50" />
                  <p>No keyword data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.topKeywords.map((keyword, index) => (
                    <div key={keyword.word} className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{keyword.word}</span>
                          <span className="text-sm text-muted-foreground">{keyword.count}x</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-accent transition-all duration-500"
                            style={{ 
                              width: `${(keyword.count / Math.max(...analytics.topKeywords.map(k => k.count))) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
