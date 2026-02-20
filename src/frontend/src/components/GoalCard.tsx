import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Target, Trash2 } from 'lucide-react';
import { useRemoveGoal } from '../hooks/useQueries';

interface GoalCardProps {
  topic: string;
  goal: string;
  progress?: number;
}

export function GoalCard({ topic, goal, progress = 0 }: GoalCardProps) {
  const { mutate: removeGoal, isPending } = useRemoveGoal();

  const handleRemove = () => {
    removeGoal({ topic, goal });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <Target className="h-5 w-5 text-accent mt-0.5" />
            <CardTitle className="text-base font-medium">{goal}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={isPending}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">{progress}% complete</p>
      </CardContent>
    </Card>
  );
}
