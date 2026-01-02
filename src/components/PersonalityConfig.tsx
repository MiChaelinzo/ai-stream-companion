import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIPersonality } from "@/lib/types";
import { Robot, X } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

interface PersonalityConfigProps {
  personality: AIPersonality;
  onUpdate: (personality: AIPersonality) => void;
}

export function PersonalityConfig({ personality, onUpdate }: PersonalityConfigProps) {
  const [newInterest, setNewInterest] = useState("");

  const handleAddInterest = () => {
    if (newInterest.trim() && !personality.interests.includes(newInterest.trim())) {
      onUpdate({
        ...personality,
        interests: [...personality.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdate({
      ...personality,
      interests: personality.interests.filter((i) => i !== interest),
    });
  };

  const handleSave = () => {
    toast.success("AI personality updated successfully!");
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Robot size={24} weight="bold" className="text-primary" />
          <CardTitle>AI Personality</CardTitle>
        </div>
        <CardDescription>Configure your AI streamer companion's character and behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ai-name">AI Name</Label>
          <Input
            id="ai-name"
            placeholder="Enter AI name..."
            value={personality.name}
            onChange={(e) => onUpdate({ ...personality, name: e.target.value })}
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-bio">Biography</Label>
          <Textarea
            id="ai-bio"
            placeholder="Describe your AI's background and personality..."
            value={personality.bio}
            onChange={(e) => onUpdate({ ...personality, bio: e.target.value })}
            className="bg-background/50 min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-tone">Tone & Style</Label>
          <Textarea
            id="ai-tone"
            placeholder="How should your AI communicate? (e.g., friendly, sarcastic, enthusiastic)"
            value={personality.tone}
            onChange={(e) => onUpdate({ ...personality, tone: e.target.value })}
            className="bg-background/50 min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="response-style">Response Style</Label>
          <Select
            value={personality.responseStyle}
            onValueChange={(value) =>
              onUpdate({ ...personality, responseStyle: value as AIPersonality['responseStyle'] })
            }
          >
            <SelectTrigger id="response-style" className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concise">Concise - Short and to the point</SelectItem>
              <SelectItem value="detailed">Detailed - Thorough explanations</SelectItem>
              <SelectItem value="playful">Playful - Fun and energetic</SelectItem>
              <SelectItem value="professional">Professional - Polished and formal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Interests & Topics</Label>
          <div className="flex gap-2">
            <Input
              id="interests"
              placeholder="Add an interest..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              className="bg-background/50"
            />
            <Button onClick={handleAddInterest} variant="outline" size="icon">
              <span className="text-lg">+</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {personality.interests.map((interest) => (
              <Badge
                key={interest}
                variant="secondary"
                className="px-3 py-1 text-sm bg-primary/20 hover:bg-primary/30 border-primary/30"
              >
                {interest}
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="ml-2 hover:text-accent"
                >
                  <X size={14} weight="bold" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" size="lg">
          Save Personality
        </Button>
      </CardContent>
    </Card>
  );
}
