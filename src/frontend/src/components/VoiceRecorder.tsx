import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { Card } from './ui/card';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioUrl: string) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const {
    recordingState,
    audioUrl,
    recordingDuration,
    error,
    startRecording,
    stopRecording,
    playAudio,
    stopAudio,
    clearRecording,
    isRecording,
    isPlaying,
  } = useVoiceRecording();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopRecording = () => {
    stopRecording();
    if (audioUrl && onRecordingComplete) {
      onRecordingComplete(audioUrl);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {!audioUrl ? (
          <>
            <Button
              size="lg"
              variant={isRecording ? 'destructive' : 'default'}
              onClick={isRecording ? handleStopRecording : startRecording}
              className={`rounded-full h-14 w-14 ${isRecording ? 'animate-pulse-ring' : ''}`}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            <div className="flex-1">
              {isRecording ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Recording...</p>
                  <p className="text-xs text-muted-foreground">{formatDuration(recordingDuration)}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {error || 'Click to start recording'}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={isPlaying ? stopAudio : playAudio}
              className="rounded-full h-14 w-14"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isPlaying ? 'Playing...' : 'Recording ready'}
              </p>
              <p className="text-xs text-muted-foreground">{formatDuration(recordingDuration)}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={clearRecording}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
