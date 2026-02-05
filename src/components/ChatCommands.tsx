import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatCommand } from "@/lib/types";
import { Plus, Trash, Terminal, Clock, Shield } from "@phosphor-icons/react";
import { toast } from "sonner";
import { safeParseDate } from "@/lib/utils";

interface ChatCommandsProps {
  commands: ChatCommand[];
  onCreateCommand: (command: Omit<ChatCommand, "id" | "createdAt" | "usageCount">) => void;
  onDeleteCommand: (id: string) => void;
  onToggleCommand: (id: string, enabled: boolean) => void;
}

const PERMISSION_LEVELS = [
  { value: "viewer" as const, label: "Everyone", icon: "👤" },
  { value: "subscriber" as const, label: "Subscribers", icon: "⭐" },
  { value: "moderator" as const, label: "Moderators", icon: "🛡️" },
  { value: "broadcaster" as const, label: "Broadcaster Only", icon: "👑" },
];

export function ChatCommands({ commands, onCreateCommand, onDeleteCommand, onToggleCommand }: ChatCommandsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commandTrigger, setCommandTrigger] = useState("");
  const [commandResponse, setCommandResponse] = useState("");
  const [commandCooldown, setCommandCooldown] = useState(5);
  const [commandPermissions, setCommandPermissions] = useState<ChatCommand["permissions"]>("viewer");

  const handleCreateCommand = () => {
    if (!commandTrigger.trim() || !commandResponse.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const trigger = commandTrigger.startsWith("!") ? commandTrigger : `!${commandTrigger}`;

    onCreateCommand({
      trigger,
      response: commandResponse,
      cooldown: commandCooldown,
      permissions: commandPermissions,
      enabled: true,
    });

    setCommandTrigger("");
    setCommandResponse("");
    setCommandCooldown(5);
    setCommandPermissions("viewer");
    setIsDialogOpen(false);
    toast.success("Command created successfully!");
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Terminal weight="bold" className="text-primary" />
                Chat Commands
              </CardTitle>
              <CardDescription>
                Create custom commands with cooldowns and permission controls
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus weight="bold" />
                  New Command
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Chat Command</DialogTitle>
                  <DialogDescription>
                    Commands support the same variables as templates: {"{user}"}, {"{game}"}, {"{time}"}, {"{uptime}"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="command-trigger">Command Trigger</Label>
                    <div className="flex gap-2 items-center">
                      <span className="text-muted-foreground">!</span>
                      <Input
                        id="command-trigger"
                        placeholder="e.g., discord, social, commands"
                        value={commandTrigger.replace("!", "")}
                        onChange={(e) => setCommandTrigger(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="command-response">Response</Label>
                    <Textarea
                      id="command-response"
                      placeholder="e.g., Join our Discord: discord.gg/example"
                      value={commandResponse}
                      onChange={(e) => setCommandResponse(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="command-cooldown" className="flex items-center gap-2">
                        <Clock size={16} />
                        Cooldown (seconds)
                      </Label>
                      <Input
                        id="command-cooldown"
                        type="number"
                        min="0"
                        value={commandCooldown}
                        onChange={(e) => setCommandCooldown(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="command-permissions" className="flex items-center gap-2">
                        <Shield size={16} />
                        Permission Level
                      </Label>
                      <Select value={commandPermissions} onValueChange={(v) => setCommandPermissions(v as ChatCommand["permissions"])}>
                        <SelectTrigger id="command-permissions">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PERMISSION_LEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.icon} {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateCommand}>Create Command</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px] pr-4">
            {commands.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Terminal size={48} weight="thin" className="mx-auto mb-4 opacity-50" />
                <p>No commands yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {commands.map((command) => (
                  <div
                    key={command.id}
                    className="rounded-lg border border-border/50 bg-card p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-lg font-semibold text-primary">{command.trigger}</code>
                          <Badge variant="outline">
                            {PERMISSION_LEVELS.find(p => p.value === command.permissions)?.icon}
                            {" "}
                            {PERMISSION_LEVELS.find(p => p.value === command.permissions)?.label}
                          </Badge>
                          {command.cooldown > 0 && (
                            <Badge variant="secondary" className="gap-1">
                              <Clock size={12} />
                              {command.cooldown}s
                            </Badge>
                          )}
                          <Badge variant={command.enabled ? "default" : "secondary"}>
                            {command.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-2">
                          {command.response}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Used {command.usageCount} times</span>
                          {command.lastUsed && (
                            <span>Last: {safeParseDate(command.lastUsed).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Switch
                          checked={command.enabled}
                          onCheckedChange={(checked) => onToggleCommand(command.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onDeleteCommand(command.id);
                            toast.success("Command deleted");
                          }}
                        >
                          <Trash size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
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
