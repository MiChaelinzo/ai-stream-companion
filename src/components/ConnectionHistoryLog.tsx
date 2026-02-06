import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKV } from '@github/spark/hooks';

  id: string;
  timestamp: Date;

    serverVersion?: string;
    twitchCon
    errorDetails?: string;
  };

  maxEvents?: numbe

  const [connectionHistory,

    twitchConnected?: boolean;
    youtubeConnected?: boolean;
    errorDetails?: string;
    attemptNumber?: number;
  };
}

interface ConnectionHistoryLogProps {
  maxEvents?: number;
}

export function ConnectionHistoryLog({ maxEvents = 100 }: ConnectionHistoryLogProps) {
  const [connectionHistory, setConnectionHistory] = useKV<ConnectionEvent[]>('connection-history', []);
  const [isClearing, setIsClearing] = useState(false);

  const sortedHistory = [...(connectionHistory || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

      case 'connected':
      case 'disconn
      case 'error':
      case 'reconnect-attempt':
      default:
    }

    setIsClearing(true);
    setTimeout(() => setIsClear

    const data
    const url = URL.createObjectURL(blob);
    l
    

  };
  const getSessionS
    const totalConnecti
    const totalErrors = events.filter(e => e.type === 'error').length;

    let currentConnectTime: number | null = null;
    const sortedEve
    );
    sortedEvents.forEach(event 
        currentConnectTime = new Date(event.timestamp).getTime();
        const 
        currentConne
    }
    

    const totalUptimeMinutes = Math.
    return {
      totalDisconnections,
      reconnectAttempts,
    


    <Card className="border-primary/20 bg-gradient-to-br
        <div className="flex items-center justify-between">
            <div className="p-3 rounded-fu
            </div>
              <CardT
            </div>
          <div className="flex gap-2
              onC
              size="sm"
              disabled={sorte
    

              onClick={handleClea
              size="sm"
              disabled={isClearing || sortedHistory.length === 0}
              <Trash size={16} weight="bold" />
            </Button>
        </div>

          <div className
            <p className="text-2xl font-bold te

          
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30"
            <p className=
          <div className="p-3 rounded-lg 
            <p className="text-2xl font-bold text-yellow-
          <div className="p-3 rounded-lg bg-primary/10 border border-prim
            <p className="text-2xl font-bold text-primary">
        </div>
        {sortedHistory.length === 0 
         
         

        ) : (
            <div className="flex items-center justify-between">
     



            
                    cla
                    <div c
                  
                        
                         
      
    

                              {eve

          
                        {event.message && (
                  
                        <div className="flex flex-wrap gap-
                            {event.backendUrl}

                            <Badge variant="outline" className="text-[10px]">
                  

                            <Badge variant="outline" className="text-[10px]
                            </Badge>

                
                            </Badge>

                            <Badge classNam
                            </B

                            <Ba
                            </Badge>
             
                        {event.metadata?.errorDeta
                    
            </Button>
            <Button
              onClick={handleClearHistory}
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10"
              disabled={isClearing || sortedHistory.length === 0}
            >
              <Trash size={16} weight="bold" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-xs text-muted-foreground mb-1">Connections</p>
            <p className="text-2xl font-bold text-accent">{stats.totalConnections}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Disconnections</p>
            <p className="text-2xl font-bold">{stats.totalDisconnections}</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-xs text-muted-foreground mb-1">Errors</p>
            <p className="text-2xl font-bold text-destructive">{stats.totalErrors}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-xs text-muted-foreground mb-1">Reconnects</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.reconnectAttempts}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Total Uptime</p>
            <p className="text-2xl font-bold text-primary">{stats.totalUptimeMinutes}m</p>
          </div>
        </div>

        {sortedHistory.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-lg">
            <ClockCounterClockwise size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No connection events yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect to the backend to start tracking connection history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Event Timeline</h4>
              <Badge variant="outline" className="text-xs">
                {sortedHistory.length} event{sortedHistory.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {sortedHistory.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getEventIcon(event.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getEventBadge(event.type)}
                              <span className="text-xs text-muted-foreground font-mono">
                                {format(new Date(event.timestamp), 'MMM dd, yyyy • HH:mm:ss')}
                              </span>
                            </div>
                            <p className="text-sm font-medium">
                              {event.type === 'connected' && 'Connected to backend server'}
                              {event.type === 'disconnected' && 'Disconnected from backend'}
                              {event.type === 'error' && 'Connection error occurred'}
                              {event.type === 'reconnect-attempt' && 'Attempting to reconnect'}
                            </p>
                          </div>
                        </div>

                        {event.message && (
                          <p className="text-xs text-muted-foreground">{event.message}</p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {event.backendUrl}
                          </Badge>

                          {event.metadata?.serverVersion && (
                            <Badge variant="outline" className="text-[10px]">
                              v{event.metadata.serverVersion}
                            </Badge>
                          )}

                          {event.metadata?.uptime !== undefined && (
                            <Badge variant="outline" className="text-[10px]">
                              Uptime: {Math.floor(event.metadata.uptime)}s
                            </Badge>
                          )}

                          {event.metadata?.twitchConnected && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
                              Twitch
                            </Badge>
                          )}

                          {event.metadata?.youtubeConnected && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                              YouTube
                            </Badge>
                          )}

                          {event.metadata?.attemptNumber && (
                            <Badge variant="outline" className="text-[10px]">
                              Attempt #{event.metadata.attemptNumber}
                            </Badge>
                          )}
                        </div>

                        {event.metadata?.errorDetails && (
                          <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/30">
                            <p className="text-xs font-mono text-destructive leading-relaxed">
                              {event.metadata.errorDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
                              {event.metadata.errorDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { format } from 'date-fns';
import { 
  Download, 
  Trash, 
  ClockCounterClockwise, 
  CheckCircle, 
  XCircle, 
  Warning, 
  ArrowClockwise 
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
  };
}

interface ConnectionHistoryLogProps {
  maxEvents?: number;
}

export function ConnectionHistoryLog({ maxEvents = 100 }: ConnectionHistoryLogProps) {
  const [connectionHistory, setConnectionHistory] = useKV<ConnectionEvent[]>('connection-history', []);
  const [isClearing, setIsClearing] = useState(false);

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
        return null;
    }
  };

  const getEventBadge = (type: ConnectionEvent['type']) => {
    const badges = {
      connected: <Badge className="bg-accent/20 text-accent border-accent/30">Connected</Badge>,
      disconnected: <Badge variant="outline">Disconnected</Badge>,
      error: <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>,
      'reconnect-attempt': <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Reconnecting</Badge>,
    };
    return badges[type];
  };

  const handleClearHistory = () => {
    setIsClearing(true);
    setTimeout(() => setIsClearing(false), 500);
    setConnectionHistory(() => []);
  };

  const handleDownloadHistory = () => {
    const data = JSON.stringify(sortedHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `connection-history-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSessionStats = (events: ConnectionEvent[]) => {
    const totalConnections = events.filter(e => e.type === 'connected').length;
    const totalDisconnections = events.filter(e => e.type === 'disconnected').length;
    const totalErrors = events.filter(e => e.type === 'error').length;
    const reconnectAttempts = events.filter(e => e.type === 'reconnect-attempt').length;

    let totalUptime = 0;
    let currentConnectTime: number | null = null;
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sortedEvents.forEach(event => {
      if (event.type === 'connected') {
        currentConnectTime = new Date(event.timestamp).getTime();
      } else if ((event.type === 'disconnected' || event.type === 'error') && currentConnectTime) {
        const disconnectTime = new Date(event.timestamp).getTime();
        totalUptime += disconnectTime - currentConnectTime;
        currentConnectTime = null;
      }
    });

    if (currentConnectTime) {
      totalUptime += Date.now() - currentConnectTime;
    }

    const totalUptimeMinutes = Math.floor(totalUptime / 1000 / 60);
    
    return {
      totalConnections,
      totalDisconnections,
      totalErrors,
      reconnectAttempts,
      totalUptimeMinutes,
    };
  };

  const stats = getSessionStats(sortedHistory);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/30">
              <ClockCounterClockwise size={24} weight="bold" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Connection History</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track all backend connection events and uptime
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadHistory}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={sortedHistory.length === 0}
            >
              <Download size={16} weight="bold" />
              Export
            </Button>
            <Button
              onClick={handleClearHistory}
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10"
              disabled={isClearing || sortedHistory.length === 0}
            >
              <Trash size={16} weight="bold" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-xs text-muted-foreground mb-1">Connections</p>
            <p className="text-2xl font-bold text-accent">{stats.totalConnections}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Disconnections</p>
            <p className="text-2xl font-bold">{stats.totalDisconnections}</p>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-xs text-muted-foreground mb-1">Errors</p>
            <p className="text-2xl font-bold text-destructive">{stats.totalErrors}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-xs text-muted-foreground mb-1">Reconnects</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.reconnectAttempts}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Total Uptime</p>
            <p className="text-2xl font-bold text-primary">{stats.totalUptimeMinutes}m</p>
          </div>
        </div>

        {sortedHistory.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-lg">
            <ClockCounterClockwise size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No connection events yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect to the backend to start tracking connection history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Event Timeline</h4>
              <Badge variant="outline" className="text-xs">
                {sortedHistory.length} event{sortedHistory.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {sortedHistory.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getEventIcon(event.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getEventBadge(event.type)}
                              <span className="text-xs text-muted-foreground font-mono">
                                {format(new Date(event.timestamp), 'MMM dd, yyyy • HH:mm:ss')}
                              </span>
                            </div>
                            <p className="text-sm font-medium">
                              {event.type === 'connected' && 'Connected to backend server'}
                              {event.type === 'disconnected' && 'Disconnected from backend'}
                              {event.type === 'error' && 'Connection error occurred'}
                              {event.type === 'reconnect-attempt' && 'Attempting to reconnect'}
                            </p>
                          </div>
                        </div>

                        {event.message && (
                          <p className="text-xs text-muted-foreground">{event.message}</p>
                        )}

                        <div className="flex flex-wrap gap-2 text-xs">
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {event.backendUrl}
                          </Badge>

                          {event.metadata?.serverVersion && (
                            <Badge variant="outline" className="text-[10px]">
                              v{event.metadata.serverVersion}
                            </Badge>
                          )}

                          {event.metadata?.uptime !== undefined && (
                            <Badge variant="outline" className="text-[10px]">
                              Uptime: {Math.floor(event.metadata.uptime)}s
                            </Badge>
                          )}

                          {event.metadata?.twitchConnected && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
                              Twitch
                            </Badge>
                          )}

                          {event.metadata?.youtubeConnected && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                              YouTube
                            </Badge>
                          )}

                          {event.metadata?.attemptNumber && (
                            <Badge variant="outline" className="text-[10px]">
                              Attempt #{event.metadata.attemptNumber}
                            </Badge>
                          )}
                        </div>

                        {event.metadata?.errorDetails && (
                          <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/30">
                            <p className="text-xs font-mono text-destructive leading-relaxed">
                              {event.metadata.errorDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
