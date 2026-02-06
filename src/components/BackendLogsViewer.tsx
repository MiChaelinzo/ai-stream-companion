import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { backendService } from '@/lib/backend-service';
import { 
  Terminal, 
  Trash, 
  Download, 
  Pause, 
  Play, 
  Copy,
  Check,
  Info,
  Warning,
  X as XIcon,
  Lightning
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error' | 'debug';
  message: string;
  category?: string;
}

interface BackendLogsViewerProps {
  isConnected: boolean;
}

export function BackendLogsViewer({ isConnected }: BackendLogsViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLog = (payload: any) => {
      if (isPaused) return;

      const newLog: LogEntry = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        level: payload.level || 'info',
        message: payload.message || JSON.stringify(payload),
        category: payload.category || 'general'
      };

      setLogs(prev => [...prev, newLog].slice(-500));
    };

    const handleChatMessage = (payload: any) => {
      handleLog({
        level: 'info',
        message: `💬 Chat from ${payload.username}: ${payload.message}`,
        category: 'chat'
      });
    };

    const handleAIResponse = (payload: any) => {
      handleLog({
        level: 'success',
        message: `🤖 AI Response: ${payload.message || payload.response || payload}`,
        category: 'ai'
      });
    };

    const handleError = (payload: any) => {
      handleLog({
        level: 'error',
        message: `❌ Error: ${payload.message || payload.error || payload}`,
        category: 'error'
      });
    };

    const handleConnected = () => {
      handleLog({
        level: 'success',
        message: '✅ WebSocket connected to backend server',
        category: 'connection'
      });
    };

    const handleDisconnected = () => {
      handleLog({
        level: 'warning',
        message: '⚠️ WebSocket disconnected from backend server',
        category: 'connection'
      });
    };

    const handleAllMessages = (message: any) => {
      if (message.type === 'log') {
        handleLog(message.payload);
      } else if (message.type === 'status') {
        handleLog({
          level: 'info',
          message: `📊 Status update: ${JSON.stringify(message.payload)}`,
          category: 'system'
        });
      } else if (message.type === 'twitch_connected') {
        handleLog({
          level: 'success',
          message: `✅ Twitch connected: ${message.payload?.channel || 'unknown'}`,
          category: 'connection'
        });
      } else if (message.type === 'youtube_connected') {
        handleLog({
          level: 'success',
          message: `✅ YouTube connected`,
          category: 'connection'
        });
      }
    };

    backendService.on('log', handleLog);
    backendService.on('chatMessage', handleChatMessage);
    backendService.on('aiResponse', handleAIResponse);
    backendService.on('error', handleError);
    backendService.on('connected', handleConnected);
    backendService.on('*', handleAllMessages);

    if (isConnected) {
      handleLog({
        level: 'success',
        message: '🚀 Backend logs viewer initialized',
        category: 'system'
      });
    }

    return () => {
      backendService.off('log', handleLog);
      backendService.off('chatMessage', handleChatMessage);
      backendService.off('aiResponse', handleAIResponse);
      backendService.off('error', handleError);
      backendService.off('connected', handleConnected);
      backendService.off('*', handleAllMessages);
    };
  }, [isPaused, isConnected]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const clearLogs = () => {
    setLogs([]);
    toast.success('Logs cleared');
  };

  const downloadLogs = () => {
    const logsText = logs
      .map(log => `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backend-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Logs downloaded');
  };

  const copyLog = (log: LogEntry) => {
    const logText = `[${log.timestamp.toLocaleTimeString()}] [${log.level.toUpperCase()}] ${log.message}`;
    navigator.clipboard.writeText(logText);
    setCopiedId(log.id);
    toast.success('Log copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllLogs = () => {
    const logsText = filteredLogs
      .map(log => `[${log.timestamp.toLocaleTimeString()}] [${log.level.toUpperCase()}] ${log.message}`)
      .join('\n');
    navigator.clipboard.writeText(logsText);
    toast.success('All logs copied to clipboard');
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <Check size={14} weight="bold" className="text-accent" />;
      case 'error':
        return <XIcon size={14} weight="bold" className="text-destructive" />;
      case 'warning':
        return <Warning size={14} weight="bold" className="text-yellow-500" />;
      case 'debug':
        return <Terminal size={14} className="text-muted-foreground" />;
      default:
        return <Info size={14} className="text-primary" />;
    }
  };

  const getLogColorClass = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-accent bg-accent/5 border-l-accent';
      case 'error':
        return 'text-destructive bg-destructive/5 border-l-destructive';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/5 border-l-yellow-500';
      case 'debug':
        return 'text-muted-foreground bg-muted/30 border-l-muted-foreground';
      default:
        return 'text-foreground bg-card/50 border-l-primary';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!showDebug && log.level === 'debug') return false;
    if (filterLevel !== 'all' && log.level !== filterLevel) return false;
    return true;
  });

  const logStats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    debug: logs.filter(l => l.level === 'debug').length,
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <Terminal size={24} weight="bold" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Backend Logs Viewer</CardTitle>
              <CardDescription>Real-time logs from your backend server</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {filteredLogs.length} / {logs.length} logs
            </Badge>
            {isConnected ? (
              <Badge className="bg-accent/20 text-accent border-accent/30">
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
                Live
              </Badge>
            ) : (
              <Badge className="bg-muted text-muted-foreground border-border">
                Disconnected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <button
            onClick={() => setFilterLevel('all')}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              filterLevel === 'all'
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-card border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            All ({logStats.total})
          </button>
          <button
            onClick={() => setFilterLevel('info')}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              filterLevel === 'info'
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-card border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Info ({logStats.info})
          </button>
          <button
            onClick={() => setFilterLevel('success')}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              filterLevel === 'success'
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-card border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Success ({logStats.success})
          </button>
          <button
            onClick={() => setFilterLevel('warning')}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              filterLevel === 'warning'
                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                : 'bg-card border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Warnings ({logStats.warning})
          </button>
          <button
            onClick={() => setFilterLevel('error')}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              filterLevel === 'error'
                ? 'bg-destructive/20 border-destructive text-destructive'
                : 'bg-card border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Errors ({logStats.error})
          </button>
          <button
            onClick={() => setFilterLevel('debug')}
            className={`p-2 rounded-lg border text-xs font-medium transition-all ${
              filterLevel === 'debug'
                ? 'bg-muted border-muted-foreground text-foreground'
                : 'bg-card border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Debug ({logStats.debug})
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-scroll"
                checked={autoScroll}
                onCheckedChange={setAutoScroll}
              />
              <Label htmlFor="auto-scroll" className="text-xs cursor-pointer">
                Auto-scroll
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="show-debug"
                checked={showDebug}
                onCheckedChange={setShowDebug}
              />
              <Label htmlFor="show-debug" className="text-xs cursor-pointer">
                Show debug
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="gap-2"
            >
              {isPaused ? (
                <>
                  <Play size={14} weight="bold" />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={14} weight="bold" />
                  Pause
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllLogs}
              className="gap-2"
              disabled={filteredLogs.length === 0}
            >
              <Copy size={14} weight="bold" />
              Copy All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadLogs}
              className="gap-2"
              disabled={logs.length === 0}
            >
              <Download size={14} weight="bold" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              className="gap-2"
              disabled={logs.length === 0}
            >
              <Trash size={14} weight="bold" />
              Clear
            </Button>
          </div>
        </div>

        {!isConnected && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-500">
            <div className="flex items-center gap-2 mb-2">
              <Warning size={16} weight="bold" />
              <span className="font-semibold">Not connected to backend</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Connect to the backend server to see real-time logs. Switch to the Connection tab and click "Connect to Backend".
            </p>
          </div>
        )}

        {isPaused && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
            <div className="flex items-center gap-2">
              <Pause size={14} weight="bold" />
              <span className="font-semibold">Logging paused</span>
              <span className="text-muted-foreground">- New logs are not being recorded</span>
            </div>
          </div>
        )}

        <div className="relative">
          <ScrollArea className="h-[500px] rounded-lg border border-border bg-background/50">
            <div ref={scrollRef} className="p-4 space-y-2 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[450px] text-muted-foreground">
                  <Terminal size={48} weight="thin" className="mb-4 opacity-50" />
                  <p className="text-sm">No logs to display</p>
                  <p className="text-xs mt-2">
                    {isConnected
                      ? 'Waiting for backend activity...'
                      : 'Connect to backend to see logs'}
                  </p>
                </div>
              ) : (
                <>
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded border-l-4 transition-all hover:bg-muted/30 group ${getLogColorClass(
                        log.level
                      )}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div className="mt-0.5 flex-shrink-0">{getLogIcon(log.level)}</div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {log.timestamp.toLocaleTimeString()}
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                                {log.level}
                              </Badge>
                              {log.category && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                                  {log.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed break-words">{log.message}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyLog(log)}
                          className="flex-shrink-0 p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy log"
                        >
                          {copiedId === log.id ? (
                            <Check size={12} weight="bold" className="text-accent" />
                          ) : (
                            <Copy size={12} weight="bold" className="text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {logs.length > 0 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Total: {logStats.total} logs</span>
              <span className="text-accent">✓ {logStats.success}</span>
              <span className="text-destructive">✗ {logStats.error}</span>
              <span className="text-yellow-500">⚠ {logStats.warning}</span>
            </div>
            <span>Showing {filteredLogs.length} logs</span>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Lightning size={14} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Log Categories:</p>
              <p>
                <strong>chat</strong> - Chat messages from Twitch/YouTube •{' '}
                <strong>ai</strong> - AI responses •{' '}
                <strong>connection</strong> - Connection events •{' '}
                <strong>error</strong> - Errors and warnings •{' '}
                <strong>system</strong> - System events
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
