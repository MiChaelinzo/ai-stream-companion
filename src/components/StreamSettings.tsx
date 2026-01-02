import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { StreamSettings as StreamSettingsType } from "@/lib/types";
import { GearSix, ChatCircle, Clock, Question, Waveform } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";

interface StreamSettingsProps {
  settings: StreamSettingsType;
  onUpdate: (settings: StreamSettingsType) => void;
  isConnected: boolean;
}

export function StreamSettings({ settings, onUpdate, isConnected }: StreamSettingsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GearSix size={24} weight="bold" className="text-primary" />
              <CardTitle>Stream Behavior</CardTitle>
            </div>
            {isConnected && (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                Active
              </Badge>
            )}
          </div>
          <CardDescription>Configure how your AI companion behaves during live streams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ChatCircle size={20} className="text-primary" />
                <Label htmlFor="auto-respond" className="cursor-pointer font-semibold">
                  Auto-Respond to Chat
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically respond to viewer messages based on personality
              </p>
            </div>
            <Switch
              id="auto-respond"
              checked={settings.autoRespond}
              onCheckedChange={(checked) =>
                onUpdate({ ...settings, autoRespond: checked })
              }
              disabled={!isConnected}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-accent" />
              <Label>Response Timing</Label>
            </div>

            <div className="space-y-3 pl-7">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Response Delay</span>
                  <span className="text-sm font-medium">{settings.responseDelay}s</span>
                </div>
                <Slider
                  value={[settings.responseDelay]}
                  onValueChange={([value]) =>
                    onUpdate({ ...settings, responseDelay: value })
                  }
                  min={0}
                  max={30}
                  step={1}
                  disabled={!settings.autoRespond || !isConnected}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Time to wait before responding to messages (more natural timing)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Max Messages Per Minute</span>
                  <span className="text-sm font-medium">{settings.maxMessagesPerMinute}</span>
                </div>
                <Slider
                  value={[settings.maxMessagesPerMinute]}
                  onValueChange={([value]) =>
                    onUpdate({ ...settings, maxMessagesPerMinute: value })
                  }
                  min={1}
                  max={30}
                  step={1}
                  disabled={!settings.autoRespond || !isConnected}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Rate limit to prevent spam and stay within platform limits
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Message Frequency</span>
                  <span className="text-sm font-medium">
                    {settings.messageFrequency === 1 && "Every message"}
                    {settings.messageFrequency === 2 && "Every 2nd message"}
                    {settings.messageFrequency === 3 && "Every 3rd message"}
                    {settings.messageFrequency === 5 && "Every 5th message"}
                    {settings.messageFrequency === 10 && "Every 10th message"}
                  </span>
                </div>
                <Slider
                  value={[settings.messageFrequency]}
                  onValueChange={([value]) =>
                    onUpdate({ ...settings, messageFrequency: value })
                  }
                  min={1}
                  max={10}
                  step={1}
                  disabled={!settings.autoRespond || !isConnected}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  How often to respond to chat messages (1 = respond to all)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Waveform size={20} className="text-secondary" />
              <Label>Engagement Features</Label>
            </div>

            <div className="space-y-3 pl-7">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-greetings" className="cursor-pointer text-sm">
                    Greet New Viewers
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Welcome first-time chatters automatically
                  </p>
                </div>
                <Switch
                  id="enable-greetings"
                  checked={settings.enableGreetings}
                  onCheckedChange={(checked) =>
                    onUpdate({ ...settings, enableGreetings: checked })
                  }
                  disabled={!settings.autoRespond || !isConnected}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-polls" className="cursor-pointer text-sm">
                    Auto-Generate Polls
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Create engagement polls at regular intervals
                  </p>
                </div>
                <Switch
                  id="enable-polls"
                  checked={settings.enablePolls}
                  onCheckedChange={(checked) =>
                    onUpdate({ ...settings, enablePolls: checked })
                  }
                  disabled={!isConnected}
                />
              </div>

              {settings.enablePolls && (
                <div className="space-y-2 ml-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Poll Interval</span>
                    <span className="text-sm font-medium">{settings.pollInterval} min</span>
                  </div>
                  <Slider
                    value={[settings.pollInterval]}
                    onValueChange={([value]) =>
                      onUpdate({ ...settings, pollInterval: value })
                    }
                    min={5}
                    max={60}
                    step={5}
                    disabled={!isConnected}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    How often to create new polls during stream
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-3">
              <Question size={20} className="text-accent mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Smart Response Selection</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your AI companion intelligently decides which messages to respond to based on context, 
                  engagement potential, and question detection. It prioritizes new viewers, direct questions, 
                  and meaningful interactions over generic chat messages.
                </p>
              </div>
            </div>
          </div>

          {!isConnected && (
            <div className="p-4 rounded-lg bg-muted/50 border border-muted-foreground/20 text-center">
              <p className="text-sm text-muted-foreground">
                Connect to Twitch or YouTube to activate stream settings
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
