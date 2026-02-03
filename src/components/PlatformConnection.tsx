import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlatformConnection as PlatformConnectionType, PlatformType } from "@/lib/types";
import { 
  TwitchLogo, 
  YoutubeLogo, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle,
  Info,
  Broadcast
} from "@phosphor-icons/react";
import { toast } from "sonner";

interface PlatformConnectionProps {
  twitchConnection: PlatformConnectionType | null;
  youtubeConnection: PlatformConnectionType | null;
  onConnect: (platform: PlatformType, credentials: any) => void;
  onDisconnect: (platform: PlatformType) => void;
}

export function PlatformConnection({
  twitchConnection,
  youtubeConnection,
  onConnect,
  onDisconnect,
}: PlatformConnectionProps) {
  const [showTwitchForm, setShowTwitchForm] = useState(false);
  const [showYoutubeForm, setShowYoutubeForm] = useState(false);

  const [twitchUsername, setTwitchUsername] = useState("");
  const [twitchToken, setTwitchToken] = useState("");
  const [twitchChannel, setTwitchChannel] = useState("");

  const [youtubeApiKey, setYoutubeApiKey] = useState("");
  const [youtubeLiveId, setYoutubeLiveId] = useState("");

  const handleTwitchConnect = () => {
    if (!twitchUsername.trim() || !twitchToken.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    onConnect('twitch', {
      username: twitchUsername,
      accessToken: twitchToken,
      channelId: twitchChannel || twitchUsername,
    });

    setTwitchUsername("");
    setTwitchToken("");
    setTwitchChannel("");
    setShowTwitchForm(false);
    toast.success("Twitch credentials saved! Deploy backend to connect.");
  };

  const handleYoutubeConnect = () => {
    if (!youtubeApiKey.trim() || !youtubeLiveId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    onConnect('youtube', {
      apiKey: youtubeApiKey,
      liveId: youtubeLiveId,
    });

    setYoutubeApiKey("");
    setYoutubeLiveId("");
    setShowYoutubeForm(false);
    toast.success("YouTube credentials saved! Deploy backend to connect.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Alert className="bg-destructive/10 border-destructive/30">
          <Info size={20} className="text-destructive" />
          <AlertDescription className="text-sm">
            <strong className="text-destructive">Important:</strong> This page only <strong>stores</strong> your credentials. It does not connect to live chat. Browser-based apps cannot directly connect to Twitch/YouTube due to CORS, security, and WebSocket limitations.
          </AlertDescription>
        </Alert>

        <Alert className="bg-primary/10 border-primary/30">
          <Info size={20} className="text-primary" />
          <AlertDescription className="text-sm">
            <strong className="text-primary">To connect to live chat:</strong> You need a backend server. See <strong>QUICK_START.md</strong> for complete Node.js/Python code (30-minute setup) or <strong>BACKEND_DEPLOYMENT_GUIDE.md</strong> for production deployment.
          </AlertDescription>
        </Alert>

        <Alert className="bg-accent/10 border-accent/30">
          <Info size={20} className="text-accent" />
          <AlertDescription className="text-sm">
            <strong className="text-accent">Want to test your AI now?</strong> Go to the <strong>Monitor</strong> tab and enable <strong>Chat Simulation</strong> to test with realistic AI-generated messages - works immediately with no backend!
          </AlertDescription>
        </Alert>
      </div>

      <Card className="border-[#9146FF]/30 bg-gradient-to-br from-card to-[#9146FF]/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#9146FF] flex items-center justify-center">
                <TwitchLogo size={28} weight="fill" className="text-white" />
              </div>
              <div>
                <CardTitle>Twitch</CardTitle>
                <CardDescription>Store credentials for backend connection</CardDescription>
              </div>
            </div>
            {twitchConnection?.isConnected ? (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                <CheckCircle size={14} className="mr-1" weight="fill" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="border-muted-foreground/30">
                <XCircle size={14} className="mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {twitchConnection?.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-medium">{twitchConnection.username}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Channel:</span>
                  <span className="font-medium">#{twitchConnection.channelId}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    {twitchConnection.isLive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-500 font-medium">Live</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Offline</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  onDisconnect('twitch');
                  toast.success("Twitch credentials removed");
                }}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <>
              {!showTwitchForm ? (
                <Button
                  className="w-full bg-[#9146FF] hover:bg-[#772CE8] text-white"
                  onClick={() => setShowTwitchForm(true)}
                >
                  <LinkIcon size={18} className="mr-2" />
                  Store Credentials
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitch-username">Bot Username</Label>
                    <Input
                      id="twitch-username"
                      placeholder="your_bot_username"
                      value={twitchUsername}
                      onChange={(e) => setTwitchUsername(e.target.value)}
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      The Twitch username for your bot account
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitch-token">OAuth Token</Label>
                    <Input
                      id="twitch-token"
                      type="password"
                      placeholder="oauth:your_token_here"
                      value={twitchToken}
                      onChange={(e) => setTwitchToken(e.target.value)}
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your OAuth token from{" "}
                      <a
                        href="https://twitchapps.com/tmi/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        twitchapps.com/tmi
                      </a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitch-channel">Channel to Join</Label>
                    <Input
                      id="twitch-channel"
                      placeholder="target_channel_name"
                      value={twitchChannel}
                      onChange={(e) => setTwitchChannel(e.target.value)}
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      The channel where your bot will read and respond to chat
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleTwitchConnect}>
                      Save Credentials
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowTwitchForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-red-600/30 bg-gradient-to-br from-card to-red-600/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <YoutubeLogo size={28} weight="fill" className="text-white" />
              </div>
              <div>
                <CardTitle>YouTube</CardTitle>
                <CardDescription>Store credentials for backend connection</CardDescription>
              </div>
            </div>
            {youtubeConnection?.isConnected ? (
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                <CheckCircle size={14} className="mr-1" weight="fill" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="border-muted-foreground/30">
                <XCircle size={14} className="mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {youtubeConnection?.isConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/50 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Live Chat ID:</span>
                  <span className="font-medium font-mono text-xs">
                    {youtubeConnection.channelId?.slice(0, 20)}...
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center gap-2">
                    {youtubeConnection.isLive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-500 font-medium">Live</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Offline</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  onDisconnect('youtube');
                  toast.success("YouTube credentials removed");
                }}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <>
              {!showYoutubeForm ? (
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowYoutubeForm(true)}
                >
                  <LinkIcon size={18} className="mr-2" />
                  Store Credentials
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="youtube-api-key">YouTube API Key</Label>
                    <Input
                      id="youtube-api-key"
                      type="password"
                      placeholder="AIzaSy..."
                      value={youtubeApiKey}
                      onChange={(e) => setYoutubeApiKey(e.target.value)}
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Create an API key in{" "}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube-live-id">Live Chat ID</Label>
                    <Input
                      id="youtube-live-id"
                      placeholder="Live chat ID from your stream"
                      value={youtubeLiveId}
                      onChange={(e) => setYoutubeLiveId(e.target.value)}
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get the live chat ID from your YouTube live stream settings
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleYoutubeConnect}>
                      Save Credentials
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowYoutubeForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Broadcast size={24} weight="bold" className="text-primary" />
            <CardTitle>Integration Guide</CardTitle>
          </div>
          <CardDescription>How to connect your streaming platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <TwitchLogo size={16} weight="fill" className="text-[#9146FF]" />
              Twitch Setup
            </h4>
            <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
              <li>Create a separate Twitch account for your bot</li>
              <li>Visit twitchapps.com/tmi to generate an OAuth token</li>
              <li>Enter your bot's username and OAuth token above</li>
              <li>Specify which channel the bot should join</li>
              <li>Your AI will monitor chat and respond based on personality settings</li>
            </ol>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <YoutubeLogo size={16} weight="fill" className="text-red-600" />
              YouTube Setup
            </h4>
            <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
              <li>Create a project in Google Cloud Console</li>
              <li>Enable the YouTube Data API v3</li>
              <li>Create an API key in the credentials section</li>
              <li>Start a live stream and copy the Live Chat ID</li>
              <li>Enter your credentials above to begin monitoring chat</li>
            </ol>
          </div>

          <Separator />

          <Alert className="bg-accent/10 border-accent/30">
            <Info size={16} className="text-accent" />
            <AlertDescription className="text-sm">
              <strong className="text-accent">Important:</strong> This interface saves connection credentials for future backend integration. <strong>Real-time chat monitoring requires a backend service</strong> (Node.js/Python) to maintain persistent WebSocket/IRC connections to Twitch/YouTube APIs. Use the <strong>Chat Simulation</strong> feature in the Monitor tab to test your AI's personality and responses right now!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
