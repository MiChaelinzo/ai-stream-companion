import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { backendService } from '@/lib/backend-service';
import { BackendLogsViewer } from '@/components/BackendLogsViewer';
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
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    if (backendService.isConnected()) {
      setIsConnected(true);
      onConnectionChange?.(true);
      fetchServerStatus();
    }

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

    backendService.on('disconnected', () => {
      setIsConnected(false);
      setServerStatus(null);
      onConnectionChange?.(false);
    });

    return () => {
      backendService.disconnect();
    };
  }, [onConnectionChange]);

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
      backendServer: { status: 'checking', message: '', details: [] },
      websocket: { status: 'checking', message: '', details: [] },
      twitchConnection: { status: 'checking', message: '', details: [] },
      youtubeConnection: { status: 'checking', message: '', details: [] },
      geminiAPI: { status: 'checking', message: '', details: [] },
      networkConnectivity: { status: 'checking', message: '', details: [] },
    };

    setDiagnosticResults({ ...results });

    let health: any = null;
    let backendReachable = false;

    try {
      const healthResponse = await fetch('http://localhost:3001/health', { 
        signal: AbortSignal.timeout(10000)
      });
      
      if (healthResponse.ok) {
        health = await healthResponse.json();
        backendReachable = true;
      } else {
        backendReachable = false;
      }
    } catch (error: any) {
      backendReachable = false;
    }

    if (backendReachable && health) {
      results.backendServer = {
        status: 'success',
        message: `Backend server is running on port 3001`,
        details: [
          `✓ Server uptime: ${Math.floor(health.uptime || 0)}s`,
          `✓ Connected clients: ${health.connections?.clients || 0}`,
          `✓ Version: ${health.version || 'unknown'}`
        ],
        data: health
      };

      if (health.connections?.twitch) {
        const twitchDetails: string[] = [];
        twitchDetails.push(`✓ Connected to Twitch IRC`);
        if (health.twitch?.channel) {
          twitchDetails.push(`✓ Channel: ${health.twitch.channel}`);
        }
        if (health.twitch?.username) {
          twitchDetails.push(`✓ Bot username: ${health.twitch.username}`);
        }
        
        results.twitchConnection = {
          status: 'success',
          message: 'Twitch integration is working',
          details: twitchDetails
        };
      } else {
        results.twitchConnection = {
          status: 'warning',
          message: 'Twitch is not connected',
          details: [
            '⚠ Check your .env file has:',
            '  • TWITCH_ACCESS_TOKEN (from twitchtokengenerator.com)',
            '  • TWITCH_CLIENT_ID',
            '  • TWITCH_CHANNEL (your channel name, lowercase)',
            '⚠ Restart backend after updating .env'
          ]
        };
      }

      if (health.connections?.youtube) {
        results.youtubeConnection = {
          status: 'success',
          message: 'YouTube integration is working',
          details: [
            '✓ Connected to YouTube Live Chat API',
            health.youtube?.channelId ? `✓ Channel: ${health.youtube.channelId}` : ''
          ].filter(Boolean)
        };
      } else {
        results.youtubeConnection = {
          status: 'warning',
          message: 'YouTube is not connected',
          details: [
            '⚠ Add to .env if needed:',
            '  • YOUTUBE_API_KEY',
            '  • YOUTUBE_CHANNEL_ID',
            '⚠ YouTube requires additional setup (see docs)'
          ]
        };
      }

      if (health.gemini?.configured) {
        results.geminiAPI = {
          status: 'success',
          message: 'Gemini API is configured and ready',
          details: [
            '✓ GEMINI_API_KEY is set',
            `✓ Model: ${health.gemini?.model || 'gemini-3.0-flash'}`,
            '✓ AI responses will work'
          ]
        };
      } else {
        results.geminiAPI = {
          status: 'error',
          message: 'Gemini API is NOT configured',
          details: [
            '❌ GEMINI_API_KEY is missing or invalid',
            '→ Get key from: https://aistudio.google.com/app/apikey',
            '→ Add to .env file: GEMINI_API_KEY=your_key_here',
            '→ Restart backend server',
            '⚠ AI will not respond without this!'
          ]
        };
      }
    } else if (backendService.isConnected()) {
      results.backendServer = {
        status: 'success',
        message: 'Backend server is running (verified via WebSocket)',
        details: [
          '✓ WebSocket connection is active',
          '✓ Backend is responding',
          '⚠ HTTP health endpoint unavailable (this is OK if WebSocket works)',
          '→ Check backend terminal for any HTTP server issues'
        ]
      };

      results.twitchConnection = {
        status: 'warning',
        message: 'Cannot verify - use backend logs to check',
        details: [
          '⚠ Check backend terminal for Twitch connection status',
          '→ Should see: "✅ Connected to Twitch channel"',
          '→ Check .env file if not connected'
        ]
      };

      results.youtubeConnection = {
        status: 'warning',
        message: 'Cannot verify - use backend logs to check',
        details: [
          '⚠ Check backend terminal for YouTube connection status'
        ]
      };

      results.geminiAPI = {
        status: 'warning',
        message: 'Cannot verify - use backend logs to check',
        details: [
          '⚠ Check backend terminal for Gemini initialization',
          '→ Should see: "✅ Google Gemini initialized"',
          '→ Add GEMINI_API_KEY to .env if missing'
        ]
      };
    } else {
      results.backendServer = {
        status: 'error',
        message: 'Backend server is not running',
        details: [
          '❌ Cannot connect to http://localhost:3001',
          '→ Navigate to backend folder: cd backend',
          '→ Install dependencies: npm install',
          '→ Start server: npm run dev',
          '→ You should see: "🚀 AI Streamer Backend Server running on port 3001"'
        ]
      };
      
      results.twitchConnection = {
        status: 'unknown',
        message: 'Cannot check - backend not running',
        details: ['Start backend server first']
      };
      
      results.youtubeConnection = {
        status: 'unknown',
        message: 'Cannot check - backend not running',
        details: ['Start backend server first']
      };
      
      results.geminiAPI = {
        status: 'unknown',
        message: 'Cannot check - backend not running',
        details: ['Start backend server first']
      };
    }

    if (backendService.isConnected() || isConnected) {
      results.websocket = {
        status: 'success',
        message: 'WebSocket connection is active',
        details: [
          '✓ Connected to ws://localhost:3001',
          '✓ Real-time communication ready',
          '✓ Chat messages will flow through this connection'
        ]
      };
    } else {
      if (backendReachable || results.backendServer.status === 'success') {
        results.websocket = {
          status: 'warning',
          message: 'WebSocket not connected (but server is running)',
          details: [
            '⚠ Backend is running but WebSocket not connected',
            '→ Click "Connect to Backend" button on Connection tab',
            '→ Make sure URL is correct: ws://localhost:3001'
          ]
        };
      } else {
        results.websocket = {
          status: 'error',
          message: 'WebSocket not connected',
          details: [
            '❌ Cannot connect - backend server must be running first',
            '→ Fix backend server issues first (see above)'
          ]
        };
      }
    }

    try {
      const testUrl = 'https://www.google.com';
      const response = await fetch(testUrl, { 
        method: 'HEAD', 
        signal: AbortSignal.timeout(3000),
        mode: 'no-cors'
      });
      results.networkConnectivity = {
        status: 'success',
        message: 'Internet connection is working',
        details: [
          '✓ Network connectivity verified',
          '✓ Can reach external services',
          '✓ API calls should work'
        ]
      };
    } catch (error) {
      results.networkConnectivity = {
        status: 'warning',
        message: 'Network check inconclusive',
        details: [
          '⚠ Could not verify internet connection',
          '→ Check your network settings if APIs fail'
        ]
      };
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

  const testBackendConnection = async () => {
    setIsTestingConnection(true);
    const results: any = {
      step: 1,
      message: 'Testing connection...',
      logs: []
    };
    setTestResults({ ...results });

    try {
      results.logs.push('→ Attempting to connect to http://localhost:3001...');
      setTestResults({ ...results });
      
      const response = await fetch('http://localhost:3001/health', { 
        signal: AbortSignal.timeout(5000) 
      });
      
      if (response.ok) {
        results.logs.push('✓ Backend server responded successfully');
        const data = await response.json();
        
        results.logs.push(`✓ Server version: ${data.version || 'unknown'}`);
        results.logs.push(`✓ Uptime: ${Math.floor(data.uptime || 0)}s`);
        
        if (data.connections?.twitch) {
          results.logs.push(`✓ Twitch connected: ${data.twitch?.channel || 'yes'}`);
          results.success = true;
          results.message = 'Connection test passed! Backend is working correctly.';
        } else {
          results.logs.push('⚠ Twitch not connected (check .env file)');
          results.success = false;
          results.message = 'Backend is running but Twitch is not connected.';
        }

        if (data.gemini?.configured) {
          results.logs.push('✓ Gemini API configured');
        } else {
          results.logs.push('⚠ Gemini API not configured - AI responses will not work');
          results.success = false;
        }
      } else {
        results.success = false;
        results.logs.push(`❌ Server returned error: HTTP ${response.status}`);
        results.message = 'Backend is running but not responding correctly.';
      }
    } catch (error: any) {
      results.success = false;
      if (error.name === 'TimeoutError') {
        results.logs.push('❌ Connection timed out after 5 seconds');
        results.message = 'Backend server is not responding.';
      } else {
        results.logs.push('❌ Cannot connect to backend server');
        results.logs.push('→ Make sure backend is running: cd backend && npm run dev');
        results.message = 'Backend server is not running.';
      }
    }

    setTestResults(results);
    setIsTestingConnection(false);
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="logs">Live Logs</TabsTrigger>
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

          <TabsContent value="logs" className="space-y-6 mt-6">
            <BackendLogsViewer isConnected={isConnected} />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6 mt-6">
            <Alert className="bg-primary/10 border-primary/30">
              <Info size={20} className="text-primary" />
              <AlertDescription className="text-sm">
                <strong className="text-primary">Connection Diagnostics:</strong> Run a comprehensive check to identify issues with your backend connection, Twitch integration, and AI services.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
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
                    Run Full Diagnostics
                  </>
                )}
              </Button>

              <Button
                onClick={testBackendConnection}
                disabled={isTestingConnection}
                variant="outline"
                className="gap-2"
              >
                {isTestingConnection ? (
                  <>
                    <CircleNotch size={18} weight="bold" className="animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <PlugsConnected size={18} weight="bold" />
                    Quick Connection Test
                  </>
                )}
              </Button>
            </div>

            {testResults && (
              <div className={`p-4 rounded-lg border ${
                testResults.success 
                  ? 'bg-accent/10 border-accent/30' 
                  : 'bg-destructive/10 border-destructive/30'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {testResults.success ? (
                    <Check size={20} weight="bold" className="text-accent" />
                  ) : (
                    <X size={20} weight="bold" className="text-destructive" />
                  )}
                  <h4 className="font-semibold text-sm">{testResults.message}</h4>
                </div>
                <div className="space-y-1 text-xs font-mono bg-background/50 p-3 rounded border border-border/50 max-h-48 overflow-y-auto">
                  {testResults.logs.map((log: string, idx: number) => (
                    <div key={idx} className="text-muted-foreground leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {diagnosticResults && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Diagnostic Results</h4>
                  <Badge variant="outline" className="text-xs">
                    {Object.values(diagnosticResults).filter((r: any) => r.status === 'success').length} / {Object.keys(diagnosticResults).length} Passed
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(diagnosticResults).map(([key, result]: [string, any]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border transition-all ${
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
                        <div className="flex-1 space-y-2">
                          <div>
                            <h5 className="font-semibold text-sm capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <p className="text-xs text-muted-foreground">{result.message}</p>
                          </div>
                          
                          {result.details && result.details.length > 0 && (
                            <div className="mt-2 space-y-1 text-xs font-mono bg-background/50 p-3 rounded border border-border/50">
                              {result.details.map((detail: string, idx: number) => (
                                <div key={idx} className="text-muted-foreground leading-relaxed">
                                  {detail}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className={
                  Object.values(diagnosticResults).every((r: any) => r.status === 'success')
                    ? 'bg-accent/10 border-accent/30'
                    : Object.values(diagnosticResults).some((r: any) => r.status === 'error')
                    ? 'bg-destructive/10 border-destructive/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }>
                  {Object.values(diagnosticResults).every((r: any) => r.status === 'success') ? (
                    <>
                      <Check size={20} className="text-accent" />
                      <AlertDescription className="text-sm">
                        <strong className="text-accent">All systems operational!</strong> Your backend is properly configured and ready to handle live chat.
                      </AlertDescription>
                    </>
                  ) : Object.values(diagnosticResults).some((r: any) => r.status === 'error') ? (
                    <>
                      <X size={20} className="text-destructive" />
                      <AlertDescription className="text-sm">
                        <strong className="text-destructive">Critical issues detected.</strong> Fix the errors above before your AI can respond to chat. Check the Troubleshooting tab for detailed help.
                      </AlertDescription>
                    </>
                  ) : (
                    <>
                      <Warning size={20} className="text-yellow-500" />
                      <AlertDescription className="text-sm">
                        <strong className="text-yellow-500">Some features may not work.</strong> Review the warnings above to ensure full functionality.
                      </AlertDescription>
                    </>
                  )}
                </Alert>
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
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                  Verify Backend Server is Running
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Open your backend terminal</strong> and check for these messages:</p>
                  <code className="block bg-background p-3 rounded text-xs leading-relaxed">
                    🚀 AI Streamer Backend Server running on port 3001<br />
                    ✅ Google Gemini initialized<br />
                    ✅ Connected to Twitch channel: michaelinzo
                  </code>
                  <div className="pt-2 space-y-1">
                    <p className="text-destructive font-semibold">❌ If you see "⚠️ Gemini API key not configured":</p>
                    <p className="ml-4">→ AI responses will NOT work until you add GEMINI_API_KEY to .env</p>
                    <p className="text-destructive font-semibold">❌ If you see "Login authentication failed":</p>
                    <p className="ml-4">→ Your TWITCH_ACCESS_TOKEN is invalid or expired</p>
                    <p className="text-destructive font-semibold">❌ If backend crashes immediately:</p>
                    <p className="ml-4">→ Check for syntax errors in .env file (no spaces, quotes, or extra lines)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                  Check .env Configuration
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>Your <code className="bg-background px-1 rounded">backend/.env</code> file must have:</p>
                  <code className="block bg-background p-3 rounded text-xs leading-relaxed">
                    <span className="text-destructive">GEMINI_API_KEY</span>=your_key_here<span className="text-accent ml-2"># REQUIRED!</span><br />
                    <span className="text-destructive">TWITCH_ACCESS_TOKEN</span>=oauth:abcd1234...<br />
                    <span className="text-destructive">TWITCH_CLIENT_ID</span>=your_client_id<br />
                    <span className="text-destructive">TWITCH_CHANNEL</span>=michaelinzo<span className="text-accent ml-2"># lowercase, no #</span>
                  </code>
                  <div className="pt-2 space-y-1">
                    <p className="text-accent font-semibold">📍 Get Gemini API key:</p>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="ml-4 text-primary hover:underline block">
                      https://aistudio.google.com/app/apikey
                    </a>
                    <p className="text-accent font-semibold">📍 Get Twitch token (select chat:read and chat:write scopes):</p>
                    <a href="https://twitchtokengenerator.com" target="_blank" rel="noopener noreferrer" className="ml-4 text-primary hover:underline block">
                      https://twitchtokengenerator.com
                    </a>
                    <p className="text-yellow-500 font-semibold mt-2">⚠️ Important: Restart backend after changing .env!</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                  Test Your Connection
                </h4>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Step-by-step testing:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click "Connect to Backend" button on Connection tab</li>
                    <li>Go to <strong>Live Monitor</strong> tab in this app</li>
                    <li>Open your Twitch stream in another window/tab</li>
                    <li>Send a message in Twitch chat: "Hello Nova!"</li>
                    <li>Watch for message in Live Chat Feed (should appear within 1 second)</li>
                    <li>Backend terminal should show: <code className="bg-background px-1 rounded">Message from YourUsername: Hello Nova!</code></li>
                    <li>AI may respond (30% chance, 5-10 second delay)</li>
                  </ol>
                  <div className="pt-2 space-y-1">
                    <p className="font-semibold">If message doesn't appear:</p>
                    <p className="ml-4">→ Wrong TWITCH_CHANNEL in .env (check spelling, must be lowercase)</p>
                    <p className="ml-4">→ Token doesn't have chat:read permission</p>
                    <p className="font-semibold">If message appears but AI never responds:</p>
                    <p className="ml-4">→ GEMINI_API_KEY missing or invalid</p>
                    <p className="ml-4">→ Check backend terminal for AI-related errors</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-destructive/10 border-destructive/30">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Warning size={16} weight="bold" className="text-destructive" />
                  Common Error Messages
                </h4>
                <div className="text-xs space-y-3">
                  <div>
                    <p className="font-semibold text-destructive">❌ "Login authentication failed"</p>
                    <p className="text-muted-foreground ml-4">Your Twitch access token is invalid or expired</p>
                    <p className="text-accent ml-4">→ Generate new token at twitchtokengenerator.com</p>
                    <p className="text-accent ml-4">→ Select scopes: chat:read, chat:write, channel:moderate</p>
                    <p className="text-accent ml-4">→ Copy ACCESS TOKEN (not refresh token)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">❌ "API_KEY_INVALID" or Gemini errors</p>
                    <p className="text-muted-foreground ml-4">Wrong or missing Gemini API key</p>
                    <p className="text-accent ml-4">→ Get new key from aistudio.google.com/app/apikey</p>
                    <p className="text-accent ml-4">→ Copy entire key (starts with "AI...")</p>
                    <p className="text-accent ml-4">→ Paste in .env: GEMINI_API_KEY=AIza...</p>
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">❌ Backend connected but no chat appearing</p>
                    <p className="text-muted-foreground ml-4">Wrong channel name or token permissions</p>
                    <p className="text-accent ml-4">→ TWITCH_CHANNEL must be lowercase, no # symbol</p>
                    <p className="text-accent ml-4">→ Example: TWITCH_CHANNEL=michaelinzo (not #michaelinzo)</p>
                    <p className="text-accent ml-4">→ Token must have chat:read scope</p>
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">❌ Chat appears but AI never responds</p>
                    <p className="text-muted-foreground ml-4">Missing or invalid GEMINI_API_KEY</p>
                    <p className="text-accent ml-4">→ Check backend terminal for Gemini-related errors</p>
                    <p className="text-accent ml-4">→ Verify API key is correct and active</p>
                    <p className="text-accent ml-4">→ Ensure no extra spaces or quotes in .env</p>
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">❌ "WebSocket connection failed"</p>
                    <p className="text-muted-foreground ml-4">Cannot connect frontend to backend</p>
                    <p className="text-accent ml-4">→ Make sure backend is running first</p>
                    <p className="text-accent ml-4">→ Check URL is ws://localhost:3001 (not http://)</p>
                    <p className="text-accent ml-4">→ Try restarting both frontend and backend</p>
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">❌ "Port 3001 already in use"</p>
                    <p className="text-muted-foreground ml-4">Another process is using port 3001</p>
                    <p className="text-accent ml-4">→ Kill existing process: lsof -ti:3001 | xargs kill</p>
                    <p className="text-accent ml-4">→ Or change port in backend/index.js and frontend URL</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border-accent/30">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightning size={16} weight="bold" className="text-accent" />
                  Pro Tips
                </h4>
                <div className="text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-accent">💡</span>
                    <p><strong>Keep backend terminal visible</strong> - It shows real-time logs of chat messages and errors</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent">💡</span>
                    <p><strong>Test in your actual stream first</strong> - Don't rely on simulators, send real Twitch messages</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent">💡</span>
                    <p><strong>AI responds to ~30% of messages</strong> - This is intentional to avoid spam. Not every message gets a response.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent">💡</span>
                    <p><strong>Check Gemini API quotas</strong> - Free tier has limits. Visit console.cloud.google.com to monitor usage.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent">💡</span>
                    <p><strong>.env changes require restart</strong> - Always restart backend with Ctrl+C then npm run dev</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-primary/10 border-primary/30">
                <Info size={20} className="text-primary" />
                <AlertDescription className="text-xs">
                  <strong className="text-primary">Still having issues?</strong> Try the <strong>Diagnostics</strong> tab above to automatically check your setup, or see <strong>BACKEND_TROUBLESHOOTING.md</strong> for the complete troubleshooting guide.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
