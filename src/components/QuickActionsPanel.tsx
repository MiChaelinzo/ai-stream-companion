import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChatCircle,
  Lightning,
  Question,
  Heart,
  Fire,
  GameController,
  HandWaving,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  category: "greeting" | "gratitude" | "hype" | "question" | "engagement";
  template: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "hello",
    label: "Welcome Viewers",
    icon: HandWaving,
    category: "greeting",
    template: "Hey everyone! Welcome to the stream! 👋",
    color: "primary",
  },
  {
    id: "thanks-follow",
    label: "Thank for Follow",
    icon: Heart,
    category: "gratitude",
    template: "Thanks so much for the follow! I really appreciate it! ❤️",
    color: "accent",
  },
  {
    id: "thanks-sub",
    label: "Thank for Sub",
    icon: Heart,
    category: "gratitude",
    template: "Thank you for subscribing! You're amazing! 🎉",
    color: "accent",
  },
  {
    id: "hype",
    label: "Hype Moment",
    icon: Fire,
    category: "hype",
    template: "LET'S GOOO! That was insane! 🔥🔥🔥",
    color: "destructive",
  },
  {
    id: "question",
    label: "Ask Question",
    icon: Question,
    category: "question",
    template: "What do you all think? Drop your thoughts in chat! 💭",
    color: "secondary",
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
      const prompt = (window.spark.llmPrompt as any)`Generate a short, engaging chat message for a streamer to send to their viewers. Make it friendly, natural, and conversational. Keep it to 1-2 sentences. Do not use quotation marks in the response.`;

      const response = await window.spark.llm(prompt, "gpt-4o");
      const message = response.trim();
      
      onCustomAction(message);
      toast.success("Generated custom message!");
    } catch (error) {
      toast.error("Failed to generate message");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
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
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full flex-wrap h-auto gap-2">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
                <cat.icon size={16} weight="bold" />
                <span>{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleGenerateCustom}
              disabled={isGenerating}
              className="w-full"
              variant="default"
            >
              <Lightning size={18} weight="bold" className="mr-2" />
              {isGenerating ? "Generating..." : "Generate AI Message"}
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {filteredActions.length} actions
          </Badge>
          <span>•</span>
          <span>Click any action to send instantly</span>
        </div>
      </CardContent>
    </Card>
  );
}
