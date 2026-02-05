import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
  Lightning,
  ChatCi
  Gift,
  Sparkl
  Trophy,
  WarningCircle,
} from 

  id: stri
  icon: Rea
  templat
}
  WarningCircle,
  Smiley,
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
    template: "Welcome to the stream! 🎉 Thanks for joining us!",
    color: "accent",
  },
  {
    id: "thanks-follow",
    label: "Thank for Follow",
    icon: Sparkle,
    category: "gratitude",
    template: "Thank you so much for the follow! 💜 You're awesome!",
    color: "primary",
  },
  {
    id: "thanks-sub",
    label: "Thank for Sub",
    icon: Gift,
    category: "gratitude",
    template: "AMAZING! Thank you for subscribing! 🎊 Welcome to the community!",
    color: "chart-5",
  },
  {
    id: "hype-moment",
    label: "Hype Moment!",
    icon: Fire,
    category: "hype",
    template: "LET'S GOOO! 🔥 That was INSANE! Chat, did you see that?!",
    color: "destructive",
  },
  {
  },
    id: "game-question",
    icon: GameCon
    template: "Quick 
  },
    id: "brb",
    
   
  },
    id: "thanks-chat",
    icon: ChatCircl
    template: "You all ar
  },
    id: "celebration",
    
   
  },
    id: "gg",
    icon: Smiley,
    template: "GG! That w
  },

  on
}
export functio
  const [isGenerating, setI
  const categories = [
    { value: "greeti
    { value: "gratitude", label: "Thanks", icon: Sparkle },
    { value: "quest
  ];
  c
      ? quickActions

    onActionClick(act
  };
  const handleGenerateCustom = async () => {
    
    
   
      toast.success("C
      toast.error("Fail
    } finally {
    }

    <Card className="
    
   
             
            <CardDescript
          <Badge 
          </Badge>
      </CardHeader>
        <div classNam
    
  

            >
              {cat.label}
          ))}


              key={action.id}
              className="h-auto p-4 flex flex-col items-start gap-2 hover:
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
      const prompt = window.spark.llmPrompt`Generate a unique, engaging stream message that would be perfect for the current moment. Make it fun, positive, and natural. Keep it 1-2 sentences. No emojis at the end.`;
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
          <Button
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Sparkle size={20} weight="bold" />
            {isGenerating ? "Generating..." : "Generate Custom Message"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
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
          <Button
            onClick={handleGenerateCustom}
            disabled={isGenerating}
            className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Sparkle size={20} weight="bold" />
            {isGenerating ? "Generating..." : "Generate Custom Message"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
