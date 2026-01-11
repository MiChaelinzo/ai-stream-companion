import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkle, CheckCircle, Copy, Play, Trash, Brain, SpeakerHigh } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

interface AutoSSMLEnhancerProps {
  onEnhance: (text: string, sentiment: 'positive' | 'neutral' | 'negative') => Promise<string>;
}

interface EnhancedExample {
  original: string;
  enhanced: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  detectedEmotion?: string;
  timestamp: Date;
}

export function AutoSSMLEnhancer({ onEnhance }: AutoSSMLEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customText, setCustomText] = useState("");
  const [examples, setExamples] = useState<EnhancedExample[]>([]);
  const [detectedSentiment, setDetectedSentiment] = useState<'positive' | 'neutral' | 'negative' | null>(null);

  const testExamples = [
    { text: "That was an amazing play! Great job team!", sentiment: 'positive' as const, emotion: 'excited' },
    { text: "Welcome to the stream everyone! Thanks for joining!", sentiment: 'positive' as const, emotion: 'welcoming' },
    { text: "Hmm, that's interesting. Let me think about this.", sentiment: 'neutral' as const, emotion: 'thoughtful' },
    { text: "Oh no! That didn't go as planned.", sentiment: 'negative' as const, emotion: 'disappointed' },
    { text: "WOW! Did you see that?! That was INSANE!", sentiment: 'positive' as const, emotion: 'hyped' },
    { text: "Let's take a moment to discuss this strategy.", sentiment: 'neutral' as const, emotion: 'analytical' },
  ];

  const analyzeSentiment = async (text: string): Promise<'positive' | 'neutral' | 'negative'> => {
    setIsAnalyzing(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Analyze the sentiment and emotion of this text: "${text}"

Classify the overall sentiment as one of: positive, neutral, or negative.
Also identify the primary emotion (excited, happy, sad, angry, confused, thoughtful, etc.)

Return ONLY a JSON object with this format:
{
  "sentiment": "positive|neutral|negative",
  "emotion": "the primary emotion"
}`;

      const result = await window.spark.llm(prompt, "gpt-4o", true);
      const parsed = JSON.parse(result);
      
      return parsed.sentiment || 'neutral';
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return 'neutral';
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhance = async (text: string, sentiment: 'positive' | 'neutral' | 'negative', emotion?: string) => {
    if (!text.trim()) {
      toast.error("Please enter some text to enhance");
      return;
    }

    setIsEnhancing(true);
    try {
      const enhanced = await onEnhance(text, sentiment);
      const newExample: EnhancedExample = {
        original: text,
        enhanced,
        sentiment,
        detectedEmotion: emotion,
        timestamp: new Date()
      };
      setExamples(prev => [newExample, ...prev]);
      toast.success("✨ Text enhanced with expressive SSML!");
    } catch (error) {
      toast.error("Failed to enhance text");
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCustomEnhance = async () => {
    if (!customText.trim()) {
      toast.error("Please enter text to enhance");
      return;
    }

    const sentiment = await analyzeSentiment(customText);
    setDetectedSentiment(sentiment);
    await handleEnhance(customText, sentiment);
    setCustomText("");
    setDetectedSentiment(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleClear = () => {
    setExamples([]);
    toast.info("History cleared");
  };

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkle size={24} weight="fill" className="text-primary" />
          </div>
          AI SSML Auto-Enhancement
        </CardTitle>
        <CardDescription>
          Automatically add expressive SSML tags to any text based on AI-detected sentiment and emotion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain size={20} weight="fill" className="text-primary" />
            <h3 className="text-sm font-semibold">Custom Text Enhancement</h3>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="custom-text">Enter your text</Label>
              <Textarea
                id="custom-text"
                placeholder="Type any message to automatically enhance with SSML..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleCustomEnhance();
                  }
                }}
              />
              {detectedSentiment && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSentimentColor(detectedSentiment)}>
                    Detected: {detectedSentiment}
                  </Badge>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleCustomEnhance}
              disabled={isEnhancing || isAnalyzing || !customText.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="animate-pulse" size={18} weight="fill" />
                  Analyzing sentiment...
                </>
              ) : isEnhancing ? (
                <>
                  <Sparkle className="animate-pulse" size={18} weight="fill" />
                  Enhancing with SSML...
                </>
              ) : (
                <>
                  <Sparkle size={18} weight="fill" />
                  Auto-Enhance with AI
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Press Cmd/Ctrl + Enter to enhance
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SpeakerHigh size={20} weight="fill" className="text-accent" />
              <h3 className="text-sm font-semibold">Quick Test Examples</h3>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Try these pre-configured examples to see how AI enhances different sentiments
          </p>
          
          <div className="grid gap-2">
            {testExamples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                className="justify-start text-left h-auto py-3 hover:border-primary/50 transition-colors"
                onClick={() => handleEnhance(example.text, example.sentiment, example.emotion)}
                disabled={isEnhancing}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={example.sentiment === 'positive' ? 'default' : example.sentiment === 'negative' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {example.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground">• {example.emotion}</span>
                  </div>
                  <div className="text-sm">{example.text}</div>
                </div>
                <Sparkle size={16} weight="fill" className="text-primary/50" />
              </Button>
            ))}
          </div>
        </div>

        {examples.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle size={18} weight="bold" className="text-primary" />
                Enhanced Results ({examples.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash size={16} weight="bold" />
                Clear
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {examples.map((example, i) => (
                <Card key={i} className="bg-muted/30 border-primary/10 hover:border-primary/30 transition-colors">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={example.sentiment === 'positive' ? 'default' : example.sentiment === 'negative' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {example.sentiment}
                        </Badge>
                        {example.detectedEmotion && (
                          <span className="text-xs text-muted-foreground">
                            {example.detectedEmotion}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {example.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Original Text:</div>
                      <div className="text-sm bg-background/50 px-3 py-2 rounded">{example.original}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-2">
                        <Sparkle size={12} weight="fill" className="text-primary" />
                        SSML Enhanced:
                      </div>
                      <div className="relative">
                        <code className="text-xs bg-background px-3 py-2 rounded block break-words whitespace-pre-wrap font-mono">
                          {example.enhanced}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(example.enhanced)}
                          className="absolute top-1 right-1 h-7 w-7 p-0"
                        >
                          <Copy size={14} weight="bold" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        💡 This enhanced version includes prosody, emphasis, and natural pauses for more expressive speech
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {examples.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkle size={32} weight="fill" className="mx-auto mb-2 text-primary/30" />
            <p className="text-sm">No enhanced examples yet</p>
            <p className="text-xs mt-1">Try the examples above or enter custom text</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
