import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
  ChatCi
  Lightning,
  Question,
  Heart,
  Spark
  Question,
  GameController,
  HandWaving,
  label: s
} from "@phosphor-icons/react";
import { toast } from "sonner";

    color: "primary",
  {
    label: "Than
    category: "gratitude",
    color: "accent",
  {
    label: "Hype
 

  {
   
    category: "que
    color: "secondary",
  {
    label: "Thank for Sub
    category: "gratitude",
    color: "accent",
  {
   
    category: "engageme
    color: "primary",
  {
    label: "Clutch Play!",
    category: "hype",
    color: "accent",
  },
  {
    category: "engagem
    color: "muted",
];
interface QuickAction
  onCustomAction?: (text: string) => void;

  co

    { value: "all",
    { value: "gratitude", label
    { value: "quest
  ];
  const filteredActions =
      ? quickActions

   
  };
  const handleGenerateCusto

    try {
      const response = await window.spark.llm(prompt, "gp
      toast.success(
    
   
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
























