import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info, Lightning } from "@phosphor-icons/react";

interface SystemStatusCardProps {
  hasConnections: boolean;
  isSimulating: boolean;
}

export function SystemStatusCard({ hasConnections, isSimulating }: SystemStatusCardProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightning size={20} weight="fill" className="text-primary" />
            System Status
          </CardTitle>
          <Badge variant="outline" className="bg-accent/10 border-accent/30">
            Frontend Only
          </Badge>
        </div>
        <CardDescription>Current capabilities and limitations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-500" />
              <span className="text-sm font-medium">AI Response Generation</span>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-500" />
              <span className="text-sm font-medium">Chat Simulation</span>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
              {isSimulating ? 'Running' : 'Available'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-500" />
              <span className="text-sm font-medium">Sentiment Analysis</span>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-500" />
              <span className="text-sm font-medium">VTuber Avatar</span>
            </div>
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 text-xs">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <XCircle size={20} weight="fill" className="text-yellow-500" />
              <span className="text-sm font-medium">Real-Time Twitch/YouTube Chat</span>
            </div>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 text-xs">
              Requires Backend
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-blue-500" />
              <span className="text-sm font-medium">Platform Credentials</span>
            </div>
            <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 text-xs">
              {hasConnections ? 'Saved' : 'Not Set'}
            </Badge>
          </div>
        </div>

        <Alert className="bg-accent/10 border-accent/30">
          <Info size={16} className="text-accent" />
          <AlertDescription className="text-xs">
            <strong>What works now:</strong> Full AI personality configuration, response generation, chat simulation, sentiment analysis, and VTuber avatar with lip-sync. <strong>What needs backend:</strong> Persistent WebSocket connections to Twitch IRC / YouTube Live Chat APIs for real-time monitoring.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
