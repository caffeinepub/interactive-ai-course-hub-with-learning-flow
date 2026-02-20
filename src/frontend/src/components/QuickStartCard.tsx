import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useStartSession } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface QuickStartCardProps {
  topic: string;
}

export function QuickStartCard({ topic }: QuickStartCardProps) {
  const navigate = useNavigate();
  const { mutate: startSession, isPending } = useStartSession();
  const { identity } = useInternetIdentity();

  const handleStart = () => {
    if (!identity) {
      return;
    }
    
    startSession(topic, {
      onSuccess: () => {
        navigate({ to: '/session/$topic', params: { topic } });
      },
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          {topic}
        </CardTitle>
        <CardDescription>Start a coaching session on this topic</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleStart} 
          disabled={isPending || !identity}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            'Start Session'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
