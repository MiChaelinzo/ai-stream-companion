import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Rocket, 
  Clock, 
  CurrencyDollar, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  GithubLogo,
  CloudArrowUp,
  Terminal,
  Link as LinkIcon
} from "@phosphor-icons/react";

export function DeploymentGuide() {
  const platforms = [
    {
      name: "Railway",
      icon: <Rocket size={32} weight="bold" />,
      recommended: true,
      pros: [
        "$5 free credit/month",
        "No sleep mode",
        "Auto-deploy from GitHub",
        "Fast build times",
        "Built-in SSL/WebSocket"
      ],
      cons: [
        "Requires GitHub account",
        "Pay-as-you-go after free tier"
      ],
      cost: "~$2-5/month for 24/7",
      setupTime: "5 minutes",
      color: "primary",
      link: "https://railway.app",
      docsLink: "/RAILWAY_DEPLOYMENT.md"
    },
    {
      name: "Heroku",
      icon: <CloudArrowUp size={32} weight="bold" />,
      recommended: false,
      pros: [
        "Easy deployment",
        "Free tier available",
        "Great documentation",
        "Add-ons ecosystem"
      ],
      cons: [
        "Sleeps after 30 minutes (free tier)",
        "Need Basic plan for 24/7 ($7/month)",
        "Slower build times"
      ],
      cost: "$7/month for 24/7",
      setupTime: "10 minutes",
      color: "secondary",
      link: "https://heroku.com",
      docsLink: "/HEROKU_DEPLOYMENT.md"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Get API Credentials",
      description: "Collect your Twitch tokens and Gemini API key",
      links: [
        { label: "Twitch Token Generator", url: "https://twitchtokengenerator.com" },
        { label: "Gemini API Key", url: "https://aistudio.google.com/app/apikey" }
      ]
    },
    {
      number: 2,
      title: "Push Backend to GitHub",
      description: "Create a GitHub repository for your backend code",
      command: "cd backend && git init && git add . && git commit -m 'Deploy backend'"
    },
    {
      number: 3,
      title: "Deploy to Platform",
      description: "Connect your GitHub repo to Railway or Heroku",
      links: [
        { label: "Railway Dashboard", url: "https://railway.app" },
        { label: "Heroku Dashboard", url: "https://dashboard.heroku.com" }
      ]
    },
    {
      number: 4,
      title: "Configure Environment Variables",
      description: "Add your API keys and tokens in platform settings",
      variables: [
        "TWITCH_CLIENT_ID",
        "TWITCH_ACCESS_TOKEN",
        "GEMINI_API_KEY"
      ]
    },
    {
      number: 5,
      title: "Connect Frontend",
      description: "Use your deployment URL in the Backend Server tab",
      example: "wss://your-app.up.railway.app"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Deploy Backend for 24/7 Streaming</h2>
        <p className="text-muted-foreground">
          Get your AI Streamer Companion running continuously in the cloud
        </p>
      </div>

      <Alert className="bg-accent/10 border-accent/30">
        <Rocket size={20} className="text-accent" />
        <AlertDescription className="text-sm">
          <strong className="text-accent">Choose Your Platform:</strong> Railway is recommended for hobby projects with 24/7 uptime on free tier. Heroku requires paid plan for always-on service.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card 
            key={platform.name}
            className={`relative ${platform.recommended ? 'border-accent border-2' : ''}`}
          >
            {platform.recommended && (
              <Badge className="absolute -top-3 left-4 bg-accent text-accent-foreground">
                Recommended ⭐
              </Badge>
            )}
            
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-3 rounded-lg bg-${platform.color}/20`}>
                  {platform.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl">{platform.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Clock size={14} />
                    {platform.setupTime} setup
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <CurrencyDollar size={20} className="text-muted-foreground" />
                {platform.cost}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pros:</p>
                {platform.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Cons:</p>
                {platform.cons.map((con, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <XCircle size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" weight="fill" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  className="w-full gap-2" 
                  variant={platform.recommended ? "default" : "secondary"}
                  onClick={() => window.open(platform.link, '_blank')}
                >
                  Deploy to {platform.name}
                  <ArrowRight size={16} weight="bold" />
                </Button>
                <Button 
                  className="w-full gap-2" 
                  variant="outline"
                  onClick={() => window.open(platform.docsLink, '_blank')}
                >
                  View Guide
                  <LinkIcon size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal size={24} weight="bold" />
            Deployment Steps
          </CardTitle>
          <CardDescription>
            Follow these steps to deploy your backend to the cloud
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {step.number}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                
                {step.command && (
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm overflow-x-auto">
                    {step.command}
                  </div>
                )}
                
                {step.links && (
                  <div className="flex flex-wrap gap-2">
                    {step.links.map((link, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        {link.label}
                        <ArrowRight size={14} />
                      </Button>
                    ))}
                  </div>
                )}
                
                {step.variables && (
                  <div className="flex flex-wrap gap-2">
                    {step.variables.map((variable, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {step.example && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Example:</p>
                    <code className="text-sm text-accent font-mono">{step.example}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GithubLogo size={24} weight="bold" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Detailed step-by-step guides are available for both platforms:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open('/DEPLOYMENT_QUICKSTART.md', '_blank')}
            >
              Quick Start Guide
              <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open('/RAILWAY_DEPLOYMENT.md', '_blank')}
            >
              Railway Guide
              <ArrowRight size={16} />
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.open('/HEROKU_DEPLOYMENT.md', '_blank')}
            >
              Heroku Guide
              <ArrowRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
