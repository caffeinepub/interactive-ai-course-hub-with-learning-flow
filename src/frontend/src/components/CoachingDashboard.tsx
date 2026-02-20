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
    <div className="container py-8 space-y-12">
      {/* Prominent Start Button - First Element */}
      <section className="flex justify-center pt-4 pb-8">
        <Button
          onClick={handleStartCoaching}
          disabled={isPending || !identity || topicsLoading || !topics || topics.length === 0}
          size="lg"
          className="w-full max-w-md text-lg md:text-xl lg:text-2xl px-8 md:px-10 lg:px-12 py-6 md:py-7 lg:py-8 h-auto shadow-2xl hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:via-accent hover:to-primary/90 font-bold tracking-wide border-2 border-primary/30"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 animate-spin" />
              <span>Starting Session...</span>
            </>
          ) : (
            <>
              <MessageCircle className="mr-3 h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" />
              <span>Start Coaching Session</span>
            </>
          )}
        </Button>
      </section>

      {/* Hero CTA Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border border-primary/20">
        <div className="relative px-6 md:px-8 py-10 md:py-12 text-center space-y-4 md:space-y-6">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
              <Sparkles className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Your AI Coach is Ready 24/7
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Get personalized guidance and support anytime you need it
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Quick Start Topics</h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground">Choose a specific coaching topic to begin your session</p>
        
        {topicsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : topics && topics.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Recent Sessions</h2>
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
