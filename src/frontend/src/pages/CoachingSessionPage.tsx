import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { MessageBubble } from '../components/MessageBubble';
import { CoachingInput } from '../components/CoachingInput';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Target, Plus } from 'lucide-react';
import { useAddSessionToHistory, useGetGoals, useAddGoals } from '../hooks/useQueries';
import { GoalCard } from '../components/GoalCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface Message {
  content: string;
  isCoach: boolean;
  timestamp: string;
}

export function CoachingSessionPage() {
  const { topic } = useParams({ from: '/session/$topic' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: addSessionToHistory } = useAddSessionToHistory();
  const { data: goals } = useGetGoals(topic);
  const { mutate: addGoals, isPending: isAddingGoal } = useAddGoals();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/' });
      return;
    }

    // Initial coach greeting
    const greeting: Message = {
      content: `Hello! I'm your AI coach. Let's work on ${topic} together. How can I help you today?`,
      isCoach: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([greeting]);
  }, [topic, identity, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      content,
      isCoach: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Save session to history
    addSessionToHistory(`${topic}: ${content.substring(0, 50)}...`);

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: Message = {
        content: `I understand you're working on ${topic}. That's a great area to focus on! Let me help you break this down into actionable steps. What specific aspect would you like to explore first?`,
        isCoach: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachResponse]);
    }, 1000);
  };

  const handleSendVoice = (audioUrl: string) => {
    const userMessage: Message = {
      content: '[Voice message recorded]',
      isCoach: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Save session to history
    addSessionToHistory(`${topic}: Voice message`);

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: Message = {
        content: `I received your voice message. Voice interaction is a great way to communicate! Let's continue our conversation about ${topic}.`,
        isCoach: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, coachResponse]);
    }, 1000);
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addGoals(
        { topic, goals: [newGoal.trim()] },
        {
          onSuccess: () => {
            setNewGoal('');
            setIsGoalDialogOpen(false);
          },
        }
      );
    }
  };

  return (
    <div className="container py-6 max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Chat Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{topic}</h1>
              <p className="text-sm text-muted-foreground">Coaching Session</p>
            </div>
          </div>

          <Card className="h-[calc(100vh-280px)]">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={index}
                    content={message.content}
                    isCoach={message.isCoach}
                    timestamp={message.timestamp}
                  />
                ))}
              </div>
            </ScrollArea>
          </Card>

          <CoachingInput
            onSendMessage={handleSendMessage}
            onSendVoice={handleSendVoice}
          />
        </div>

        {/* Goals Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  <CardTitle>Your Goals</CardTitle>
                </div>
                <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Goal</DialogTitle>
                      <DialogDescription>
                        Set a new goal for your {topic} coaching
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="goal">Goal</Label>
                        <Input
                          id="goal"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          placeholder="Enter your goal..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleAddGoal}
                        disabled={!newGoal.trim() || isAddingGoal}
                      >
                        {isAddingGoal ? 'Adding...' : 'Add Goal'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {goals && goals.length > 0 ? (
                goals.map((goal, index) => (
                  <GoalCard
                    key={index}
                    topic={topic}
                    goal={goal}
                    progress={Math.floor(Math.random() * 100)}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No goals yet. Add your first goal!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
