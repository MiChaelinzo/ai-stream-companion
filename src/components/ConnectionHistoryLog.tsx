import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKV } from '@github/spark/hooks';
import { 
  Download, 
  Trash, 
  CheckCircle, 
  XCircle, 
  Warning, 
  ArrowClockwise,
  ListDashes
} from '@phosphor-icons/react';

export interface ConnectionEvent {
  id: string;
  timestamp: Date;
  type: 'connected' | 'disconnected' | 'error' | 'reconnect-attempt';
  backendUrl: string;
  message?: string;
  metadata?: {
    uptime?: number;
    serverVersion?: string;
    twitchConnected?: boolean;
    youtubeConnected?: boolean;
    errorDetails?: string;
    attemptNumber?: number;
    closeCode?: number | string;
    closeReason?: string;
  };
}

interface ConnectionHistoryLogProps {
  maxEvents?: number;
}

export function ConnectionHistoryLog({ maxEvents = 100 }: ConnectionHistoryLogProps) {
  const [connectionHistory, setConnectionHistory] = useKV<ConnectionEvent[]>('connection-history', []);
  const [isClearing, setIsClearing] = useState(false);

  // Sort history by newest first
  const sortedHistory = [...(connectionHistory || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getEventIcon = (type: ConnectionEvent['type']) => {
    switch (type) {
      case 'connected':
        return <CheckCircle size={20} weight="fill" className="text-accent" />;
      case 'disconnected':
        return <XCircle size={20} weight="fill" className="text-muted-foreground" />;
      case 'error':
        return <Warning size={20} weight="fill" className="text-destructive" />;
      case 'reconnect-attempt':
        return <ArrowClockwise size={20} weight="bold" className="text-yellow-500" />;
      default:
        return <ListDashes size={20} />;
    }
  };

  const getEventBadge = (type: ConnectionEvent['type']) => {
    switch (type) {
      case 'connected':
        return <Badge className="bg-accent/20 text-accent border-accent/30">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>;
      case 'error':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>;
      case 'reconnect-attempt':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Retry</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const handleClearHistory = () => {
    setIsClearing(true);
    setConnectionHistory([]);
    setTimeout(() => setIsClearing(false), 500);
  };

  const handleDownloadHistory = () => {
    const data = JSON.stringify(sortedHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `connection-history-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSessionStats = () => {
    const events = connectionHistory || [];
    const totalDisconnections = events.filter(e => e.type === 'disconnected').length;
    const reconnectAttempts = events.filter(e => e.type === 'reconnect-attempt').length;
    const errors = events.filter(e => e.type === 'error').length;
    
    return {
      totalEvents: events.length,
      totalDisconnections,
      reconnectAttempts,
      errors
    };
  };

  const stats = getSessionStats();

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-card to-background h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
              <ListDashes className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Connection Logs</CardTitle>
              <p className="text-xs text-muted-foreground">Track backend connectivity events</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadHistory}
              disabled={sortedHistory.length === 0}
              title="Download Logs"
            >
              <Download size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              disabled={isClearing || sortedHistory.length === 0}
              className="hover:bg-destructive/10 hover:text-destructive"
              title="Clear History"
            >
              <Trash size={16} weight="bold" />
            </Button>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="bg-muted/30 rounded p-2">
            <div className="text-xs text-muted-foreground">Events</div>
            <div className="font-bold">{stats.totalEvents}</div>
          </div>
          <div className="bg-muted/30 rounded p-2">
            <div className="text-xs text-muted-foreground">Disconnects</div>
            <div className="font-bold text-muted-foreground">{stats.totalDisconnections}</div>
          </div>
          <div className="bg-muted/30 rounded p-2">
            <div className="text-xs text-muted-foreground">Retries</div>
            <div className="font-bold text-yellow-500">{stats.reconnectAttempts}</div>
          </div>
          <div className="bg-muted/30 rounded p-2">
            <div className="text-xs text-muted-foreground">Errors</div>
            <div className="font-bold text-destructive">{stats.errors}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[400px] w-full px-4 pb-4">
          {sortedHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground space-y-2">
              <CheckCircle size={32} className="opacity-20" />
              <p className="text-sm">No connection events recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedHistory.map((event, index) => (
                <div
                  key={event.id || index}
                  className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors text-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getEventIcon(event.type)}</div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">
                          {format(new Date(event.timestamp), 'HH:mm:ss.SSS')}
                        </span>
                        {getEventBadge(event.type)}
                      </div>
                      
                      <div className="text-foreground font-medium">
                        {event.message || event.type}
                      </div>

                      {/* Metadata Rendering */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 bg-muted/50 p-2 rounded text-xs font-mono grid grid-cols-1 gap-1">
                          {event.metadata.errorDetails && (
                            <div className="text-destructive break-all">
                              Err: {event.metadata.errorDetails}
                            </div>
                          )}
                          {event.metadata.uptime && (
                            <div className="text-muted-foreground">
                              Uptime: {(event.metadata.uptime / 1000).toFixed(1)}s
                            </div>
                          )}
                          {event.metadata.attemptNumber && (
                            <div className="text-yellow-500">
                              Attempt: #{event.metadata.attemptNumber}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
