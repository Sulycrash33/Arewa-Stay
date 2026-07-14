import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MessageSquare } from 'lucide-react';

export default async function MessagesListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id, created_at,
      guest_id, host_id,
      guest:profiles!conversations_guest_id_fkey ( id, full_name, avatar_url ),
      host:profiles!conversations_host_id_fkey ( id, full_name, avatar_url ),
      listing:listings ( id, title ),
      messages ( id, text, audio_url, sender_id, created_at, read_at )
    `)
    .or(`guest_id.eq.${user.id},host_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  const rows = (conversations ?? []).map((c: any) => {
    const isGuest = c.guest_id === user.id;
    const otherParty = isGuest ? c.host : c.guest;
    const sortedMessages = [...(c.messages ?? [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastMessage = sortedMessages[0];
    const hasUnread = (c.messages ?? []).some((m: any) => m.sender_id !== user.id && !m.read_at);
    return { ...c, otherParty, lastMessage, hasUnread };
  });

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-stack-lg">Messages</h1>

      {rows.length === 0 ? (
        <div className="text-center py-stack-lg">
          <MessageSquare className="h-10 w-10 text-on-surface-variant mx-auto mb-stack-sm" />
          <p className="font-body-lg text-on-surface-variant">No conversations yet. Message a host from any listing to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/messages/${c.id}`}
              className="flex items-center gap-3 p-3 rounded-tubali bg-surface-container-lowest tubali-border hover:shadow-tubali transition-shadow"
            >
              <div className="w-11 h-11 rounded-full bg-primary-container/20 flex items-center justify-center font-title-md text-m3-primary shrink-0">
                {c.otherParty?.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-md text-sm text-on-surface truncate">{c.otherParty?.full_name ?? 'Unknown'}</h3>
                  {c.hasUnread && <span className="w-2 h-2 rounded-full bg-ochre-gold shrink-0" />}
                </div>
                <p className="text-xs text-on-surface-variant truncate">{c.listing?.title}</p>
                <p className="text-sm text-on-surface-variant truncate">
                  {c.lastMessage ? (c.lastMessage.audio_url ? '🎤 Voice message' : c.lastMessage.text) : 'No messages yet'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
