import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';

export function useGetAvailability() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['availability'],
    queryFn: async () => {
      if (!actor) return true;
      return actor.getAvailability();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCoachingTopics() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['coaching-topics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCoachingTopics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['session-history', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const result = await actor.getSessionHistory(identity.getPrincipal());
      if ('Sessions' in result) {
        return result.Sessions;
      }
      return [];
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetGoals(topic: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['goals', identity?.getPrincipal().toString(), topic],
    queryFn: async () => {
      if (!actor || !identity) return [];
      try {
        return await actor.getGoals(identity.getPrincipal(), topic);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity && !!topic,
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topic: string) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.startSession(topic);
      if ('Error' in result) {
        throw new Error(result.Error);
      }
      return result.Success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-history'] });
      toast.success('Coaching session started!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to start session: ${error.message}`);
    },
  });
}

export function useAddSessionToHistory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addSessionToHistory(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-history'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save session: ${error.message}`);
    },
  });
}

export function useAddGoals() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topic, goals }: { topic: string; goals: string[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addGoals(topic, goals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goals added successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add goals: ${error.message}`);
    },
  });
}

export function useRemoveGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topic, goal }: { topic: string; goal: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.removeGoal(topic, goal);
      if ('Failure' in result) {
        throw new Error(result.Failure);
      }
      return result.Success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal removed!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove goal: ${error.message}`);
    },
  });
}

export function useSetGoals() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ topic, goals }: { topic: string; goals: string[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setGoals(topic, goals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goals updated!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update goals: ${error.message}`);
    },
  });
}
