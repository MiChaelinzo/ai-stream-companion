import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { backendService } from '@/lib/backend-service';
import { Lightning, Check, X, Warning, Info, Pulse } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface ConnectionEvent {
  timestamp: Date;
  type: 'connected' | 'disconnected' | 'ping' | 'pong' | 'message' | 'error' | 'warning';
  message: string;
}

export function WebSocketTester() {
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [events, setEvents] = useState<ConnectionEvent[]>([]);
  const [connectionDuration, setConnectionDuration] = useState(0);
  const [pingCount, setPingCount] = useState(0);
  const [pongCount, setPongCount] = useState(0);
  const [missedPongs, setMissedPongs] = useState(0);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<Date | null>(null);

  useEffect(() => {
    const handleConnected = () => {
      addEvent('connected', 'WebSocket connected successfully');
      setIsConnected(true);
      startTime.current = new Date();
      
      durationInterval.current = setInterval(() => {
        if (startTime.current) {
          const duration = Math.floor((Date.now() - startTime.current.getTime()) / 1000);
          setConnectionDuration(duration);
        }
      }, 1000);
    };

    const handleDisconnected = () => {
      addEvent('disconnected', 'WebSocket disconnected');
      setIsConnected(false);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    };

    const handleError = (payload: any) => {
      addEvent('error', payload.message || 'Unknown error');
    };

    const handleMessage = (message: any) => {
      if (message.type === 'pong') {
        setPongCount(prev => prev + 1);
        addEvent('pong', 'Received pong from server');
      } else {
        addEvent('message', `Received: ${message.type}`);
      }
    };

    backendService.on('connected', handleConnected);
    backendService.on('disconnected', handleDisconnected);
    backendService.on('error', handleError);
    backendService.on('*', handleMessage);

    if (backendService.isConnected()) {
      setIsConnected(true);
      startTime.current = new Date();
      
      durationInterval.current = setInterval(() => {
        if (startTime.current) {
          const duration = Math.floor((Date.now() - startTime.current.getTime()) / 1000);
          setConnectionDuration(duration);
        }
      }, 1000);
    }

    return () => {
      backendService.off('connected', handleConnected);
      backendService.off('disconnected', handleDisconnected);
      backendService.off('error', handleError);
      backendService.off('*', handleMessage);
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  const addEvent = (type: ConnectionEvent['type'], message: string) => {
    setEvents(prev => [
      { timestamp: new Date(), type, message },
      ...prev.slice(0, 49)
    ]);
  };

  const startTest = async () => {
    setIsTesting(true);
    setEvents([]);
    setPingCount(0);
    setPongCount(0);
    setMissedPongs(0);
    setConnectionDuration(0);

    try {
      addEvent('message', 'Starting WebSocket keepalive test...');
      
      if (!backendService.isConnected()) {
        addEvent('message', 'Connecting to backend...');
        await backendService.connect();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      addEvent('message', 'Running 2-minute keepalive test...');
      addEvent('message', 'Monitoring ping/pong cycles (every 30 seconds)...');
      
      const testDuration = 120000;
      const startTestTime = Date.now();

      const checkInterval = setInterval(() => {
        const elapsed = Date.now() - startTestTime;
        
        if (elapsed >= testDuration) {
          clearInterval(checkInterval);
          finishTest();
          return;
        }

        if (!backendService.isConnected()) {
          clearInterval(checkInterval);
          addEvent('error', 'Connection lost during test!');
          setMissedPongs(prev => prev + 1);
          toast.error('Connection test failed - connection lost');
          setIsTesting(false);
        }
      }, 5000);

    } catch (error: any) {
      addEvent('error', `Test failed: ${error.message}`);
      toast.error('Connection test failed');
      setIsTesting(false);
    }
  };

  const finishTest = () => {
    setIsTesting(false);
    
    const expectedPings = Math.floor(120 / 30);
    const successRate = pongCount >= expectedPings - 1 ? 100 : Math.floor((pongCount / expectedPings) * 100);

    if (backendService.isConnected() && successRate >= 75) {
      addEvent('message', `✅ Test passed! Connection stable for 2 minutes`);
      addEvent('message', `Success rate: ${successRate}% (${pongCount}/${expectedPings} pongs)`);
      toast.success('WebSocket keepalive test passed!');
    } else if (successRate >= 50) {
      addEvent('warning', `⚠️ Test completed with warnings`);
      addEvent('warning', `Success rate: ${successRate}% - some keepalives missed`);
      toast.warning('Connection unstable - check backend logs');
    } else {
      addEvent('error', `❌ Test failed - connection unstable`);
      addEvent('error', `Success rate: ${successRate}% - too many keepalives missed`);
      toast.error('WebSocket keepalive test failed');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (type: ConnectionEvent['type']) => {
    switch (type) {
      case 'connected':
        return <Check size={14} weight="bold" className="text-accent" />;
      case 'disconnected':
        return <X size={14} weight="bold" className="text-destructive" />;
      case 'ping':
      case 'pong':
        return <Pulse size={14} weight="bold" className="text-primary" />;
      case 'error':
        return <X size={14} weight="bold" className="text-destructive" />;
      case 'warning':
        return <Warning size={14} weight="bold" className="text-yellow-500" />;
      default:
        return <Info size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">WebSocket Keepalive Tester</CardTitle>
            <CardDescription>Test WebSocket connection stability with ping/pong monitoring</CardDescription>
          </div>
          <Badge className={isConnected ? 'bg-accent/20 text-accent border-accent/30' : 'bg-muted'}>
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
                Connected
              </>
            ) : (
              'Disconnected'
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-primary/10 border-primary/30">
          <Info size={20} className="text-primary" />
          <AlertDescription className="text-xs">
            <strong className="text-primary">How it works:</strong> This test monitors your WebSocket connection for 2 minutes, tracking ping/pong keepalive cycles. 
            The backend sends a <code className="bg-muted px-1 rounded">ping</code> every 30 seconds, and expects a <code className="bg-muted px-1 rounded">pong</code> response within 5 seconds.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Connection Time</div>
            <div className="text-2xl font-bold">{formatDuration(connectionDuration)}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Pings Sent</div>
            <div className="text-2xl font-bold text-primary">{pingCount}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Pongs Received</div>
            <div className="text-2xl font-bold text-accent">{pongCount}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="text-xs text-muted-foreground mb-1">Missed Pongs</div>
            <div className="text-2xl font-bold text-destructive">{missedPongs}</div>
          </div>
        </div>

        {isTesting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Test Progress</span>
              <span className="font-medium">{formatDuration(Math.min(connectionDuration, 120))} / 2:00</span>
            </div>
            <Progress value={(connectionDuration / 120) * 100} className="h-2" />
          </div>
        )}

        <Button
          onClick={startTest}
          disabled={isTesting}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Lightning size={18} weight="bold" />
          {isTesting ? 'Running Test...' : 'Start 2-Minute Keepalive Test'}
        </Button>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Connection Events</h4>
            {events.length > 0 && (
              <Button
                onClick={() => setEvents([])}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="rounded-lg border border-border bg-muted/30 h-64 overflow-y-auto">
            {events.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Start a test to see connection events
              </div>
            ) : (
              <div className="p-3 space-y-1.5">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs font-mono p-2 rounded bg-background/50 hover:bg-background transition-colors"
                  >
                    <div className="mt-0.5">{getEventIcon(event.type)}</div>
                    <div className="flex-1 space-y-0.5">
                      <div className="text-muted-foreground">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                      <div className={
                        event.type === 'error' ? 'text-destructive' :
                        event.type === 'connected' ? 'text-accent' :
                        event.type === 'pong' ? 'text-primary' :
                        event.type === 'warning' ? 'text-yellow-500' :
                        'text-foreground'
                      }>
                        {event.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Alert className="bg-accent/10 border-accent/30">
          <Lightning size={18} className="text-accent" />
          <AlertDescription className="text-xs">
            <strong className="text-accent">What to expect:</strong> You should see ~4 pong events during the 2-minute test (one every 30 seconds). 
            If pongs are missing or the connection drops, there may be network issues or the backend keepalive isn't working properly.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
