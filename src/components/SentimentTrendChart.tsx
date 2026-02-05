import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "@/lib/types";
import { ChartLine } from "@phosphor-icons/react";
import { useMemo } from "react";
import { safeParseDate } from "@/lib/utils";

interface SentimentTrendChartProps {
  messages: ChatMessage[];
}

export function SentimentTrendChart({ messages }: SentimentTrendChartProps) {
  const trendData = useMemo(() => {
    if (messages.length === 0) return [];

    const dataPoints: { time: string; score: number; count: number }[] = [];
    const windowSize = 10;

    for (let i = windowSize; i <= messages.length; i++) {
      const window = messages.slice(i - windowSize, i);
      const score = window.reduce((sum, msg) => {
        if (msg.sentiment === 'positive') return sum + 1;
        if (msg.sentiment === 'negative') return sum - 1;
        return sum;
      }, 0) / windowSize;

      const timestamp = safeParseDate(window[window.length - 1].timestamp);
      const timeLabel = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

      dataPoints.push({
        time: timeLabel,
        score,
        count: i,
      });
    }

    return dataPoints.filter((_, index) => index % Math.ceil(dataPoints.length / 30) === 0 || index === dataPoints.length - 1);
  }, [messages]);

  const maxScore = Math.max(...trendData.map(d => Math.abs(d.score)), 1);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLine size={20} weight="bold" className="text-primary" />
          Sentiment Trend Over Time
        </CardTitle>
        <CardDescription>Rolling average of chat sentiment (last 10 messages)</CardDescription>
      </CardHeader>
      <CardContent>
        {trendData.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-center">
            <div className="space-y-2">
              <ChartLine size={48} className="mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Not enough messages to show trend
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative h-[200px] bg-gradient-to-b from-transparent via-muted/20 to-transparent rounded-lg overflow-hidden border border-border/30">
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 border-b border-dashed border-green-500/20 flex items-center">
                  <span className="text-xs text-green-500/50 px-2">Positive</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex-1 border-t border-dashed border-red-500/20 flex items-center">
                  <span className="text-xs text-red-500/50 px-2">Negative</span>
                </div>
              </div>

              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="rgb(234, 179, 8)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                
                <polyline
                  fill="url(#sentimentGradient)"
                  stroke="none"
                  points={trendData.map((d, i) => {
                    const x = (i / (trendData.length - 1)) * 100;
                    const y = 50 - (d.score / maxScore) * 45;
                    return `${x}%,${y}%`;
                  }).join(' ') + ` 100%,100% 0%,100%`}
                />
                
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                  points={trendData.map((d, i) => {
                    const x = (i / (trendData.length - 1)) * 100;
                    const y = 50 - (d.score / maxScore) * 45;
                    return `${x}%,${y}%`;
                  }).join(' ')}
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <span>{trendData[0]?.time || 'Start'}</span>
              <span>{trendData[trendData.length - 1]?.time || 'Now'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center p-2 rounded bg-green-500/10">
                <div className="text-lg font-bold text-green-500">
                  {trendData.filter(d => d.score > 0.2).length}
                </div>
                <div className="text-xs text-muted-foreground">Positive Peaks</div>
              </div>
              <div className="text-center p-2 rounded bg-yellow-500/10">
                <div className="text-lg font-bold text-yellow-500">
                  {trendData.filter(d => Math.abs(d.score) <= 0.2).length}
                </div>
                <div className="text-xs text-muted-foreground">Neutral Periods</div>
              </div>
              <div className="text-center p-2 rounded bg-red-500/10">
                <div className="text-lg font-bold text-red-500">
                  {trendData.filter(d => d.score < -0.2).length}
                </div>
                <div className="text-xs text-muted-foreground">Negative Dips</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
