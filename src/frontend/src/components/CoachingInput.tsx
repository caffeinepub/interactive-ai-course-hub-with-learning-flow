import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Mic } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { Card } from './ui/card';

interface CoachingInputProps {
  onSendMessage: (message: string) => void;
  onSendVoice?: (audioUrl: string) => void;
  disabled?: boolean;
}

export function CoachingInput({ onSendMessage, onSendVoice, disabled }: CoachingInputProps) {
  const [message, setMessage] = useState('');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceComplete = (audioUrl: string) => {
    if (onSendVoice) {
      onSendVoice(audioUrl);
    }
    setShowVoiceRecorder(false);
  };

  if (showVoiceRecorder) {
    return (
      <div className="space-y-2">
        <VoiceRecorder onRecordingComplete={handleVoiceComplete} />
        <Button
          variant="outline"
          onClick={() => setShowVoiceRecorder(false)}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowVoiceRecorder(true)}
          disabled={disabled}
          className="shrink-0"
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
