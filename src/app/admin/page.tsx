import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Home, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export default async function AdminOverview() {
  const supabase = await createClient();

  const [{ count: pendingListings }, { count: pendingVerifications }, { count: openDisputes }] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('host_verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'open'),
  ]);

  const cards = [
    { href: '/admin/listings', icon: Home, label: 'Listings awaiting review', count: pendingListings ?? 0 },
    { href: '/admin/verifications', icon: ShieldCheck, label: 'Host verifications pending', count: pendingVerifications ?? 0 },
    { href: '/admin/disputes', icon: AlertTriangle, label: 'Open disputes', count: openDisputes ?? 0 },
  ];

  return (
    <main className="p-container-margin">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-stack-lg">Admin Overview</h1>
      <div className="grid sm:grid-cols-3 gap-stack-md">
        {cards.map(({ href, icon: Icon, label, count }) => (
          <Link key={href} href={href} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md hover:shadow-tubali transition-shadow">
            <Icon className="h-6 w-6 text-primary-container mb-stack-sm" />
            <div className="font-display-lg text-3xl text-m3-primary mb-1">{count}</div>
            <div className="flex items-center justify-between">
              <span className="font-body-md text-sm text-on-surface-variant">{label}</span>
              <ArrowRight className="h-4 w-4 text-on-surface-variant" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
