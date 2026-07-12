import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ClipboardList, ShieldAlert } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/');

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <header className="border-b border-outline-variant/20 bg-surface-container-low">
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          <span className="font-title-md text-title-md text-m3-primary flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> Admin
          </span>
          <nav className="flex gap-4">
            <Link href="/admin/listings" className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-m3-primary transition-colors">
              <ClipboardList className="h-4 w-4" /> Listings
            </Link>
          </nav>
        </div>
      </header>
      <div className="container mx-auto px-4 py-stack-lg">{children}</div>
    </div>
  );
}
