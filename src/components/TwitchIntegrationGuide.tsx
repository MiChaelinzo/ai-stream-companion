import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useKV } from "@github/spark/hooks";
import { Info, Copy, Check, Warning, Broadcast, Code, Globe } from "@phosphor-icons/react";
import { toast } from "sonner";

export function TwitchIntegrationGuide() {
  const [accessToken, setAccessToken] = useKV<string>("twitch-access-token", "");
  const [clientId, setClientId] = useKV<string>("twitch-client-id", "");
  const [clientSecret, setClientSecret] = useKV<string>("twitch-client-secret", "");
  const [channelName, setChannelName] = useKV<string>("twitch-channel-name", "");
  
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string | undefined, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-destructive/10 border-destructive/30">
        <Warning size={20} className="text-destructive" />
        <AlertDescription className="text-sm ml-2">
          <strong>Important Limitation:</strong> This Spark application runs entirely in your browser and <strong>cannot directly connect to Twitch/YouTube live chat</strong>. 
          Real-time platform integration requires a backend server to handle OAuth, WebSocket connections, and API requests securely.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={24} className="text-primary" />
            Why This Doesn't Work in Browser
          </CardTitle>
          <CardDescription>Understanding the technical limitations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <span className="text-destructive font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">CORS Restrictions</h4>
                <p className="text-sm text-muted-foreground">
                  Twitch and YouTube APIs block browser requests for security. They require server-to-server communication.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <span className="text-destructive font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Token Security</h4>
                <p className="text-sm text-muted-foreground">
                  Access tokens and client secrets must never be exposed in browser code - they'd be visible to anyone viewing your page source.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <span className="text-destructive font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">WebSocket Connections</h4>
                <p className="text-sm text-muted-foreground">
                  Twitch IRC and EventSub require persistent WebSocket connections that browsers can't maintain reliably for chat bots.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">
            <Globe size={16} className="mr-2" />
            Store Credentials
          </TabsTrigger>
          <TabsTrigger value="guide">
            <Code size={16} className="mr-2" />
            Setup Guide
          </TabsTrigger>
          <TabsTrigger value="alternatives">
            <Broadcast size={16} className="mr-2" />
            What Works Here
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Save Your Twitch Credentials</CardTitle>
              <CardDescription>
                Store your TwitchTokenGenerator credentials here for reference. These are saved locally in your browser only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="access-token">Access Token</Label>
                <div className="flex gap-2">
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="oauth:abc123..."
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(accessToken, "Access Token")}
                    disabled={!accessToken}
                  >
                    {copiedField === "Access Token" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">From TwitchTokenGenerator.com "Generated Tokens" section</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="client-id"
                    placeholder="abc123def456..."
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(clientId, "Client ID")}
                    disabled={!clientId}
                  >
                    {copiedField === "Client ID" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Required for all Helix API calls (May 1st requirement)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="client-secret"
                    type="password"
                    placeholder="Leave empty to use TTG's secret"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(clientSecret, "Client Secret")}
                    disabled={!clientSecret}
                  >
                    {copiedField === "Client Secret" ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Only if you're using your own Twitch Dev application</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel-name">Your Twitch Channel</Label>
                <Input
                  id="channel-name"
                  placeholder="michaelinzo"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your Twitch username (the channel to monitor)</p>
              </div>

              <Alert className="bg-accent/10 border-accent/30">
                <Info size={16} className="text-accent" />
                <AlertDescription className="text-xs ml-2">
                  These credentials are stored locally in your browser only and are not sent anywhere from this Spark app. 
                  However, they <strong>cannot be used</strong> for real API connections without a backend server.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <Alert className="bg-accent/10 border-accent/30">
            <Info size={20} className="text-accent" />
            <AlertDescription className="ml-2">
              <div className="space-y-2">
                <p className="font-semibold">📖 Complete Backend Deployment Guides Available!</p>
                <div className="text-sm space-y-1">
                  <p>• <strong>QUICK_START.md</strong> - 30-minute setup with working code</p>
                  <p>• <strong>BACKEND_DEPLOYMENT_GUIDE.md</strong> - Complete reference with deployment options</p>
                  <p>• Both files are in the root of this project directory</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>How to Actually Connect to Twitch</CardTitle>
              <CardDescription>You'll need a separate backend service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Option 1: Node.js Backend (Recommended)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Full control, AI integration, works with your stored credentials above
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-xs font-mono">
                    <div className="text-muted-foreground">// 1. Create backend folder</div>
                    <div>mkdir ai-streamer-backend</div>
                    <div>cd ai-streamer-backend</div>
                    <div className="mt-2 text-muted-foreground">// 2. Install dependencies</div>
                    <div>npm install express ws tmi.js dotenv openai</div>
                    <div className="mt-2 text-muted-foreground">// 3. Create .env with your tokens above</div>
                    <div>TWITCH_ACCESS_TOKEN=...</div>
                    <div>TWITCH_CLIENT_ID=...</div>
                    <div>TWITCH_CHANNEL=michaelinzo</div>
                    <div className="mt-2 text-muted-foreground">// 4. Copy server.js code from guides</div>
                    <div>node server.js</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => window.open('QUICK_START.md', '_blank')}
                      className="text-xs"
                    >
                      View Quick Start Guide
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('BACKEND_DEPLOYMENT_GUIDE.md', '_blank')}
                      className="text-xs"
                    >
                      View Full Guide
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">🎥</span>
                    Option 2: OBS Plugins
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    No coding required, but less flexible
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                    <li><strong>Streamer.bot</strong> - Free tool that connects to Twitch chat and can trigger actions</li>
                    <li><strong>Mix It Up</strong> - Chat bot with built-in AI integration options</li>
                    <li><strong>Streamlabs Chatbot</strong> - Free desktop app for chat interaction</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-xl">☁️</span>
                    Option 3: Cloud Bot Services
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Hosted solutions, limited AI customization
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                    <li><strong>Nightbot</strong> - Hosted chat bot with commands and timers</li>
                    <li><strong>Moobot</strong> - Cloud-based moderation bot</li>
                    <li><strong>Fossabot</strong> - Feature-rich hosted bot</li>
                  </ul>
                </div>

                <Alert className="bg-primary/10 border-primary/30">
                  <Info size={16} className="text-primary" />
                  <AlertDescription className="text-xs ml-2">
                    <strong>Best Path:</strong> Follow the QUICK_START.md guide (30 minutes) to get a working backend with your credentials. 
                    Deploy to Railway.app or Heroku for 24/7 availability.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What This Spark App CAN Do</CardTitle>
              <CardDescription>Powerful AI features that work in-browser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">AI Personality Configuration</h4>
                    <p className="text-xs text-muted-foreground">
                      Define your AI's personality, tone, interests, and response style to match your stream brand.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Chat Simulation & Testing</h4>
                    <p className="text-xs text-muted-foreground">
                      Test your AI's responses with simulated chat messages before going live. Perfect for training and refinement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Response Generator</h4>
                    <p className="text-xs text-muted-foreground">
                      Generate AI responses for common scenarios (greetings, questions, compliments). Copy and paste into your actual chat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Sentiment Analysis</h4>
                    <p className="text-xs text-muted-foreground">
                      Analyze chat sentiment from messages you paste in. Great for understanding viewer engagement patterns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Template Library</h4>
                    <p className="text-xs text-muted-foreground">
                      Create and save response templates for common chat situations. Build your knowledge base over time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Poll Generation</h4>
                    <p className="text-xs text-muted-foreground">
                      Let AI generate engaging poll questions and options, then manually post them to Twitch/YouTube.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">VTuber Avatar Preview</h4>
                    <p className="text-xs text-muted-foreground">
                      See your AI avatar react with emotions and speech animations. Use as a reference for actual stream overlay design.
                    </p>
                  </div>
                </div>
              </div>

              <Alert className="bg-accent/10 border-accent/30">
                <Info size={16} className="text-accent" />
                <AlertDescription className="text-xs ml-2">
                  <strong>Think of this app as your AI Assistant Workshop</strong> - a place to design, test, and refine your AI personality 
                  before deploying it with actual backend infrastructure for live streaming.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Next Steps for Real Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-bold text-primary">1.</span>
            <p>Use this Spark app to perfect your AI's personality and test responses</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-primary">2.</span>
            <p>Choose a backend solution (Node.js server, OBS plugin, or cloud bot service)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-primary">3.</span>
            <p>Transfer your Twitch credentials to that backend service (never expose them in browser)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-primary">4.</span>
            <p>Deploy your backend and connect it to Twitch using tmi.js or similar library</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-primary">5.</span>
            <p>Optionally: Connect your backend to this Spark UI using WebSockets for real-time monitoring</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
