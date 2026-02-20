import { Badge } from './ui/badge';
import { useGetAvailability } from '../hooks/useQueries';

export function AvailabilityIndicator() {
  const { data: isAvailable, isLoading } = useGetAvailability();

  if (isLoading) return null;

  return (
    <Badge variant="outline" className="gap-2 px-3 py-1">
      <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-success animate-pulse-ring' : 'bg-muted-foreground'}`} />
      <span className="text-xs font-medium">
        {isAvailable ? '24/7 Available' : 'Offline'}
      </span>
    </Badge>
  );
}
