import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponseTemplate } from "@/lib/types";
import { Plus, Trash, Copy, Lightning, Command } from "@phosphor-icons/react";
import { toast } from "sonner";

interface ResponseTemplatesProps {
  templates: ResponseTemplate[];
  onCreateTemplate: (template: Omit<ResponseTemplate, "id" | "createdAt" | "usageCount">) => void;
  onDeleteTemplate: (id: string) => void;
  onUseTemplate: (id: string) => void;
}

const TEMPLATE_CATEGORIES = [
  "Greetings",
  "Gameplay",
  "Questions",
  "Thanks",
  "Moderation",
  "Other"
];

const AVAILABLE_VARIABLES = [
  { name: "{user}", description: "Username of the viewer" },
  { name: "{game}", description: "Current game being played" },
  { name: "{time}", description: "Current time" },
  { name: "{uptime}", description: "Stream uptime" },
];

export function ResponseTemplates({ templates, onCreateTemplate, onDeleteTemplate, onUseTemplate }: ResponseTemplatesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateCategory, setTemplateCategory] = useState<string>(TEMPLATE_CATEGORIES[0]);
  const [templateShortcut, setTemplateShortcut] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all-categories");

  const handleCreateTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const usedVariables = AVAILABLE_VARIABLES
      .filter(v => templateContent.includes(v.name))
      .map(v => v.name);

    onCreateTemplate({
      name: templateName,
      content: templateContent,
      category: templateCategory,
      shortcut: templateShortcut || undefined,
      variables: usedVariables.length > 0 ? usedVariables : undefined,
    });

    setTemplateName("");
    setTemplateContent("");
    setTemplateShortcut("");
    setTemplateCategory(TEMPLATE_CATEGORIES[0]);
    setIsDialogOpen(false);
    toast.success("Template created successfully!");
  };

  const handleUseTemplate = (template: ResponseTemplate) => {
    const filledContent = template.content
      .replace("{user}", "Viewer")
      .replace("{game}", "Game")
      .replace("{time}", new Date().toLocaleTimeString())
      .replace("{uptime}", "1h 23m");
    
    navigator.clipboard.writeText(filledContent);
    onUseTemplate(template.id);
    toast.success("Template copied to clipboard!");
  };

  const filteredTemplates = templates.filter(
    t => filterCategory === "all-categories" || t.category === filterCategory
  );

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightning weight="fill" className="text-primary" />
                Quick Response Templates
              </CardTitle>
              <CardDescription>
                Create reusable templates with dynamic variables for instant responses
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus weight="bold" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Response Template</DialogTitle>
                  <DialogDescription>
                    Use variables like {"{user}"}, {"{game}"}, {"{time}"}, or {"{uptime}"} for dynamic content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Welcome New Viewer"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-content">Response Content</Label>
                    <Textarea
                      id="template-content"
                      placeholder="e.g., Welcome {user}! Thanks for joining the stream!"
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Category</Label>
                      <Select value={templateCategory} onValueChange={setTemplateCategory}>
                        <SelectTrigger id="template-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TEMPLATE_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-shortcut">Keyboard Shortcut (Optional)</Label>
                      <Input
                        id="template-shortcut"
                        placeholder="e.g., Ctrl+1"
                        value={templateShortcut}
                        onChange={(e) => setTemplateShortcut(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <p className="text-sm font-medium">Available Variables:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {AVAILABLE_VARIABLES.map(v => (
                        <div key={v.name} className="text-sm">
                          <code className="bg-background px-2 py-1 rounded text-primary">{v.name}</code>
                          <span className="text-muted-foreground ml-2">{v.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTemplate}>Create Template</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Filter by Category:</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {TEMPLATE_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Lightning size={48} weight="thin" className="mx-auto mb-4 opacity-50" />
                <p>No templates yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-lg border border-border/50 bg-card p-4 space-y-3 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline">{template.category}</Badge>
                          {template.shortcut && (
                            <Badge variant="secondary" className="gap-1">
                              <Command size={12} />
                              {template.shortcut}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {template.content}
                        </p>
                        {template.variables && template.variables.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {template.variables.map(v => (
                              <code key={v} className="text-xs bg-muted px-2 py-1 rounded">
                                {v}
                              </code>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="gap-1"
                        >
                          <Copy size={16} />
                          Use
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onDeleteTemplate(template.id);
                            toast.success("Template deleted");
                          }}
                        >
                          <Trash size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {template.usageCount ? (
                      <div className="text-xs text-muted-foreground">
                        Used {template.usageCount} time{template.usageCount !== 1 ? 's' : ''}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
