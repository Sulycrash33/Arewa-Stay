'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { ArrowLeft, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import VoiceRecorderButton from '@/components/VoiceRecorderButton';
import VoiceMessageBubble from '@/components/VoiceMessageBubble';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string | null;
  audio_url: string | null;
  duration_sec: number | null;
  created_at: string;
  read_at: string | null;
}

function greetingChips(): string[] {
  const hour = new Date().getHours();
  if (hour < 12) return ['Sannu da zuwa', 'Ina kwana?', 'Good morning'];
  if (hour < 17) return ['Ina yini?', 'Good afternoon', 'Madallah'];
  return ['Ina wuni?', 'Good evening', 'Inshaallah, komai zai tafi daidai'];
}

export default function ConversationThread() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const router = useRouter();
  const { profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherName, setOtherName] = useState('');
  const [listingTitle, setListingTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadThread = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth?tab=login'); return; }

    const { data: convo } = await supabase
      .from('conversations')
      .select(`
        guest_id, host_id,
        guest:profiles!conversations_guest_id_fkey ( full_name ),
        host:profiles!conversations_host_id_fkey ( full_name ),
        listing:listings ( title )
      `)
      .eq('id', conversationId)
      .single();

    if (convo) {
      const isGuest = convo.guest_id === user.id;
      setOtherName((isGuest ? (convo.host as any)?.full_name : (convo.guest as any)?.full_name) ?? 'Unknown');
      setListingTitle((convo.listing as any)?.title ?? '');
    }

    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    setMessages(msgs ?? []);
    setLoading(false);

    // Mark incoming messages as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);
  }, [conversationId, router]);

  useEffect(() => {
    loadThread();
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload: { new?: Message }) => {
          if (payload.new) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, loadThread]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const content = (overrideText ?? text).trim();
    if (!content || !profile) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: profile.id,
      text: content,
    });
    setSending(false);
    if (!error) setText('');
  };

  if (loading) return null;

  return (
    <main className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/30 bg-surface">
        <Link href="/dashboard/messages" className="text-primary-container"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="font-title-md text-sm text-on-surface">{otherName}</h1>
          <p className="text-xs text-on-surface-variant">{listingTitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((m) => {
          const isMine = m.sender_id === profile?.id;
          return (
            <div key={m.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[75%] rounded-2xl px-3 py-2 text-sm',
                isMine ? 'bg-primary-container text-on-primary rounded-br-sm' : 'bg-surface-container-low text-on-surface rounded-bl-sm'
              )}>
                {m.audio_url ? (
                  <VoiceMessageBubble audioPath={m.audio_url} durationSec={m.duration_sec} />
                ) : (
                  m.text
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Cultural courtesy tray, quick greeting chips that adapt to time of day */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2">
        {greetingChips().map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="shrink-0 text-xs font-label-sm px-3 py-1.5 rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-colors whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 p-4 border-t border-outline-variant/30 bg-surface">
        {profile && (
          <VoiceRecorderButton conversationId={conversationId} senderId={profile.id} onSent={loadThread} />
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="Type a message..."
          className="flex-1 bg-surface-container-low rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
        />
        <button
          onClick={() => handleSend()}
          disabled={sending || !text.trim()}
          className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
