import { createClient } from '@/lib/supabase/server';
import DisputeActions from '@/components/admin/DisputeActions';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  open: 'bg-destructive/10 text-destructive',
  investigating: 'bg-ochre-gold/10 text-ochre-gold',
  closed: 'bg-primary-container/10 text-primary-container',
};

export default async function AdminDisputesPage() {
  const supabase = await createClient();
  const { data: disputes } = await supabase
    .from('disputes')
    .select(`
      id, status, reason, created_at,
      opened_by:profiles!disputes_opened_by_fkey ( full_name ),
      booking:bookings ( id, check_in, check_out, listing:listings ( title ) )
    `)
    .order('created_at', { ascending: true });

  return (
    <main className="p-container-margin">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Disputes</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        {(disputes ?? []).filter((d: { status?: string }) => d.status === 'open').length} open
      </p>

      <div className="space-y-stack-sm">
        {(disputes ?? []).map((d: any) => (
          <div key={d.id} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-title-md text-sm text-on-surface">{d.booking?.listing?.title ?? 'Unknown listing'}</h3>
              <span className={cn('text-xs capitalize px-2 py-0.5 rounded-full', STATUS_STYLE[d.status])}>{d.status}</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-1">{d.reason}</p>
            <p className="text-xs text-on-surface-variant mb-stack-sm">
              Opened by {d.opened_by?.full_name ?? 'Unknown'}
              {d.booking && ` · Stay: ${new Date(d.booking.check_in).toLocaleDateString()} - ${new Date(d.booking.check_out).toLocaleDateString()}`}
            </p>
            <div className="sm:w-72">
              <DisputeActions disputeId={d.id} currentStatus={d.status} />
            </div>
          </div>
        ))}

        {(disputes ?? []).length === 0 && (
          <p className="text-center font-body-lg text-on-surface-variant py-stack-lg">No disputes filed. That's a good sign.</p>
        )}
      </div>
    </main>
  );
}
