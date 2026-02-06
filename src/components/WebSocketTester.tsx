import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { backendService } from '@/lib/backend-
import { toast } from 'sonner';
interface ConnectionEvent {
  type: 'connected' | 'disconnected' | 'ping' | 'pong' | 'message' | 'error' | 'warni
import { toast } from 'sonner';

interface ConnectionEvent {
  timestamp: Date;
  type: 'connected' | 'disconnected' | 'ping' | 'pong' | 'message' | 'error';
  message: string;
}

  const [pongCount, setPongCount] =
  const durationInterval = useRef<NodeJS.Timeout | null>

    const handleConnected = () => {
      setIsConnected(true);
      
        if (startTime.current) {
          setConnectionDuration(duration);
      }, 1000);


      if (durationI
        durationInterval.current = 
    };
    const handleError = (pa
    };
    co
        setPongCount(prev => prev + 1);
      } else {
      }

    backe
    backendServ
    if

      durationInterval.current = setIn
          const duration = Math.floor((Date.now() - start
        }
    }
    return () => {
      backendService.off('disconnected',
      b
      

  }, []);
  const addEvent = (type: ConnectionEvent['type'], message: 
      


    setIsTesting(true);
    setPingCount(0);
    setMissedPongs(0);

      addEvent('message', 'Starting WebSocket keepalive t
      i
      

      addEvent('message', 'Running 2-minute keepaliv
      
      const startTestTime = Date.now();
      const checkInterval = setInterval(()

          clearInterval(checkInterval);
          return;

      
          setMissedPongs(prev => prev + 1);
          setIsTesting(false);
      }, 5000);
    } catch (error: any) {
      toa
    }


    const expected

      addEvent('message', `✅ Test passed! Connection stable f
      toast.success('WebSocket keepalive test p
      addEvent('warning', `⚠️ Test completed 
      
      addEvent('error', `❌ Test faile
      toast.error('WebSocket keepalive test fail
  };
  cons
    const

  const getEventIcon = (type: ConnectionEvent['type']) => {
      case 'connected':
      case 'disconnected':
      case 'ping':
       
    

        return <Info size={14} cl
  };
  return (
      <CardHeader>
          <div>
            <CardDescr
          <Badge className={i

         
            ) : (
      
        </div>
      <CardContent className="space-y-4">
          <Info size={20} className="te
            <strong className="text-primary">How it works:</stro
       

          <div className="p-3 rounded-lg bg-muted/50 border bord
            <div className="text-2xl font-bold">{formatDuration(connectionDurat
      
            <div className="text-2
          <div className="p-3 rounded-l

          <div className="p-3 rounded-lg bg-mut
            <div className="text-2xl font-bold text
        
        {isTesting && (
            <div className="flex items-
              <span cla
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
        return <Activity size={14} weight="bold" className="text-primary" />;
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































































