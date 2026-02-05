import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

  onActionClick: (template: string) => void;
}
interface QuickAction {

interface QuickActionsProps {
  onActionClick: (template: string) => void;
  onCustomAction: (text: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
    category: "gratitude",
    color: "accent"
  {
 

    color: "destructive",
  {
    label: "Ask Qu
    category: "question",
    color: "accent",
  {
    label: "Game Over - GG",
    category: "gamepl
    
  {
    label: "Be Ri
    category: "greeting
    color: "prim
    category: "gratitude",
    label: "Starting Soon",
    category: "greet
    
  {
const categorie
  { value: "greeting", la
  { value: "hyp
  { value: "gameplay"

    color: "destructive",
  co
  c
    : quickActions.
  const handleActionClick 
    toast.success("
    category: "question",
    if (customText.trim()) {
    color: "accent",
    

    setIsGenerating
    label: "Game Over - GG",
      setCustomText(respo
    } catch (error) {
      console.error(error);
      setIsGenerating(f
  };
  {
      <CardHea
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

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">


        </CardTitle>











            ))}













                  </div>







                </div>

            ))}





            <Input

              value={customText}

              onKeyDown={(e) => {

                  e.preventDefault();



            />

              Send

          </div>



            disabled={isGenerating}

          >


          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
