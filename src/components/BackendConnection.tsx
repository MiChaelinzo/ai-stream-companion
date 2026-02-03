import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { backendService } from '@/lib/backend-service';
import { PlugsConnected, Lightning, Warning, Info } from '@phosphor-icons/react';
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
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <h4 className="font-semibold text-sm mb-2">Quick Setup Guide</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Navigate to the <code className="bg-muted px-1 py-0.5 rounded">backend/</code> folder</li>
            <li>Run <code className="bg-muted px-1 py-0.5 rounded">npm install</code> to install dependencies</li>
            <li>Copy <code className="bg-muted px-1 py-0.5 rounded">.env.example</code> to <code className="bg-muted px-1 py-0.5 rounded">.env</code> and add your credentials</li>
            <li>Run <code className="bg-muted px-1 py-0.5 rounded">npm run dev</code> to start the server</li>
            <li>Click "Connect to Backend" above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
