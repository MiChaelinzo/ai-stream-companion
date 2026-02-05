import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightning,
  ChatCircle,
  Heart,
  Gift,
  Trophy,
  Smiley,
  Fire,
  Sparkle,
  GameController,
  Question,
  WarningCircle,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  category: "greeting" | "hype" | "gratitude" | "game" | "question" | "mod";
  template: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "welcome",
    label: "Welcome New Viewer",
    icon: Heart,
    category: "greeting",
    template: "Welcome to the stream! Thanks for joining us! 💜",
    color: "primary",
  },
  {
    id: "thank-follow",
    label: "Thank for Follow",
    icon: Heart,
    category: "gratitude",
    template: "Thank you so much for the follow! I really appreciate your support! 🙏",
    color: "accent",
  },
  {
    id: "hype-moment",
    label: "Hype Moment!",
    icon: Fire,
    category: "hype",
    template: "LET'S GOOOOO! That was INSANE! 🔥🔥🔥",
    color: "destructive",
  },
  {
    id: "ask-chat",
    label: "Ask Chat Question",
    icon: ChatCircle,
    category: "question",
    template: "What do you all think? Let me know in chat!",
    color: "secondary",
  },
  {
    id: "brb",
    label: "Be Right Back",
    icon: ChatCircle,
    category: "mod",
    template: "BRB! Taking a quick break, be back in a few minutes!",
    color: "muted",
  },
  {
    id: "thank-chat",
    label: "Thank Chat",
    icon: Sparkle,
    category: "gratitude",
    template: "You all are the best! Thanks for the amazing vibes today! ✨",
    color: "accent",
  },
  {
    id: "celebrate-win",
    label: "Celebrate Win",
    icon: Trophy,
    category: "hype",
    template: "WE DID IT! Victory secured! 🏆",
    color: "chart-1",
  },
  {
    id: "gg",
    label: "Good Game",
    icon: GameController,
    category: "game",
    template: "GG! That was a fun match!",
    color: "secondary",
  },
  {
    id: "raid-thanks",
    label: "Thank Raid",
    icon: Gift,
    category: "gratitude",
    template: "HUGE thanks for the raid! Welcome everyone! 🎉",
    color: "primary",
  },
  {
    id: "starting-soon",
    label: "Starting Soon",
    icon: Lightning,
    category: "mod",
    template: "Starting in just a few minutes! Get hyped! ⚡",
    color: "primary",
  },
  {
    id: "ending-stream",
    label: "Ending Stream",
    icon: Heart,
    category: "mod",
    template: "Thanks for hanging out today! See you next stream! 💜",
    color: "accent",
  },
  {
    id: "poll-question",
    label: "Poll Question",
    icon: Question,
    category: "question",
    template: "Drop your votes in chat! What should we do next?",
    color: "secondary",
  },
];

interface QuickActionsPanelProps {
  onActionClick: (template: string) => void;
  onCustomAction?: (text: string) => void;
}

export function QuickActionsPanel({ onActionClick, onCustomAction }: QuickActionsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: "all", label: "All", icon: Lightning },
    { value: "greeting", label: "Greetings", icon: Heart },
    { value: "hype", label: "Hype", icon: Fire },
    { value: "gratitude", label: "Thanks", icon: Sparkle },
    { value: "game", label: "Gaming", icon: GameController },
    { value: "question", label: "Questions", icon: Question },
    { value: "mod", label: "Moderation", icon: WarningCircle },
  ];

  const filteredActions =
    selectedCategory === "all"
      ? quickActions
      : quickActions.filter((action) => action.category === selectedCategory);

  const handleActionClick = (action: QuickAction) => {
    onActionClick(action.template);
    toast.success(`"${action.label}" message sent!`);
  };

  const handleGenerateCustom = async () => {
    if (!onCustomAction) return;
    
    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a unique, engaging stream message that would be perfect for the current moment. Make it fun, positive, and natural. Keep it 1-2 sentences. No emojis at the end.`;
      const response = await window.spark.llm(prompt, "gpt-4o-mini");
      await onCustomAction(response.trim());
      toast.success("Custom message generated!");
    } catch (error) {
      toast.error("Failed to generate custom message");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightning size={24} weight="bold" className="text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Instant responses for common stream moments</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredActions.length} actions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
              className="gap-2"
            >
              <cat.icon size={16} weight="bold" />
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:border-primary/50 transition-all"
              onClick={() => handleActionClick(action)}
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon size={20} weight="bold" className={`text-${action.color}`} />
                <span className="font-semibold text-sm">{action.label}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left line-clamp-2">
                {action.template}
              </p>
            </Button>
          ))}
        </div>

        {onCustomAction && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleGenerateCustom}
              disabled={isGenerating}
              className="w-full gap-2"
              variant="secondary"
            >
              <Sparkle size={18} weight="bold" />
              {isGenerating ? "Generating..." : "Generate Custom Message"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
