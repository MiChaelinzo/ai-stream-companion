import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightning, ArrowsClockwise } from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ResponseGeneratorProps {
  onGenerate: (scenario: string, context: string) => void;
  isGenerating: boolean;
  generatedResponses: string[];
}

export function ResponseGenerator({ onGenerate, isGenerating, generatedResponses }: ResponseGeneratorProps) {
  const [scenario, setScenario] = useState<string>("greeting");
  const [context, setContext] = useState("");

  const scenarios = [
    { value: "greeting", label: "New Viewer Greeting" },
    { value: "question", label: "Gameplay Question" },
    { value: "compliment", label: "Compliment/Praise" },
    { value: "help", label: "Request for Help" },
    { value: "random", label: "Random Chat" },
  ];

  const handleGenerate = () => {
    onGenerate(scenario, context);
  };

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightning size={24} weight="fill" className="text-accent" />
          <CardTitle>Smart Response Generator</CardTitle>
        </div>
        <CardDescription>Generate AI responses for different streaming scenarios</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scenario">Scenario Type</Label>
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger id="scenario" className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Additional Context (Optional)</Label>
          <Textarea
            id="context"
            placeholder="Add specific context like game being played, recent events, etc..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="bg-background/50 min-h-[80px] resize-none"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <ArrowsClockwise size={20} weight="bold" className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Lightning size={20} weight="fill" className="mr-2" />
              Generate Responses
            </>
          )}
        </Button>

        {generatedResponses.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Label>Generated Responses</Label>
              <Badge variant="secondary" className="text-xs">
                {generatedResponses.length} options
              </Badge>
            </div>
            <div className="space-y-2">
              {generatedResponses.map((response, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 text-sm"
                >
                  <span className="text-accent font-semibold mr-2">Option {index + 1}:</span>
                  {response}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
