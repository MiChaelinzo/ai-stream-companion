import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Slider
} from "@/components/ui/slider";
import {
  Sparkle,
  Fire,
  ChatCircleDots,
  Trophy,
  Star,
  Lightning,
  TrendUp,
  Video,
  Download,
  Play,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { ChatMessage, StreamHighlight } from "@/lib/types";
import { safeParseDate } from "@/lib/utils";

interface StreamHighlightsDetectorProps {
  messages: ChatMessage[];
  isLive: boolean;
  onHighlightDetected?: (highlight: StreamHighlight) => void;
}

export function StreamHighlightsDetector({
  messages,
  isLive,
  onHighlightDetected,
}: StreamHighlightsDetectorProps) {
  const [highlights, setHighlights] = useState<StreamHighlight[]>([]);
  const [autoDetectEnabled, setAutoDetectEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(50);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!autoDetectEnabled || !isLive) return;

    const interval = setInterval(() => {
      analyzeForHighlights();
    }, 10000);

    return () => clearInterval(interval);
  }, [messages, autoDetectEnabled, isLive, sensitivity]);

  const analyzeForHighlights = async () => {
    if (isAnalyzing) return;

    const now = Date.now();
    const recentWindow = 30000;
    const recentMessages = messages.filter(
      (m) => safeParseDate(m.timestamp).getTime() > now - recentWindow
    );

    if (recentMessages.length === 0) return;

    setIsAnalyzing(true);

    try {
      const chatSpike = detectChatSpike(recentMessages);
      if (chatSpike) {
        addHighlight(chatSpike);
      }

      const sentimentPeak = detectSentimentPeak(recentMessages);
      if (sentimentPeak) {
        addHighlight(sentimentPeak);
      }

      const keyMoment = await detectKeyMoment(recentMessages);
      if (keyMoment) {
        addHighlight(keyMoment);
      }
    } catch (error) {
      console.error("Failed to analyze highlights:", error);
    } finally {
      setIsAnalyzing(false);
      setLastCheckTime(now);
    }
  };

  const detectChatSpike = (recentMessages: ChatMessage[]): StreamHighlight | null => {
    const threshold = 5 + (sensitivity / 10);
    
    if (recentMessages.length < threshold) return null;

    const averageRate = messages.length / Math.max(1, (Date.now() - safeParseDate(messages[0]?.timestamp || Date.now()).getTime()) / 60000);
    const currentRate = recentMessages.length / 0.5;

    if (currentRate > averageRate * 2 && currentRate > threshold) {
      return {
        id: Date.now().toString() + '_spike',
        timestamp: new Date(),
        type: 'chat-spike',
        title: '🔥 Chat Activity Spike!',
        description: `Chat exploded with ${recentMessages.length} messages in 30 seconds!`,
        intensity: Math.min(100, (currentRate / averageRate) * 30),
        context: {
          messageCount: recentMessages.length,
        },
        autoDetected: true,
        clipWorthy: currentRate > averageRate * 3,
      };
    }

    return null;
  };

  const detectSentimentPeak = (recentMessages: ChatMessage[]): StreamHighlight | null => {
    const messagesWithSentiment = recentMessages.filter((m) => m.sentiment);
    if (messagesWithSentiment.length < 3) return null;

    const positiveCount = messagesWithSentiment.filter((m) => m.sentiment === 'positive').length;
    const positiveRatio = positiveCount / messagesWithSentiment.length;

    const threshold = 0.7 + (sensitivity / 200);

    if (positiveRatio > threshold) {
      return {
        id: Date.now().toString() + '_sentiment',
        timestamp: new Date(),
        type: 'sentiment-peak',
        title: '⭐ Amazing Vibes!',
        description: `Chat is ${(positiveRatio * 100).toFixed(0)}% positive right now! Great energy!`,
        intensity: positiveRatio * 100,
        context: {
          averageSentiment: positiveRatio,
          messageCount: messagesWithSentiment.length,
        },
        autoDetected: true,
        clipWorthy: positiveRatio > 0.9,
      };
    }

    return null;
  };

  const detectKeyMoment = async (recentMessages: ChatMessage[]): Promise<StreamHighlight | null> => {
    if (recentMessages.length < 5) return null;

    const messageTexts = recentMessages.slice(-10).map((m) => m.content).join(' | ');

    try {
      const prompt = (window.spark.llmPrompt as any)`Analyze these recent chat messages from a livestream to detect if a KEY MOMENT just happened.

Messages: "${messageTexts}"

A key moment could be:
- An epic play/clutch moment
- Something funny/hilarious happened
- A milestone reached
- An unexpected/surprising event
- A fail/mistake
- Something wholesome/heartwarming

Return JSON:
{
  "isKeyMoment": true/false,
  "type": "epic|funny|milestone|surprising|fail|wholesome",
  "title": "short catchy title (max 6 words)",
  "description": "brief description (max 20 words)",
  "intensity": 1-100,
  "clipWorthy": true/false,
  "keyPhrases": ["phrase1", "phrase2"]
}

If NOT a key moment, return: {"isKeyMoment": false}`;

      const response = await window.spark.llm(prompt, "gpt-4o-mini", true);
      const analysis = JSON.parse(response);

      if (analysis.isKeyMoment) {
        return {
          id: Date.now().toString() + '_moment',
          timestamp: new Date(),
          type: 'key-moment',
          title: `✨ ${analysis.title}`,
          description: analysis.description,
          intensity: analysis.intensity,
          context: {
            keyPhrases: analysis.keyPhrases,
            messageCount: recentMessages.length,
          },
          autoDetected: true,
          clipWorthy: analysis.clipWorthy,
        };
      }
    } catch (error) {
      console.error('Failed to detect key moment:', error);
    }

    return null;
  };

  const addHighlight = (highlight: StreamHighlight) => {
    const exists = highlights.some(
      (h) =>
        h.type === highlight.type &&
        safeParseDate(h.timestamp).getTime() > Date.now() - 60000
    );

    if (exists) return;

    setHighlights((prev) => [highlight, ...prev].slice(0, 50));
    
    if (onHighlightDetected) {
      onHighlightDetected(highlight);
    }

    if (highlight.clipWorthy) {
      toast.success(`🎬 ${highlight.title}`, {
        description: "This moment is clip-worthy! " + highlight.description,
        duration: 5000,
      });
    } else {
      toast.info(highlight.title, {
        description: highlight.description,
        duration: 3000,
      });
    }
  };

  const manualAddHighlight = async () => {
    const prompt = (window.spark.llmPrompt as any)`Generate a generic highlight title and description for a livestream moment that just happened. Make it exciting and engaging!

Return JSON:
{
  "title": "exciting title",
  "description": "brief description"
}`;

    try {
      const response = await window.spark.llm(prompt, "gpt-4o-mini", true);
      const data = JSON.parse(response);

      const highlight: StreamHighlight = {
        id: Date.now().toString() + '_manual',
        timestamp: new Date(),
        type: 'key-moment',
        title: `🎯 ${data.title}`,
        description: data.description,
        intensity: 75,
        context: {},
        autoDetected: false,
        clipWorthy: true,
      };

      addHighlight(highlight);
    } catch (error) {
      toast.error("Failed to create highlight");
    }
  };

  const getHighlightIcon = (type: StreamHighlight['type']) => {
    switch (type) {
      case 'chat-spike':
        return ChatCircleDots;
      case 'sentiment-peak':
        return Star;
      case 'key-moment':
        return Sparkle;
      case 'milestone':
        return Trophy;
      case 'interaction':
        return Lightning;
      default:
        return Fire;
    }
  };

  const getHighlightColor = (intensity: number) => {
    if (intensity >= 80) return 'text-destructive';
    if (intensity >= 60) return 'text-accent';
    if (intensity >= 40) return 'text-primary';
    return 'text-secondary';
  };

  const recentHighlights = highlights.slice(0, 10);
  const clipWorthyCount = highlights.filter((h) => h.clipWorthy).length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkle size={24} weight="bold" className="text-accent" />
              Stream Highlights Detector
            </CardTitle>
            <CardDescription>AI-powered detection of exciting stream moments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <Video size={14} />
              {clipWorthyCount} clips
            </Badge>
            <Badge variant="outline" className="gap-1">
              <TrendUp size={14} />
              {highlights.length} total
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-detect">Auto-Detection</Label>
              <p className="text-xs text-muted-foreground">
                Automatically detect exciting moments
              </p>
            </div>
            <Switch
              id="auto-detect"
              checked={autoDetectEnabled}
              onCheckedChange={setAutoDetectEnabled}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sensitivity</Label>
              <span className="text-sm text-muted-foreground">{sensitivity}%</span>
            </div>
            <Slider
              value={[sensitivity]}
              onValueChange={([value]) => setSensitivity(value)}
              min={10}
              max={100}
              step={10}
              disabled={!autoDetectEnabled}
            />
            <p className="text-xs text-muted-foreground">
              {sensitivity < 40 && "Low - Only major moments"}
              {sensitivity >= 40 && sensitivity < 70 && "Medium - Balanced detection"}
              {sensitivity >= 70 && "High - Capture more moments"}
            </p>
          </div>

          <Button
            onClick={manualAddHighlight}
            disabled={!isLive}
            className="w-full gap-2"
            variant="outline"
          >
            <Play size={20} weight="bold" />
            Mark Current Moment as Highlight
          </Button>
        </div>

        {recentHighlights.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-muted-foreground">Recent Highlights</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHighlights([])}
              >
                Clear All
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {recentHighlights.map((highlight) => {
                  const Icon = getHighlightIcon(highlight.type);
                  const colorClass = getHighlightColor(highlight.intensity);

                  return (
                    <div
                      key={highlight.id}
                      className={`p-4 rounded-lg border ${
                        highlight.clipWorthy
                          ? 'border-accent/50 bg-accent/10'
                          : 'border-border/50 bg-card/50'
                      } space-y-2`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              highlight.clipWorthy ? 'bg-accent/20' : 'bg-muted'
                            }`}
                          >
                            <Icon size={20} weight="bold" className={colorClass} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{highlight.title}</h4>
                              {highlight.clipWorthy && (
                                <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                                  <Video size={12} className="mr-1" />
                                  Clip-Worthy
                                </Badge>
                              )}
                              {!highlight.autoDetected && (
                                <Badge variant="outline" className="text-xs">
                                  Manual
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {highlight.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{safeParseDate(highlight.timestamp).toLocaleTimeString()}</span>
                              <span>•</span>
                              <span>Intensity: {highlight.intensity}%</span>
                              {highlight.context.messageCount && (
                                <>
                                  <span>•</span>
                                  <span>{highlight.context.messageCount} messages</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {highlight.context.keyPhrases && highlight.context.keyPhrases.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {highlight.context.keyPhrases.map((phrase, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {phrase}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Sparkle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">No highlights detected yet</p>
            <p className="text-sm mt-1">Start streaming and exciting moments will appear here!</p>
          </div>
        )}

        {highlights.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{highlights.length}</div>
              <div className="text-xs text-muted-foreground">Total Highlights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{clipWorthyCount}</div>
              <div className="text-xs text-muted-foreground">Clip-Worthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {highlights.filter((h) => h.autoDetected).length}
              </div>
              <div className="text-xs text-muted-foreground">Auto-Detected</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
