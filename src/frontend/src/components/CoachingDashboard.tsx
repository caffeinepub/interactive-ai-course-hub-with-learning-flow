import { useGetCoachingTopics, useGetSessionHistory, useStartSession } from '../hooks/useQueries';
import { SessionCard } from './SessionCard';
import { QuickStartCard } from './QuickStartCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { MessageCircle, Target, Zap, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function CoachingDashboard() {
  const { data: topics, isLoading: topicsLoading } = useGetCoachingTopics();
  const { data: sessions, isLoading: sessionsLoading } = useGetSessionHistory();
  const { mutate: startSession, isPending } = useStartSession();
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const handleStartCoaching = () => {
    if (!identity || !topics || topics.length === 0) {
      return;
    }
    
    // Start with the first available topic
    const firstTopic = topics[0];
    startSession(firstTopic, {
      onSuccess: () => {
        navigate({ to: '/session/$topic', params: { topic: firstTopic } });
      },
    });
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Hero CTA Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20">
        <div className="relative px-8 py-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Your Coaching Session?
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your AI coach is available 24/7 to help you achieve your goals
            </p>
          </div>
          <Button
            onClick={handleStartCoaching}
            disabled={isPending || !identity || topicsLoading || !topics || topics.length === 0}
            size="lg"
            className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting Session...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Coaching Session
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Quick Start</h2>
        </div>
        <p className="text-muted-foreground">Choose a specific coaching topic to begin your session</p>
        
        {topicsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : topics && topics.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <QuickStartCard key={topic} topic={topic} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No coaching topics available yet.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent Sessions Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Recent Sessions</h2>
        </div>
        
        {sessionsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session, index) => (
              <SessionCard key={index} session={session} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No sessions yet. Start your first coaching session above!</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
