import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button
import { Button } from "@/components/ui/button";
  Question,
  Fire,
  HandWaving,
import { toa
  Question,
  Heart,
  Fire,
  GameController,
  HandWaving,
} from "@phosphor-icons/react";
import { toast } from "sonner";

    color: "primary",
  {
    label: "Than
    category
    color: "accent",
  {
    label: "Than
 

  {
   
    category: "h
    color: "destructive",
  {
    label: "Ask Question"
    category: "question",
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
      const response = 
    
   
      toast.error("Fa
    } finally {
    }

    <Card>
        <CardTitle cl
    
   
        </CardDes
      <CardContent classNa
          <Tabs
              <TabsTr
                <span>{cat.label}</span>
            ))}
    
   
            <B
              variant="outl
              onClick
              <div classNam
                <span className="font-semibold text-sm">{acti
              <p cl
    
  

          <div className="pt-4 bor
              onClick={handleGenerateCustom}
              className="w-full"
 

          </div>

          <Badge variant="outline" className="text-xs">

          <span>Click 
      </CardContent>
  );








































































































