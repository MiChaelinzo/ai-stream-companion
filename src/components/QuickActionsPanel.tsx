import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ChatCircle,
import {
  Lightning,
  ChatCircle,
  Heart,
} from 

  id: str
  icon:
  template
}
const quick
    id: "welcome
    icon: Heart,
    template: "Welcome to the s

    id: "thank-follow",
    icon: Hea
    template: "T
  },
    id: "hype-moment",
    icon: Fire,
    template: "L
 

    icon: ChatCircle,
   
  },
    id: "brb",
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
    icon: Heart,
    template: "Thanks for
  },
    id: "poll-question"
    
   
  },

  onActionClick: (tem
}
export function QuickActionsPanel({ onActionClick, onCustomAction }: 
  const [isGenerati
  co
   
    { value: "gratitu
    { value: "question",
  ];
  const filteredActions =
      ? quickActions

    
  }
  const handleGenerateCu
    
    try {
      const response 
      toast.success("Custom message generated!"
      toast.error("Fa
    
   

    <Card className="bg
        <div className="f
            <CardTitl
              Quick Actions
            <CardDescri
    
   
      </CardHeader>
        <div className="
            <Bu
              variant={sel
              onClick={() => setSelectedCategory(cat.value)}
            >
    
   

          {filteredActions.
              key={a
              classN
            >
                <acti
    
   
            </Button>
        </div>
        {onCusto
            <Button
              disabled={isGenerating}
              varian
    
   
        )}
    </Card>
}








































































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
























