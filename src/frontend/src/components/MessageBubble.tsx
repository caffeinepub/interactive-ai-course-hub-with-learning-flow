import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';

interface MessageBubbleProps {
  content: string;
  isCoach: boolean;
  timestamp?: string;
}

export function MessageBubble({ content, isCoach, timestamp }: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 animate-slide-up ${isCoach ? '' : 'flex-row-reverse'}`}>
      <Avatar className="h-8 w-8">
        {isCoach ? (
          <>
            <AvatarImage src="/assets/generated/coach-avatar.dim_200x200.png" alt="Coach" />
            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-accent text-accent-foreground">You</AvatarFallback>
        )}
      </Avatar>
      <div className={`flex-1 space-y-1 ${isCoach ? '' : 'flex flex-col items-end'}`}>
        <Card className={`inline-block max-w-[80%] ${isCoach ? 'bg-card' : 'bg-primary text-primary-foreground'}`}>
          <div className="px-4 py-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
        </Card>
        {timestamp && (
          <p className="text-xs text-muted-foreground px-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
}
