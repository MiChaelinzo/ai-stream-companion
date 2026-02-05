import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Lightning,
  Question,
  Heart,
  Fire,
  GameController,
  HandWaving,
  Sparkle,
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  category: "greeting" | "gratitude" | "hype" | "question" | "gameplay";
  template: string;
  color: "primary" | "accent" | "secondary" | "destructive";
}

const quickActions: QuickAction[] = [
  {
    id: "welcome",
    label: "Welcome Viewer",
    icon: HandWaving,
    category: "greeting",
    template: "Hey everyone! Welcome to the stream! Glad to have you here! 👋",
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
    color: "primary",
  },
  {
    id: "gameplay",
    label: "Gameplay Comment",
    icon: GameController,
    category: "gameplay",
    template: "This game is so fun! What are you all playing today? 🎮",
    color: "secondary",
  },
];

const categories = [
  { value: "all", label: "All" },
  { value: "greeting", label: "Greetings" },
  { value: "gratitude", label: "Gratitude" },
  { value: "hype", label: "Hype" },
  { value: "question", label: "Questions" },
  { value: "gameplay", label: "Gameplay" },
];

interface QuickActionsPanelProps {
  onActionClick: (template: string) => void;
  onCustomAction: (text: string) => void;
}

export function QuickActionsPanel({ onActionClick, onCustomAction }: QuickActionsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customText, setCustomText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredActions = selectedCategory === "all"
    ? quickActions
    : quickActions.filter(action => action.category === selectedCategory);

  const handleActionClick = (template: string) => {
    onActionClick(template);
    toast.success("Message sent!");
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onCustomAction(customText);
      toast.success("Custom message sent!");
      setCustomText("");
    }
  };

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    try {
      const prompt = (window.spark.llmPrompt as any)`Generate a friendly, engaging stream message that a streamer could send to their chat. Make it 1-2 sentences, casual, and include an appropriate emoji. Just return the message, nothing else.`;
      const response = await window.spark.llm(prompt, "gpt-4o-mini");
      setCustomText(response.trim());
      toast.success("AI message generated!");
    } catch (error) {
      toast.error("Failed to generate message");
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
          <TabsList className="w-full flex-wrap h-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                <span>{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-3 mt-4">
            {filteredActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleActionClick(action.template)}
                className="w-full justify-start h-auto py-3"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-md bg-${action.color}/10`}>
                    <action.icon size={20} weight="bold" className={`text-${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{action.label}</span>
                      <Badge variant="secondary" className="text-xs">{action.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{action.template}</p>
                  </div>
                </div>
              </Button>
            ))}
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t space-y-3">
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
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className="w-full"
          >
            <Sparkle size={16} weight="bold" className="mr-2" />
            {isGenerating ? "Generating..." : "Generate AI Message"}
          </Button>
        </div>

        <Badge variant="outline" className="text-xs">
          <Lightning size={12} weight="bold" className="mr-1" />
          <span>Click any action to send to chat instantly</span>
        </Badge>
      </CardContent>
    </Card>
  );
}
