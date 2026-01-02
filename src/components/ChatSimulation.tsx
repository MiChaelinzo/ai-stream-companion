import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Stop, Users } from "@phosphor-icons/react";
import { useState } from "react";

interface ChatSimulationProps {
  onSimulateMessage: (message: string, sentiment: 'positive' | 'neutral' | 'negative') => void;
  isRunning: boolean;
  onToggle: () => void;
}

export function ChatSimulation({ onSimulateMessage, isRunning, onToggle }: ChatSimulationProps) {
  const [autoMode, setAutoMode] = useState(false);
  const [messageRate, setMessageRate] = useState<'slow' | 'medium' | 'fast'>('medium');

  const sampleMessages = {
    positive: [
      "This is so good! 🔥",
      "Love this content!",
      "Amazing gameplay!",
      "You're the best!",
      "This is so entertaining 😂",
      "Great stream today!",
      "Keep it up! ⚡",
      "Awesome! 👏",
      "Incredible play!",
      "This is perfect!",
    ],
    neutral: [
      "What game is this?",
      "When did you start?",
      "How long have you been playing?",
      "What's next?",
      "Interesting",
      "Hello everyone",
      "Just joined",
      "First time here",
      "What's happening?",
      "Can you explain?",
    ],
    negative: [
      "This is boring",
      "Not a fan of this",
      "Why are you doing that?",
      "This doesn't make sense",
      "I don't like this",
      "This is frustrating to watch",
      "Come on...",
      "Seriously?",
      "This is not good",
      "Can we do something else?",
    ],
  };

  const sendRandomMessage = () => {
    const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
    const weights = messageRate === 'fast' 
      ? [0.6, 0.3, 0.1] 
      : messageRate === 'medium' 
      ? [0.5, 0.3, 0.2] 
      : [0.4, 0.4, 0.2];
    
    const random = Math.random();
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    
    if (random < weights[0]) sentiment = 'positive';
    else if (random < weights[0] + weights[1]) sentiment = 'neutral';
    else sentiment = 'negative';

    const messages = sampleMessages[sentiment];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    onSimulateMessage(message, sentiment);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} weight="fill" className="text-primary" />
          Chat Simulation
        </CardTitle>
        <CardDescription>Simulate live chat messages for testing sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
          <div className="flex items-center gap-3">
            <Label htmlFor="auto-mode" className="text-sm font-medium cursor-pointer">
              Auto-generate messages
            </Label>
            {isRunning && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Running
              </Badge>
            )}
          </div>
          <Switch
            id="auto-mode"
            checked={isRunning}
            onCheckedChange={onToggle}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message-rate" className="text-sm font-medium">
            Message Rate
          </Label>
          <Select value={messageRate} onValueChange={(value) => setMessageRate(value as any)}>
            <SelectTrigger id="message-rate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow (1 msg/5s)</SelectItem>
              <SelectItem value="medium">Medium (1 msg/3s)</SelectItem>
              <SelectItem value="fast">Fast (1 msg/2s)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendRandomMessage()}
            disabled={isRunning}
            className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
          >
            Positive
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendRandomMessage()}
            disabled={isRunning}
            className="bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20"
          >
            Neutral
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sendRandomMessage()}
            disabled={isRunning}
            className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20"
          >
            Negative
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground bg-muted/20 rounded-lg p-3">
          {isRunning 
            ? 'Automatically generating messages to simulate chat activity...' 
            : 'Click a button above or enable auto-mode to simulate messages'}
        </div>
      </CardContent>
    </Card>
  );
}
