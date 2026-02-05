import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lightning, HandWaving, Heart, Question, GameController, Fire, Sparkle } from "@phosphor-icons/react";
import { toast } from "sonner";

interface QuickActionsProps {
  onActionClick: (template: string) => void;
  onCustomAction: (text: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  category: "greeting" | "gratitude" | "hype" | "question" | "gameplay";
  template: string;
  color: "primary" | "secondary" | "accent" | "destructive";
}

const quickActions: QuickAction[] = [
  {
    id: "welcome",
    label: "Welcome",
    icon: HandWaving,
    category: "greeting",
    template: "Welcome to the stream! Thanks for being here! 👋",
    color: "primary",
  },
  {
    id: "thanks",
    label: "Thank You",
    icon: Heart,
    category: "gratitude",
    template: "Thank you so much for your support! Really appreciate you! 💜",
    color: "accent",
  },
  {
    id: "hype",
    label: "Get Hyped",
    icon: Fire,
    category: "hype",
    template: "Let's gooo! This is going to be epic! 🔥",
    color: "destructive",
  },
  {
    id: "question",
    label: "Ask Question",
    icon: Question,
    category: "question",
    template: "What do you all think we should do next? Let me know in chat! 🤔",
    color: "accent",
  },
  {
    id: "gg",
    label: "Game Over - GG",
    icon: GameController,
    category: "gameplay",
    template: "GG! That was intense! 🎮",
    color: "secondary",
  },
  {
    id: "clutch",
    label: "Clutch Play",
    icon: Sparkle,
    category: "gameplay",
    template: "That was clutch! Did you see that?! ✨",
    color: "accent",
  },
  {
    id: "brb",
    label: "Be Right Back",
    icon: HandWaving,
    category: "greeting",
    template: "Be right back everyone! Don't go anywhere! ⏸️",
    color: "primary",
  },
  {
    id: "starting",
    label: "Starting Soon",
    icon: Lightning,
    category: "greeting",
    template: "Starting in just a moment! Get hyped! 🚀",
    color: "destructive",
  },
];

const categories = [
  { value: "all", label: "All" },
  { value: "greeting", label: "Greeting" },
  { value: "gratitude", label: "Gratitude" },
  { value: "hype", label: "Hype" },
  { value: "question", label: "Question" },
  { value: "gameplay", label: "Gameplay" },
];

export function QuickActionsPanel({ onActionClick, onCustomAction }: QuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customText, setCustomText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredActions = selectedCategory === "all"
    ? quickActions
    : quickActions.filter(action => action.category === selectedCategory);

  const handleActionClick = (template: string) => {
    onActionClick(template);
    toast.success("Quick action sent!");
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onCustomAction(customText);
      setCustomText("");
      toast.success("Custom message sent!");
    }
  };

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a short, engaging stream message that would be fun to send to chat. Make it natural and conversational. Keep it 1-2 sentences.`;
      const response = await window.spark.llm(prompt, "gpt-4o");
      setCustomText(response.trim());
      toast.success("AI message generated!");
    } catch (error) {
      toast.error("Failed to generate message");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getColorClasses = (color: QuickAction["color"]) => {
    switch (color) {
      case "primary":
        return "bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary";
      case "secondary":
        return "bg-secondary/10 hover:bg-secondary/20 border-secondary/30 text-secondary";
      case "accent":
        return "bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent";
      case "destructive":
        return "bg-destructive/10 hover:bg-destructive/20 border-destructive/30 text-destructive";
      default:
        return "bg-muted hover:bg-muted/80 border-border";
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightning size={24} weight="bold" className="text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          One-click preset messages for common stream moments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.template)}
              className={`p-4 rounded-lg border transition-all text-left group ${getColorClasses(action.color)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <action.icon size={20} weight="bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1">{action.label}</div>
                  <div className="text-xs opacity-80 line-clamp-2">{action.template}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Sparkle size={20} weight="bold" className="text-accent" />
            <h4 className="font-semibold">Custom Message</h4>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type a custom message..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomSubmit();
                }
              }}
            />
            <Button onClick={handleCustomSubmit} disabled={!customText.trim()}>
              Send
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerateCustom}
            disabled={isGenerating}
          >
            <Sparkle size={16} weight="bold" className="mr-2" />
            {isGenerating ? "Generating..." : "AI Generate Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
