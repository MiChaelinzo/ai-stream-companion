import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Pulse, CheckCircle, Warning, XCircle } from '@phosphor-icons/react';
import { backendService } from '@/lib/backend-service';

interface KeepaliveIndicatorProps {
  className?: string;
}

export function KeepaliveIndicator({ className = '' }: KeepaliveIndicatorProps) {
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);
  const [lastPongTime, setLastPongTime] = useState<Date | null>(null);
  const [isHealthy, setIsHealthy] = useState(true);
  const [missedPongs, setMissedPongs] = useState(0);

  useEffect(() => {
    let pingInterval: NodeJS.Timeout;
    
    const checkHealth = () => {
      if (!lastPingTime || !lastPongTime) return;
      
      const timeSinceLastPing = Date.now() - lastPingTime.getTime();
      const timeSinceLastPong = Date.now() - lastPongTime.getTime();
      
      // If it's been more than 40 seconds since last pong (should be every 30s)
      if (timeSinceLastPong > 40000) {
        setIsHealthy(false);
      } else {
        setIsHealthy(true);
      }
    };

    if (backendService.isConnected()) {
      // Check health every 5 seconds
      pingInterval = setInterval(checkHealth, 5000);
    }

    return () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
  }, [lastPingTime, lastPongTime]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'pong') {
        setLastPongTime(new Date());
        setMissedPongs(0);
      }
    };

    const handleConnected = () => {
      setLastPingTime(null);
      setLastPongTime(null);
      setMissedPongs(0);
      setIsHealthy(true);
    };

    const handleDisconnected = () => {
      setIsHealthy(false);
    };

    backendService.on('*', handleMessage);
    backendService.on('connected', handleConnected);
    backendService.on('disconnected', handleDisconnected);

    return () => {
      backendService.off('*', handleMessage);
      backendService.off('connected', handleConnected);
      backendService.off('disconnected', handleDisconnected);
    };
  }, []);

  if (!backendService.isConnected()) {
    return (
      <Badge variant="outline" className={`gap-2 ${className}`}>
        <XCircle size={14} className="text-muted-foreground" />
        <span className="text-xs">Not Connected</span>
      </Badge>
    );
  }

  if (!isHealthy) {
    return (
      <Badge variant="outline" className={`gap-2 border-yellow-500/30 bg-yellow-500/10 ${className}`}>
        <Warning size={14} className="text-yellow-500" />
        <span className="text-xs text-yellow-500">Keepalive Warning</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`gap-2 border-accent/30 bg-accent/10 ${className}`}>
      <Pulse size={14} className="text-accent animate-pulse" />
      <span className="text-xs text-accent">Keepalive Active</span>
    </Badge>
  );
}
