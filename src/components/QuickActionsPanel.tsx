import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, C
import { HandWaving, Heart, Fire, Question, Ligh

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
 

    color: "accent",
  {
    label: "Hype M
    category: "hype",
    color: "destructi
  {
    label: "Ask Question",
    category: "questi
    
  {
    label: "Game Over - 
    category: "gameplay",
    color: "seco
    category: "gratitude",
    label: "Be Right Back",
    category: "greet
    
  {
    label: "Starting 
    category: "greeting",
    color: "dest
];
const categories = [
  { value: "greeting
  { 
  {

  const [selectedCategory
  const [isGene
  const filteredActio
    : quickActions.filter(action => action.category 
  const handleActionClick
    

    if (customText.
      setCustomText("");
    }

    setIsGenerating(true);
      const prompt = 
    
   
      console
      setIsGenerating(false)
  };
  return (
      <CardHeader>
          <Lightning si
    
   
      </CardHe
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

  );
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">

        <CardTitle className="flex items-center gap-2">
          <Lightning size={24} weight="bold" className="text-primary" />
          Quick Actions

        <CardDescription>
          Send preset messages instantly to your live chat with one click
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full flex-wrap h-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                <span>{cat.label}</span>
              </TabsTrigger>

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

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{action.label}</span>
                      <Badge variant="secondary" className="text-xs">{action.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{action.template}</p>
                  </div>

              </Button>

          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t space-y-3">
          <div className="flex gap-2">

              placeholder="Type a custom message..."

              onChange={(e) => setCustomText(e.target.value)}

                if (e.key === "Enter" && !e.shiftKey) {

                  handleCustomSubmit();
                }
              }}

            <Button onClick={handleCustomSubmit} disabled={!customText.trim()}>

            </Button>

          <Button
            variant="outline"
            onClick={handleGenerateCustom}

            className="w-full"

            <Sparkle size={16} weight="bold" className="mr-2" />
            {isGenerating ? "Generating..." : "Generate AI Message"}






