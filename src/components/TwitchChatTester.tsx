import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { backendService } from '@/lib/backend-service';
import { 
  TestTube, 
  Info, 
  Check, 
  X, 
  Warning, 
  Lightning, 
  ChatCircle,
  Clock,
  CircleNotch,
  Play
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TestStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  message?: string;
  details?: string[];
}

interface TwitchChatTesterProps {
  isConnected: boolean;
  twitchChannel?: string;
}

export function TwitchChatTester({ isConnected, twitchChannel }: TwitchChatTesterProps) {
  const [isTestingChat, setIsTestingChat] = useState(false);
  const [testSteps, setTestSteps] = useState<TestStep[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
  const [testProgress, setTestProgress] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const handleChatMessage = (payload: any) => {
        setReceivedMessages(prev => [
          {
            id: Date.now().toString(),
            username: payload.username,
            message: payload.message,
            timestamp: new Date(),
            platform: payload.platform || 'twitch'
          },
          ...prev
        ].slice(0, 20));
        setLastMessageTime(new Date());
      };

      backendService.on('chatMessage', handleChatMessage);

      return () => {
        backendService.off('chatMessage', handleChatMessage);
      };
    }
  }, [isConnected]);

  const runQuickTest = async () => {
    if (!isConnected) {
      toast.error('Please connect to backend first');
      return;
    }

    setIsTestingChat(true);
    setTestProgress(0);

    const steps: TestStep[] = [
      { id: 'connection', title: 'Check backend connection', status: 'pending' },
      { id: 'websocket', title: 'Verify WebSocket is active', status: 'pending' },
      { id: 'twitch', title: 'Check Twitch connection', status: 'pending' },
      { id: 'health', title: 'Fetch backend health', status: 'pending' },
      { id: 'listen', title: 'Listen for messages', status: 'pending' },
    ];

    setTestSteps([...steps]);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      steps[i].status = 'running';
      setTestSteps([...steps]);
      setTestProgress(((i) / steps.length) * 100);

      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        if (step.id === 'connection') {
          if (isConnected) {
            steps[i].status = 'success';
            steps[i].message = 'Backend is connected via WebSocket';
            steps[i].details = ['✓ WebSocket connection active'];
          } else {
            steps[i].status = 'failed';
            steps[i].message = 'Not connected to backend';
            steps[i].details = ['❌ Click "Connect to Backend" on Connection tab'];
          }
        } else if (step.id === 'websocket') {
          if (backendService.isConnected()) {
            steps[i].status = 'success';
            steps[i].message = 'WebSocket is active and ready';
            steps[i].details = ['✓ Can receive real-time messages'];
          } else {
            steps[i].status = 'failed';
            steps[i].message = 'WebSocket not connected';
          }
        } else if (step.id === 'twitch') {
          try {
            const response = await fetch('http://localhost:3001/health');
            if (response.ok) {
              const data = await response.json();
              if (data.connections?.twitch) {
                steps[i].status = 'success';
                steps[i].message = `Connected to Twitch: ${data.twitch?.channel || 'unknown'}`;
                steps[i].details = [
                  `✓ Channel: ${data.twitch?.channel}`,
                  `✓ Bot: ${data.twitch?.username || 'unknown'}`
                ];
              } else {
                steps[i].status = 'failed';
                steps[i].message = 'Twitch is not connected';
                steps[i].details = [
                  '❌ Backend is running but Twitch not connected',
                  '→ Check your .env file (TWITCH_ACCESS_TOKEN, TWITCH_CHANNEL)',
                  '→ Restart backend after updating .env'
                ];
              }
            } else {
              steps[i].status = 'failed';
              steps[i].message = 'Cannot reach backend health endpoint';
            }
          } catch (error) {
            steps[i].status = 'failed';
            steps[i].message = 'Backend server not responding';
            steps[i].details = ['❌ Make sure backend is running: npm run dev'];
          }
        } else if (step.id === 'health') {
          try {
            const response = await fetch('http://localhost:3001/health');
            if (response.ok) {
              const data = await response.json();
              steps[i].status = 'success';
              steps[i].message = 'Backend health check passed';
              steps[i].details = [
                `✓ Uptime: ${Math.floor(data.uptime || 0)}s`,
                `✓ Version: ${data.version || 'unknown'}`,
                `✓ Gemini: ${data.gemini?.configured ? 'Configured' : 'Not configured'}`
              ];
            } else {
              steps[i].status = 'failed';
              steps[i].message = 'Health check failed';
            }
          } catch (error) {
            steps[i].status = 'failed';
            steps[i].message = 'Cannot fetch health data';
          }
        } else if (step.id === 'listen') {
          steps[i].status = 'success';
          steps[i].message = 'Now listening for Twitch messages';
          steps[i].details = [
            '✓ Go to your Twitch stream and send a message',
            '✓ Messages should appear below within 1-2 seconds'
          ];
          setIsListening(true);
        }
      } catch (error) {
        steps[i].status = 'failed';
        steps[i].message = 'Test step failed';
      }

      setTestSteps([...steps]);
    }

    setTestProgress(100);
    setIsTestingChat(false);

    const allPassed = steps.every(s => s.status === 'success');
    if (allPassed) {
      toast.success('All tests passed! Ready to receive chat messages.');
    } else {
      toast.error('Some tests failed. Check results below.');
    }
  };

  const sendTestInstruction = () => {
    if (!twitchChannel) {
      toast.error('Twitch channel not configured');
      return;
    }

    const instruction = `Open https://www.twitch.tv/${twitchChannel} and send: "Hello Nova!"`;
    navigator.clipboard.writeText(instruction);
    toast.success('Test instruction copied! Open Twitch and send the message.');
  };

  const getStepIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'success':
        return <Check size={18} weight="bold" className="text-accent" />;
      case 'failed':
        return <X size={18} weight="bold" className="text-destructive" />;
      case 'running':
        return <CircleNotch size={18} weight="bold" className="text-primary animate-spin" />;
      default:
        return <Clock size={18} className="text-muted-foreground" />;
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <TestTube size={24} weight="bold" className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Live Chat Testing</CardTitle>
              <CardDescription>Test your Twitch integration with real messages</CardDescription>
            </div>
          </div>
          <Badge className={isListening ? 'bg-accent/20 text-accent border-accent/30' : 'bg-muted'}>
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
                Listening
              </>
            ) : (
              'Not Listening'
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="quick-test" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-test">Quick Test</TabsTrigger>
            <TabsTrigger value="live-messages">Live Messages</TabsTrigger>
            <TabsTrigger value="guide">Step-by-Step Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-test" className="space-y-6 mt-6">
            <Alert className="bg-primary/10 border-primary/30">
              <Info size={20} className="text-primary" />
              <AlertDescription className="text-sm">
                <strong className="text-primary">Automated Test:</strong> This will verify your backend connection, Twitch integration, and readiness to receive chat messages.
              </AlertDescription>
            </Alert>

            {!isConnected && (
              <Alert className="bg-destructive/10 border-destructive/30">
                <Warning size={20} className="text-destructive" />
                <AlertDescription className="text-sm">
                  <strong className="text-destructive">Not Connected!</strong> Connect to backend first on the Connection tab.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={runQuickTest}
              disabled={isTestingChat || !isConnected}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              {isTestingChat ? (
                <>
                  <CircleNotch size={18} weight="bold" className="animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Lightning size={18} weight="bold" />
                  Run Quick Test
                </>
              )}
            </Button>

            {isTestingChat && testProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Testing...</span>
                  <span className="font-semibold">{Math.round(testProgress)}%</span>
                </div>
                <Progress value={testProgress} className="h-2" />
              </div>
            )}

            {testSteps.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Test Results</h4>
                {testSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border transition-all ${
                      step.status === 'success'
                        ? 'bg-accent/5 border-accent/30'
                        : step.status === 'failed'
                        ? 'bg-destructive/5 border-destructive/30'
                        : step.status === 'running'
                        ? 'bg-primary/5 border-primary/30'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h5 className="font-semibold text-sm">{step.title}</h5>
                          {step.message && (
                            <p className="text-xs text-muted-foreground mt-1">{step.message}</p>
                          )}
                        </div>
                        
                        {step.details && step.details.length > 0 && (
                          <div className="mt-2 space-y-1 text-xs font-mono bg-background/50 p-3 rounded border border-border/50">
                            {step.details.map((detail, idx) => (
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
            )}
          </TabsContent>

          <TabsContent value="live-messages" className="space-y-6 mt-6">
            <Alert className="bg-primary/10 border-primary/30">
              <ChatCircle size={20} className="text-primary" />
              <AlertDescription className="text-sm">
                <strong className="text-primary">Real-Time Messages:</strong> Messages from your Twitch chat will appear here as they arrive. Send a test message to verify!
              </AlertDescription>
            </Alert>

            {twitchChannel && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Send a test message</h4>
                  <Badge variant="outline" className="text-xs">
                    Channel: {twitchChannel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Open your Twitch stream and send a message in chat. It should appear below within 1-2 seconds.
                </p>
                <Button
                  onClick={sendTestInstruction}
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                >
                  <ChatCircle size={16} weight="bold" />
                  Copy Test Instructions
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Received Messages</h4>
                <Badge variant="outline" className="text-xs">
                  {receivedMessages.length} messages
                </Badge>
              </div>

              {!isListening && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Warning size={16} weight="bold" className="text-yellow-500" />
                    <span className="font-semibold text-yellow-500">Not listening yet</span>
                  </div>
                  <p className="text-muted-foreground">
                    Run the Quick Test first to start listening for messages.
                  </p>
                </div>
              )}

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 chat-scrollbar">
                {receivedMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <ChatCircle size={32} weight="thin" className="mb-2 opacity-50" />
                    <p className="text-sm">No messages received yet</p>
                    <p className="text-xs mt-1">Send a message in your Twitch chat to test</p>
                  </div>
                ) : (
                  receivedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg bg-accent/5 border border-accent/30 animate-slide-in"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {msg.platform}
                          </Badge>
                          <span className="font-semibold text-sm">{msg.username}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>

              {lastMessageTime && (
                <div className="text-xs text-muted-foreground text-center">
                  Last message: {lastMessageTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6 mt-6">
            <Alert className="bg-accent/10 border-accent/30">
              <Info size={20} className="text-accent" />
              <AlertDescription className="text-sm">
                <strong className="text-accent">Complete Testing Guide:</strong> Follow these steps to fully test your Twitch integration from start to finish.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                  Start Your Backend Server
                </h4>
                <div className="text-xs text-muted-foreground space-y-2 ml-8">
                  <p>Open a terminal and navigate to the backend folder:</p>
                  <code className="block bg-background p-2 rounded text-xs">
                    cd backend<br />
                    npm run dev
                  </code>
                  <p className="text-accent">✓ You should see: "🚀 AI Streamer Backend Server running on port 3001"</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                  Connect Frontend to Backend
                </h4>
                <div className="text-xs text-muted-foreground space-y-2 ml-8">
                  <p>In this app:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <strong>Backend Server</strong> tab → <strong>Connection</strong></li>
                    <li>Click <strong>"Connect to Backend"</strong> button</li>
                    <li>Wait for "Connected" badge to appear</li>
                  </ol>
                  <p className="text-accent">✓ You should see a green "Connected" badge</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                  Run Quick Test
                </h4>
                <div className="text-xs text-muted-foreground space-y-2 ml-8">
                  <p>On this tab:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click <strong>"Run Quick Test"</strong> button</li>
                    <li>Wait for all checks to complete</li>
                    <li>Verify all tests show green checkmarks</li>
                  </ol>
                  <p className="text-destructive">✗ If any test fails, check the Diagnostics tab for help</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                  Test with Real Twitch Message
                </h4>
                <div className="text-xs text-muted-foreground space-y-2 ml-8">
                  <p>Open your Twitch channel and send a message:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href={`https://www.twitch.tv/${twitchChannel || 'your-channel'}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.twitch.tv/{twitchChannel || 'your-channel'}</a></li>
                    <li>Send a message: <code className="bg-background px-1 rounded">"Hello Nova!"</code></li>
                    <li>Switch to <strong>Live Messages</strong> tab</li>
                    <li>Your message should appear within 1-2 seconds</li>
                  </ol>
                  <p className="text-accent">✓ Message appears = Chat integration working!</p>
                  <p className="text-accent">✓ AI may respond automatically (30% chance, 5-10 second delay)</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">5</span>
                  Monitor Live Chat Feed
                </h4>
                <div className="text-xs text-muted-foreground space-y-2 ml-8">
                  <p>Go to the <strong>Live Monitor</strong> tab to see:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>All incoming chat messages</li>
                    <li>AI responses with avatar reactions</li>
                    <li>Sentiment analysis</li>
                    <li>Real-time engagement metrics</li>
                  </ul>
                  <p className="text-accent">✓ This is where you'll see everything during streams</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/10 border-accent/30">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-accent" />
                  Success Checklist
                </h4>
                <div className="text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled checked={isConnected} />
                    <span>Backend connected (green badge)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled checked={testSteps.length > 0 && testSteps.every(s => s.status === 'success')} />
                    <span>All quick tests passed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled checked={receivedMessages.length > 0} />
                    <span>Received at least one Twitch message</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Saw AI respond in chat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" disabled />
                    <span>Avatar reacted with emotions</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
