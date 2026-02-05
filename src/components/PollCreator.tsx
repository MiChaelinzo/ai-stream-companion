import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Poll } from "@/lib/types";
import { Question, Plus, Copy, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { safeParseDate } from "@/lib/utils";

interface PollCreatorProps {
  polls: Poll[];
  onCreatePoll: (question: string, options: string[]) => void;
  onDeletePoll: (id: string) => void;
  onGeneratePoll: (context: string) => void;
  isGenerating: boolean;
}

export function PollCreator({ polls, onCreatePoll, onDeletePoll, onGeneratePoll, isGenerating }: PollCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [aiContext, setAiContext] = useState("");

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    const validOptions = options.filter((opt) => opt.trim());
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll(question.trim(), validOptions);
      setQuestion("");
      setOptions(["", ""]);
      setIsOpen(false);
      toast.success("Poll created successfully!");
    }
  };

  const handleCopyPoll = (poll: Poll) => {
    const pollText = `${poll.question}\n${poll.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
    navigator.clipboard.writeText(pollText);
    toast.success("Poll copied to clipboard!");
  };

  const handleGenerateAIPoll = () => {
    onGeneratePoll(aiContext);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Question size={24} weight="bold" className="text-primary" />
            <CardTitle>Poll & Activity Creator</CardTitle>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={18} weight="bold" className="mr-1" />
                New Poll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Poll</DialogTitle>
                <DialogDescription>Design an engaging poll for your stream chat</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="poll-question">Poll Question</Label>
                  <Input
                    id="poll-question"
                    placeholder="What should we do next?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Options</Label>
                    {options.length < 5 && (
                      <Button variant="ghost" size="sm" onClick={handleAddOption}>
                        <Plus size={16} weight="bold" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                        {options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <Trash size={18} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleCreate} className="w-full">
                  Create Poll
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Create polls and questions to engage your audience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-poll-context">AI Poll Generator</Label>
          <div className="flex gap-2">
            <Input
              id="ai-poll-context"
              placeholder="Context: e.g., 'Playing Elden Ring, just beat boss'"
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              className="bg-background/50"
            />
            <Button onClick={handleGenerateAIPoll} disabled={isGenerating} variant="secondary">
              {isGenerating ? "..." : "Generate"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Recent Polls</Label>
            <Badge variant="secondary">{polls.length} polls</Badge>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {polls.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Question size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No polls created yet</p>
                </div>
              ) : (
                polls.map((poll) => (
                  <div
                    key={poll.id}
                    className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm">{poll.question}</p>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopyPoll(poll)}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => onDeletePoll(poll.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {poll.options.map((option, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          {option}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {safeParseDate(poll.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
