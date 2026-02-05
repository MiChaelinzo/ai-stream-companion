import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Heart, 
  HelpCircle, 
  Gamepad2, 
  Sparkles, 
  Hand, 
  Zap, 
  MessageSquare, 
  Wand2, 
  Send
} from "lucide-react";

// --- Types & Interfaces ---

interface QuickActionsProps {
  onActionClick: (template: string) => void;
  onCustomAction: (text: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: any; // Lucide Icon type
  template: string;
  category: "greeting" | "gratitude" | "hype" | "question" | "gameplay";
  color: "default" | "secondary" | "destructive" | "outline";
}

// --- Data Configuration ---

const quickActions: QuickAction[] = [
  {
    id: "thanks",
    label: "Thank You",
    icon: Heart,
    category: "gratitude",
    template: "Thank you so much for the support! You're amazing! 💜",
    color: "default", // mapped to primary
  },
  {
    id: "hype",
    label: "Hype Train",
    icon: Zap,
    category: "hype",
    template: "Let's gooo! This is getting intense! 🔥🚀",
    color: "destructive",
  },
  {
    id: "question",
    label: "Ask Chat",
    icon: HelpCircle,
    category: "question",
    template: "What do you all think? Let me know in chat! 👇",
    color: "secondary",
  },
  {
    id: "gg",
    label: "Good Game",
    icon: Gamepad2,
    category: "gameplay",
    template: "GG! That was a close one. 🎮",
    color: "outline",
  },
  {
    id: "clutch",
    label: "Clutch Moment",
    icon: Sparkles,
    category: "gameplay",
    template: "Totally meant to do that... Clutch! ✨",
    color: "default",
  },
  {
    id: "brb",
    label: "Be Right Back",
    icon: Hand,
    category: "greeting",
    template: "Be right back everyone! Don't go anywhere! ⏸️",
    color: "secondary",
  },
  {
    id: "starting",
    label: "Starting Soon",
    icon: Zap,
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

// --- Helper Functions ---

const getBadgeVariant = (category: string) => {
  switch (category) {
    case "greeting": return "default";
    case "gratitude": return "secondary";
    case "hype": return "destructive";
    case "gameplay": return "outline";
    default: return "secondary";
  }
};

// --- Main Component ---

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
      // Assuming window.spark is available in your environment types
      // If not, you might need a global type declaration
      const prompt = (window as any).spark.llmPrompt`Generate a short, engaging stream message that would be fun to send to chat. Make it natural and conversational. Keep it 1-2 sentences.`;
      const response = await (window as any).spark.llm(prompt, "gpt-4o");
      setCustomText(response.trim());
      toast.success("AI message generated!");
    } catch (error) {
      toast.error("Failed to generate message");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 max-h-[300px]">
          {filteredActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center gap-2 justify-center text-center hover:border-primary/50 hover:bg-accent/50 group"
              onClick={() => handleActionClick(action.template)}
            >
              <action.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Custom Input Section */}
        <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
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
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleCustomSubmit}
              disabled={!customText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full flex items-center gap-2"
            onClick={handleGenerateCustom}
            disabled={isGenerating}
          >
            <Wand2 className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

