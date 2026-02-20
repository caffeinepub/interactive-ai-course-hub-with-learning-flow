import { CoachingDashboard } from '../components/CoachingDashboard';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MessageCircle, Mic, Target } from 'lucide-react';

export function HomePage() {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <MessageCircle className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your 24/7 AI Coach
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized coaching anytime, anywhere. Voice-enabled sessions with AI guidance tailored to your goals.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>24/7 Available</CardTitle>
                <CardDescription>
                  Your coach is always ready when you need guidance
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Mic className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Voice Enabled</CardTitle>
                <CardDescription>
                  Natural voice conversations for a personal coaching experience
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-success mb-2" />
                <CardTitle>Goal Tracking</CardTitle>
                <CardDescription>
                  Set and track your progress toward meaningful goals
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Login to start your coaching journey
                </p>
                <Button
                  onClick={login}
                  disabled={loginStatus === 'logging-in'}
                  size="lg"
                  className="w-full"
                >
                  {loginStatus === 'logging-in' ? 'Logging in...' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return <CoachingDashboard />;
}
