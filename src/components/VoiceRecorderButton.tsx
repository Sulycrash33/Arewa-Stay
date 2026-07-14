'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoiceRecorderButton({
  conversationId,
  senderId,
  onSent,
}: {
  conversationId: string;
  senderId: string;
  onSent: () => void;
}) {
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast({ title: 'Microphone access denied', description: 'Enable microphone permission to send a voice note.', variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (timerRef.current) clearInterval(timerRef.current);

    recorder.onstop = async () => {
      recorder.stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const duration = seconds;
      setRecording(false);

      if (duration < 1) return; // discard accidental taps

      setUploading(true);
      const supabase = createClient();
      const messageId = crypto.randomUUID();
      const path = `${conversationId}/${messageId}.webm`;

      const { error: uploadError } = await supabase.storage.from('voice-notes').upload(path, blob, {
        contentType: 'audio/webm',
      });

      if (uploadError) {
        toast({ title: 'Could not send voice note', description: uploadError.message, variant: 'destructive' });
        setUploading(false);
        return;
      }

      const { error: insertError } = await supabase.from('messages').insert({
        id: messageId,
        conversation_id: conversationId,
        sender_id: senderId,
        audio_url: path,
        duration_sec: duration,
      });

      setUploading(false);
      if (insertError) {
        toast({ title: 'Could not send voice note', description: insertError.message, variant: 'destructive' });
        return;
      }
      onSent();
    };
    recorder.stop();
  };

  if (uploading) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary-container/60 flex items-center justify-center">
        <Loader2 className="h-4 w-4 text-on-primary animate-spin" />
      </div>
    );
  }

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors',
        recording ? 'bg-destructive text-white animate-pulse' : 'bg-surface-container-low text-m3-primary hover:bg-surface-container-lowest'
      )}
      aria-label={recording ? 'Stop recording' : 'Record a voice note'}
    >
      {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      {recording && <span className="sr-only">{seconds}s</span>}
    </button>
  );
}
