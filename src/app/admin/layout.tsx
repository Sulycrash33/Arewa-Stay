import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, Home, ShieldCheck, AlertTriangle, Handshake } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: Home },
  { href: '/admin/verifications', label: 'Verifications', icon: ShieldCheck },
  { href: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
  { href: '/admin/liaisons', label: 'Liaisons', icon: Handshake },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/');

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      <aside className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-outline-variant/30 bg-surface-container-low">
        <nav className="flex md:flex-col overflow-x-auto p-2 gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary-container transition-colors whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
