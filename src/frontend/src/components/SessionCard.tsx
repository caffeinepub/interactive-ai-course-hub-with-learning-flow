import { Card, CardContent } from './ui/card';
import { MessageCircle } from 'lucide-react';

interface SessionCardProps {
  session: string;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{session}</p>
            <p className="text-xs text-muted-foreground">Coaching session</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
