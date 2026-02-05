import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lightning,
  ChatCircle,
  Heart,
  Fire,
  Question,
  GameController,
  HandWaving,
  Sparkle,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  category: "greeting" | "gratitude" | "hype" | "question" | "engagement";
  template: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "welcome",
    label: "Welcome Message",
    icon: HandWaving,
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
    icon: Question,
    category: "question",
    template: "What do you all think? Let me know in chat! 💬",
    color: "secondary",
  },
  {
    id: "thank-sub",
    label: "Thank for Sub",
    icon: Sparkle,
    category: "gratitude",
    template: "Thank you for the sub! You're amazing! ✨",
    color: "accent",
  },
  {
    id: "start-game",
    label: "Starting Game",
    icon: GameController,
    category: "engagement",
    template: "Alright chat, let's get into it! 🎮",
    color: "primary",
  },
  {
    id: "clutch",
    label: "Clutch Play!",
    icon: Fire,
    category: "hype",
    template: "THAT WAS A CLUTCH PLAY! Did you see that?! 🔥",
    color: "destructive",
  },
  {
    id: "brb",
    label: "Be Right Back",
    icon: ChatCircle,
    category: "engagement",
    template: "BRB, chat! I'll be back in just a moment! 👋",
    color: "muted",
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
    { value: "greeting", label: "Greetings", icon: HandWaving },
    { value: "gratitude", label: "Gratitude", icon: Heart },
    { value: "hype", label: "Hype", icon: Fire },
    { value: "question", label: "Questions", icon: Question },
    { value: "engagement", label: "Engagement", icon: ChatCircle },
  ];

  const filteredActions =
    selectedCategory === "all"
      ? quickActions
      : quickActions.filter((a) => a.category === selectedCategory);

  const handleActionClick = (action: QuickAction) => {
    onActionClick(action.template);
    toast.success(`Sent: ${action.label}`);
  };

  const handleGenerateCustom = async () => {
    if (!onCustomAction) return;

    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a short, energetic streaming message (1-2 sentences) that would be good for engaging with chat. Include 1-2 emojis.`;
      const response = await window.spark.llm(prompt, "gpt-4o-mini");
      onCustomAction(response.trim());
      toast.success("Custom message generated!");
    } catch (error) {
      toast.error("Failed to generate custom message");
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
            <CardDescription>
              One-click messages for common stream moments
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
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
          <div className="pt-4 border-t border-border/50">
            <Button
              onClick={handleGenerateCustom}
              disabled={isGenerating}
              variant="secondary"
              className="w-full gap-2"
            >
              <Sparkle size={18} weight="bold" />
              {isGenerating ? "Generating..." : "Generate AI Message"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
