import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkle, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

interface AutoSSMLEnhancerProps {
  onEnhance: (text: string, sentiment: 'positive' | 'neutral' | 'negative') => Promise<string>;
}

export function AutoSSMLEnhancer({ onEnhance }: AutoSSMLEnhancerProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [examples, setExamples] = useState<Array<{ original: string; enhanced: string; sentiment: 'positive' | 'neutral' | 'negative' }>>([]);

  const testExamples = [
    { text: "That was an amazing play! Great job team!", sentiment: 'positive' as const },
    { text: "Welcome to the stream everyone! Thanks for joining!", sentiment: 'positive' as const },
    { text: "Hmm, that's interesting. Let me think about this.", sentiment: 'neutral' as const },
    { text: "Oh no! That didn't go as planned.", sentiment: 'negative' as const },
  ];

  const handleEnhance = async (text: string, sentiment: 'positive' | 'neutral' | 'negative') => {
    setIsEnhancing(true);
    try {
      const enhanced = await onEnhance(text, sentiment);
      setExamples(prev => [...prev, { original: text, enhanced, sentiment }]);
      toast.success("Text enhanced with SSML");
    } catch (error) {
      toast.error("Failed to enhance text");
      console.error(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-primary" />
          AI SSML Auto-Enhancement
        </CardTitle>
        <CardDescription>
          Automatically add SSML tags to AI responses based on sentiment and emotion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Test how AI can automatically enhance responses with SSML for more expressive speech:
          </p>
          
          <div className="grid gap-2">
            {testExamples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                className="justify-start text-left h-auto py-3"
                onClick={() => handleEnhance(example.text, example.sentiment)}
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
                  </div>
                  <div className="text-sm">{example.text}</div>
                </div>
                <Sparkle size={16} weight="fill" />
              </Button>
            ))}
          </div>
        </div>

        {examples.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle size={16} weight="bold" className="text-primary" />
              Enhanced Results
            </h3>
            {examples.map((example, i) => (
              <Card key={i} className="bg-muted/30">
                <CardContent className="pt-4 space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Original:</div>
                    <div className="text-sm">{example.original}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">SSML Enhanced:</div>
                    <code className="text-xs bg-background px-2 py-1 rounded block break-words">
                      {example.enhanced}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
