import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChatMessage, PlatformConnection } from "@/lib/types";
import { 
  Broadcast, 
  TwitchLogo, 
  YoutubeLogo, 
  ChatCircle,
  Users,
  Lightning,
  Eye
} from "@phosphor-icons/react";
import { format } from "date-fns";

interface LiveMonitorProps {
  messages: ChatMessage[];
  twitchConnection: PlatformConnection | null;
  youtubeConnection: PlatformConnection | null;
  isMonitoring: boolean;
  onToggleMonitoring: () => void;
  stats?: {
    totalMessages: number;
    aiResponses: number;
    uniqueViewers: number;
  };
}

export function LiveMonitor({
  messages,
  twitchConnection,
  youtubeConnection,
  isMonitoring,
  onToggleMonitoring,
  stats = { totalMessages: 0, aiResponses: 0, uniqueViewers: 0 },
}: LiveMonitorProps) {
  const isAnyPlatformConnected = twitchConnection?.isConnected || youtubeConnection?.isConnected;
  const isAnyPlatformLive = twitchConnection?.isLive || youtubeConnection?.isLive;

  const getPlatformIcon = (platform?: 'twitch' | 'youtube' | 'simulator') => {
    switch (platform) {
      case 'twitch':
        return <TwitchLogo size={14} weight="fill" className="text-[#9146FF]" />;
      case 'youtube':
        return <YoutubeLogo size={14} weight="fill" className="text-red-600" />;
      default:
        return <ChatCircle size={14} weight="fill" className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-accent/30 bg-gradient-to-br from-card to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Broadcast size={24} weight="bold" className="text-accent" />
              <CardTitle>Live Stream Monitor</CardTitle>
            </div>
            {isMonitoring ? (
              <Badge className="bg-red-500/20 text-red-500 border-red-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                Monitoring
              </Badge>
            ) : (
              <Badge variant="outline" className="border-muted-foreground/30">
                Idle
              </Badge>
            )}
          </div>
          <CardDescription>Real-time chat monitoring across connected platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background/50 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ChatCircle size={16} />
                <span className="text-xs">Messages</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalMessages}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lightning size={16} weight="fill" />
                <span className="text-xs">AI Responses</span>
              </div>
              <p className="text-2xl font-bold text-primary">{stats.aiResponses}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/50 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users size={16} weight="fill" />
                <span className="text-xs">Viewers</span>
              </div>
              <p className="text-2xl font-bold">{stats.uniqueViewers}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Eye size={16} />
              Connected Platforms
            </h4>
            <div className="space-y-2">
              {twitchConnection?.isConnected && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#9146FF]/10 border border-[#9146FF]/20">
                  <div className="flex items-center gap-2">
                    <TwitchLogo size={20} weight="fill" className="text-[#9146FF]" />
                    <div>
                      <p className="text-sm font-medium">#{twitchConnection.channelId}</p>
                      <p className="text-xs text-muted-foreground">Twitch IRC</p>
                    </div>
                  </div>
                  {twitchConnection.isLive && (
                    <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse" />
                      Live
                    </Badge>
                  )}
                </div>
              )}
              {youtubeConnection?.isConnected && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-600/10 border border-red-600/20">
                  <div className="flex items-center gap-2">
                    <YoutubeLogo size={20} weight="fill" className="text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Live Chat</p>
                      <p className="text-xs text-muted-foreground">YouTube API</p>
                    </div>
                  </div>
                  {youtubeConnection.isLive && (
                    <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse" />
                      Live
                    </Badge>
                  )}
                </div>
              )}
              {!isAnyPlatformConnected && (
                <div className="p-4 rounded-lg bg-muted/30 text-center">
                  <p className="text-sm text-muted-foreground">
                    No platforms connected. Connect to Twitch or YouTube to start monitoring.
                  </p>
                </div>
              )}
            </div>
          </div>

          {isAnyPlatformConnected && (
            <>
              <Separator />
              <Button
                className="w-full"
                variant={isMonitoring ? "destructive" : "default"}
                onClick={onToggleMonitoring}
                disabled={!isAnyPlatformLive}
              >
                {isMonitoring ? (
                  <>Stop Monitoring</>
                ) : (
                  <>
                    <Broadcast size={18} className="mr-2" />
                    Start Monitoring
                  </>
                )}
              </Button>
              {!isAnyPlatformLive && (
                <p className="text-xs text-center text-muted-foreground">
                  Start a live stream to begin monitoring
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {isMonitoring && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChatCircle size={20} weight="fill" />
              Live Chat Feed
            </CardTitle>
            <CardDescription>Recent messages from connected platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div className="space-y-2">
                    <ChatCircle size={48} className="mx-auto text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Waiting for chat messages...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.slice().reverse().map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.sender === 'ai'
                          ? 'bg-primary/10 border border-primary/20 ml-8'
                          : 'bg-muted/30 border border-muted-foreground/10 mr-8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(message.platform)}
                          <span className="text-xs font-semibold">
                            {message.sender === 'ai' ? 'AI Companion' : message.username || 'Viewer'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.timestamp), 'HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
