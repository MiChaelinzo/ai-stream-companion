import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
  Heart,
  Lightning,

  id: st
  icon:
  template: strin
}
const quic
    id: "welcome",
    icon: HandWaving,

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
  {
  {
    id: "thanks-follow",
    label: "Thank for Follow",
    color: "dest
    category: "gratitude",
    template: "Thanks so much for the follow! I really appreciate it! ❤️",
    color: "accent",
    
  {
    id: "thanks-sub",
    label: "Thank for Sub",
    label: "Game
    category: "gratitude",
    template: "Thank you for subscribing! You're amazing! 🎉",
    color: "accent",
  },
  {
  { value: "all
    label: "Hype Moment",
    icon: Fire,
    category: "hype",
    template: "LET'S GOOO! That was insane! 🔥🔥🔥",
    color: "destructive",
  on
  {

    label: "Ask Question",
  const [customText
    category: "question",
  const filteredActions = selectedCategory === "all"
    color: "primary",

  {
        </CardDescr
      <CardContent className="
          <TabsList class
              <TabsTrigge
              </TabsTrigger>
          </TabsList>
    
  

                clas
                <div className="f
                    <action.icon size={20} w
                  <div className="flex-1 text
                      <span classNa
                    </div>
                  </div>
  


          <div className="flex gap-2">
              placeholder="Type a custom 
 

                  handleCustomSubmit();
              }}
            <Button onClick={handleCustomSubmit} di
            </Button>

            onClick={handleGenerateCustom}
            classN
            <Sparkle size={16} weight="bold" className="mr-2" />


          <Lightning size={1
        </Badge>
    
































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
