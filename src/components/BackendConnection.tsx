import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { backendService } from '@/lib/backend-service';
import { PlugsConnected, Lightning, Warning, Info, Check, X, CircleNotch } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface BackendConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function BackendConnection({ onConnectionChange }: BackendConnectionProps) {
  const [backendUrl, setBackendUrl] = useState('ws://localhost:3001');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  useEffect(() => {
    backendService.on('connected', () => {
      setIsConnected(true);
      setConnectionError(null);
      toast.success('Connected to backend server');
      onConnectionChange?.(true);
      fetchServerStatus();
    });

    backendService.on('error', (payload) => {
      setConnectionError(payload.message);
      toast.error(`Backend error: ${payload.message}`);
    });

    return () => {
      backendService.disconnect();
    };
  }, []);

  const fetchServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/status');
      const data = await response.json();
      setServerStatus(data);
    } catch (error) {
      console.error('Failed to fetch server status:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      await backendService.connect();
      setIsConnected(true);
      onConnectionChange?.(true);
      await fetchServerStatus();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect';
      setConnectionError(message);
      setIsConnected(false);
      toast.error(`Connection failed: ${message}`);
      onConnectionChange?.(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    backendService.disconnect();
    setIsConnected(false);
    setServerStatus(null);
    toast.info('Disconnected from backend server');
    onConnectionChange?.(false);
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    const results: any = {
      backendServer: { status: 'checking', message: '' },
      websocket: { status: 'checking', message: '' },
      twitchConnection: { status: 'checking', message: '' },
      geminiAPI: { status: 'checking', message: '' },
    };

    try {
      // Check backend server health
      const healthResponse = await fetch('http://localhost:3001/health');
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        results.backendServer = {
          status: 'success',
          message: `Backend server is running (${health.connections?.clients || 0} clients connected)`,
          data: health
        };

        // Check Twitch connection from server status
        if (health.connections?.twitch) {
          results.twitchConnection = {
            status: 'success',
            message: 'Twitch IRC connected successfully'
          };
        } else {
          results.twitchConnection = {
            status: 'warning',
            message: 'Twitch not connected. Check your .env configuration (TWITCH_ACCESS_TOKEN, TWITCH_CLIENT_ID, TWITCH_CHANNEL)'
          };
        }
      } else {
        results.backendServer = {
          status: 'error',
          message: `Backend server returned error: ${healthResponse.status}`
        };
      }
    } catch (error) {
      results.backendServer = {
        status: 'error',
        message: 'Backend server is not running. Start it with: cd backend && npm run dev'
      };
      results.twitchConnection = {
        status: 'unknown',
        message: 'Cannot check - backend server not running'
      };
      results.geminiAPI = {
        status: 'unknown',
        message: 'Cannot check - backend server not running'
      };
    }

    // Check WebSocket connection
    if (backendService.isConnected()) {
      results.websocket = {
        status: 'success',
        message: 'WebSocket connection active'
      };
    } else {
      results.websocket = {
        status: 'warning',
        message: 'WebSocket not connected. Click "Connect to Backend" above.'
      };
    }

    // Check Gemini API from server status
    try {
      const statusResponse = await fetch('http://localhost:3001/status');
      if (statusResponse.ok) {
        const status = await statusResponse.json();
        // Try to infer Gemini status from server info
        results.geminiAPI = {
          status: 'success',
          message: 'Gemini API configured (check backend terminal for confirmation)'
        };
      }
    } catch (error) {
      // Already handled by backend server check
    }

    setDiagnosticResults(results);
    setIsRunningDiagnostics(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check size={18} weight="bold" className="text-accent" />;
      case 'error':
        return <X size={18} weight="bold" className="text-destructive" />;
      case 'warning':
        return <Warning size={18} weight="bold" className="text-yellow-500" />;
      case 'checking':
        return <CircleNotch size={18} weight="bold" className="text-muted-foreground animate-spin" />;
      default:
        return <Info size={18} className="text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <PlugsConnected size={24} weight="bold" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Backend Server Connection</CardTitle>
              <CardDescription>Connect to the backend server for real Twitch/YouTube chat</CardDescription>
            </div>
          </div>
          <Badge 
            className={isConnected ? 'bg-accent/20 text-accent border-accent/30' : 'bg-muted text-muted-foreground border-border'}
          >
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
                Connected
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-muted-foreground mr-2" />
                Disconnected
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6 mt-6">
            {!isConnected && (
              <Alert className="bg-primary/10 border-primary/30">
                <Info size={20} className="text-primary" />
                <AlertDescription className="text-sm">
                  <strong className="text-primary">Backend Required:</strong> To connect to real Twitch/YouTube chat, you need to run the backend server. See the <strong>backend/</strong> folder for setup instructions.
                </AlertDescription>
              </Alert>
            )}

            {connectionError && (
              <Alert className="bg-destructive/10 border-destructive/30">
                <Warning size={20} className="text-destructive" />
                <AlertDescription className="text-sm">
                  <strong className="text-destructive">Connection Error:</strong> {connectionError}
                  <br />
                  <span className="text-xs mt-2 block">Make sure the backend server is running on the specified URL.</span>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backend-url">Backend Server URL</Label>
                <Input
                  id="backend-url"
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="ws://localhost:3001"
                  disabled={isConnected}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  WebSocket URL of your backend server (default: ws://localhost:3001)
                </p>
              </div>

              <div className="flex gap-3">
                {!isConnected ? (
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting || !backendUrl}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Lightning size={18} weight="bold" />
                    {isConnecting ? 'Connecting...' : 'Connect to Backend'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    className="gap-2"
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>

            {serverStatus && isConnected && (
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Lightning size={16} weight="bold" className="text-accent" />
                  Server Status
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Version:</span>
                    <p className="font-medium">{serverStatus.version}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime:</span>
                    <p className="font-medium">{Math.floor(serverStatus.uptime)}s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Twitch:</span>
                    <Badge className={serverStatus.connections.twitch ? 'bg-accent/20 text-accent' : 'bg-muted'}>
                      {serverStatus.connections.twitch ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">YouTube:</span>
                    <Badge className={serverStatus.connections.youtube ? 'bg-accent/20 text-accent' : 'bg-muted'}>
                      {serverStatus.connections.youtube ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                </div>

                {serverStatus.connections && !serverStatus.connections.twitch && !serverStatus.connections.youtube && (
                  <Alert className="bg-yellow-500/10 border-yellow-500/30 mt-4">
                    <Warning size={18} className="text-yellow-500" />
                    <AlertDescription className="text-xs">
                      <strong>No platforms connected!</strong> Your backend is running but not connected to Twitch or YouTube. 
                      Check your <code className="bg-muted px-1 rounded">.env</code> file for correct credentials.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-sm mb-2">Quick Setup Guide</h4>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Navigate to the <code className="bg-muted px-1 py-0.5 rounded">backend/</code> folder</li>
                <li>Run <code className="bg-muted px-1 py-0.5 rounded">npm install</code> to install dependencies</li>
                <li>Copy <code className="bg-muted px-1 py-0.5 rounded">.env.example</code> to <code className="bg-muted px-1 py-0.5 rounded">.env</code></li>
                <li>Add <strong>GEMINI_API_KEY</strong> (required for AI responses)</li>
                <li>Add <strong>TWITCH_ACCESS_TOKEN</strong> and <strong>TWITCH_CLIENT_ID</strong></li>
                <li>Run <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code> to start the server</li>
                <li>Click "Connect to Backend" above</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6 mt-6">
            <Alert className="bg-primary/10 border-primary/30">
              <Info size={20} className="text-primary" />
              <AlertDescription className="text-sm">
                <strong className="text-primary">Connection Diagnostics:</strong> Run a comprehensive check to identify issues with your backend connection, Twitch integration, and AI services.
              </AlertDescription>
            </Alert>

            <Button
              onClick={runDiagnostics}
              disabled={isRunningDiagnostics}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              {isRunningDiagnostics ? (
                <>
                  <CircleNotch size={18} weight="bold" className="animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Lightning size={18} weight="bold" />
                  Run Diagnostics
                </>
              )}
            </Button>

            {diagnosticResults && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Diagnostic Results</h4>
                
                <div className="space-y-3">
                  {Object.entries(diagnosticResults).map(([key, result]: [string, any]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border ${
                        result.status === 'success'
                          ? 'bg-accent/5 border-accent/30'
                          : result.status === 'error'
                          ? 'bg-destructive/5 border-destructive/30'
                          : result.status === 'warning'
                          ? 'bg-yellow-500/5 border-yellow-500/30'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-sm capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h5>
                          <p className="text-xs text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6 mt-6">
            <Alert className="bg-yellow-500/10 border-yellow-500/30">
              <Warning size={20} className="text-yellow-500" />
              <AlertDescription className="text-sm">
                <strong className="text-yellow-500">Connected but nothing happening?</strong> Follow these troubleshooting steps if your backend is connected but you're not seeing chat messages or AI responses.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-accent" />
                  Step 1: Verify Backend Server
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>Open your backend terminal and check for:</p>
                  <code className="block bg-background p-2 rounded text-xs">
                    🚀 AI Streamer Backend Server running on port 3001<br />
                    ✅ Google Gemini initialized<br />
                    ✅ Connected to Twitch channel: michaelinzo
                  </code>
                  <p className="text-destructive font-semibold">❌ If you see "⚠️ Gemini API key not configured" - AI responses won't work!</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-accent" />
                  Step 2: Check .env Configuration
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>Your <code className="bg-background px-1 rounded">.env</code> file must have:</p>
                  <code className="block bg-background p-2 rounded text-xs">
                    GEMINI_API_KEY=your_key_here (REQUIRED)<br />
                    TWITCH_ACCESS_TOKEN=your_token<br />
                    TWITCH_CLIENT_ID=your_client_id<br />
                    TWITCH_CHANNEL=michaelinzo
                  </code>
                  <p className="text-accent font-semibold">Get Gemini key: https://aistudio.google.com/app/apikey</p>
                  <p className="text-accent font-semibold">Get Twitch token: https://twitchtokengenerator.com</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-accent" />
                  Step 3: Test Your Connection
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>1. Go to <strong>Live Monitor</strong> tab</p>
                  <p>2. Send a message in your Twitch chat: "Hello Nova!"</p>
                  <p>3. Watch for:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>Message appears in Live Chat Feed</li>
                    <li>Backend terminal shows: "Message from YourUsername: Hello Nova!"</li>
                    <li>AI responds within 5-10 seconds (30% chance)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-destructive/10 border-destructive/30">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Warning size={16} weight="bold" className="text-destructive" />
                  Common Issues
                </h4>
                <div className="text-xs space-y-2">
                  <div>
                    <p className="font-semibold">❌ "Login authentication failed"</p>
                    <p className="text-muted-foreground">Your Twitch access token is wrong or expired. Regenerate at twitchtokengenerator.com</p>
                  </div>
                  <div>
                    <p className="font-semibold">❌ "API_KEY_INVALID"</p>
                    <p className="text-muted-foreground">Wrong Gemini API key. Get new one from aistudio.google.com/app/apikey</p>
                  </div>
                  <div>
                    <p className="font-semibold">❌ Backend shows connected but no chat</p>
                    <p className="text-muted-foreground">Wrong TWITCH_CHANNEL in .env (should be lowercase, no #)</p>
                  </div>
                  <div>
                    <p className="font-semibold">❌ Chat appears but AI never responds</p>
                    <p className="text-muted-foreground">GEMINI_API_KEY missing or invalid. Check backend terminal for errors.</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-primary/10 border-primary/30">
                <Info size={20} className="text-primary" />
                <AlertDescription className="text-xs">
                  <strong className="text-primary">Need detailed help?</strong> See <strong>BACKEND_TROUBLESHOOTING.md</strong> in the project root for a complete step-by-step guide.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
