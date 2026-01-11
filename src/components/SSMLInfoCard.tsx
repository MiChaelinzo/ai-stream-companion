import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle, Lightning } from "@phosphor-icons/react";

export function SSMLInfoCard() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={24} weight="bold" className="text-primary" />
          About SSML Support
        </CardTitle>
        <CardDescription>
          Speech Synthesis Markup Language for advanced voice control
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle size={20} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Natural Pauses</div>
              <div className="text-sm text-muted-foreground">
                Add breaks between sentences for more natural-sounding speech, perfect for emphasizing important moments
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Emotional Expression</div>
              <div className="text-sm text-muted-foreground">
                Vary pitch and rate to convey excitement, surprise, or seriousness during gameplay commentary
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle size={20} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Emphasis Control</div>
              <div className="text-sm text-muted-foreground">
                Highlight important words and phrases to make your AI companion more engaging and dynamic
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lightning size={20} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">AI-Powered Enhancement</div>
              <div className="text-sm text-muted-foreground">
                Gemini 3 can automatically add SSML tags to responses based on sentiment and context
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t space-y-2">
          <div className="text-sm font-semibold">Use Cases for Streaming:</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">Gameplay Commentary</Badge>
            <Badge variant="outline" className="text-xs">Chat Interaction</Badge>
            <Badge variant="outline" className="text-xs">Poll Announcements</Badge>
            <Badge variant="outline" className="text-xs">Highlight Reactions</Badge>
            <Badge variant="outline" className="text-xs">Welcome Messages</Badge>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            💡 <strong>Pro Tip:</strong> Combine SSML with gameplay vision analysis to create dynamic, 
            context-aware commentary that reacts to in-game events with appropriate timing and emotion.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
