import { createClient } from '@/lib/supabase/server';
import VerificationActions from '@/components/admin/VerificationActions';
import AssignLiaison from '@/components/admin/AssignLiaison';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  approved: 'bg-primary-container/10 text-primary-container',
  pending: 'bg-ochre-gold/10 text-ochre-gold',
  revoked: 'bg-destructive/10 text-destructive',
};

export default async function AdminVerificationsPage() {
  const supabase = await createClient();
  const { data: verifications } = await supabase
    .from('host_verifications')
    .select(`
      id, status, notes, liaison_name, liaison_contact, liaison_id, created_at, user_id,
      user:profiles!host_verifications_user_id_fkey ( full_name, phone, host_tier )
    `)
    .order('created_at', { ascending: true });

  const { data: liaisons } = await supabase.from('liaisons').select('id, full_name, phone').eq('active', true);

  const pending = (verifications ?? []).filter((v: { status?: string }) => v.status === 'pending');
  const others = (verifications ?? []).filter((v: { status?: string }) => v.status !== 'pending');

  const renderRow = (v: any) => (
    <div key={v.id} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md flex flex-col sm:flex-row sm:items-center gap-stack-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary-container" />
          <h3 className="font-title-md text-sm text-on-surface">{v.user?.full_name ?? 'Unknown host'}</h3>
          <span className={cn('text-xs capitalize px-2 py-0.5 rounded-full', STATUS_STYLE[v.status])}>{v.status}</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">{v.notes}</p>
        <p className="text-xs text-on-surface-variant">{v.user?.phone ?? 'No phone on file'} &middot; Current tier: {v.user?.host_tier}</p>
        {v.liaison_name && <p className="text-xs text-primary-container mt-1">Liaison: {v.liaison_name} ({v.liaison_contact})</p>}
        {v.status === 'pending' && (liaisons ?? []).length > 0 && (
          <div className="mt-2 w-56">
            <AssignLiaison verificationId={v.id} liaisons={liaisons!} currentLiaisonId={v.liaison_id} />
          </div>
        )}
      </div>
      {v.status === 'pending' && (
        <div className="sm:w-56">
          <VerificationActions verificationId={v.id} userId={v.user_id} />
        </div>
      )}
    </div>
  );

  return (
    <main className="p-container-margin">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Host Verifications</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">{pending.length} awaiting review</p>

      <div className="space-y-stack-sm">
        {pending.map(renderRow)}
      </div>

      {others.length > 0 && (
        <>
          <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm mt-stack-lg">Reviewed</h2>
          <div className="space-y-stack-sm">{others.map(renderRow)}</div>
        </>
      )}

      {(verifications ?? []).length === 0 && (
        <p className="text-center font-body-lg text-on-surface-variant py-stack-lg">No verification submissions yet.</p>
      )}
    </main>
  );
}
