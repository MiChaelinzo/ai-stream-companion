import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessage, AIPersonality } from "@/lib/types";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatCircle, ArrowRight, Sparkle } from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ChatSimulatorProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isGenerating: boolean;
  personality: AIPersonality;
  onVote?: (messageId: string, vote: 'up' | 'down') => void;
}

export function ChatSimulator({ messages, onSendMessage, isGenerating, personality, onVote }: ChatSimulatorProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border-secondary/20 flex flex-col h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatCircle size={24} weight="bold" className="text-secondary" />
            <CardTitle>Live Chat Simulation</CardTitle>
          </div>
          <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30">
            <Sparkle size={14} weight="fill" className="mr-1" />
            {personality.name || 'AI'}
          </Badge>
        </div>
        <CardDescription>Test your AI's responses in real-time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} onVote={onVote} />
            ))}
            {isGenerating && <TypingIndicator />}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            id="chat-input"
            placeholder="Type a message to test AI response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            className="bg-background/50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            size="icon"
            className="shrink-0"
          >
            <ArrowRight size={20} weight="bold" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
