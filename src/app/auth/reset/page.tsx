'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ArewaStayLogo from '@/components/ArewaStayLogo';
import DagiLoader from '@/components/DagiLoader';
import { Loader2 } from 'lucide-react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Landing page for password-reset emails. Supabase redirects here with a
 * recovery token; the browser client exchanges it automatically and fires a
 * PASSWORD_RECOVERY auth event. If a valid session exists (recovery or a
 * normal login) we let the user set a new password.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then((res: { data: { session: Session | null } }) => {
      if (res.data.session) setHasSession(true);
      setChecking(false);
    });

    // The recovery link may finish exchanging slightly after the first
    // getSession check, so listen for the event as well.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
          setHasSession(true);
          setChecking(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not update password', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Password updated', description: 'You are signed in with your new password.' });
    router.push('/');
    router.refresh();
  };

  if (checking) return <DagiLoader label="Checking your reset link" sublabel="Muna tabbatar da hanyar..." />;

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-container-margin py-stack-lg bg-surface">
      <div className="mb-stack-lg"><ArewaStayLogo /></div>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-tubali tubali-border p-stack-lg shadow-tubali">
        {hasSession ? (
          <>
            <h1 className="font-headline-md text-headline-md text-m3-primary mb-1">Set a new password</h1>
            <p className="font-body-md text-sm text-on-surface-variant mb-stack-lg">
              Choose a new password for your Arewa Stay account.
            </p>
            <form onSubmit={handleSubmit} className="space-y-stack-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">New password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Confirm new password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h1 className="font-headline-md text-headline-md text-m3-primary mb-2">Reset link expired</h1>
            <p className="font-body-md text-sm text-on-surface-variant mb-stack-lg">
              This password-reset link is invalid or has already been used. Request a new one and try again within the hour.
            </p>
            <Link
              href="/auth"
              className="inline-block bg-primary-container text-on-primary font-title-md text-title-md px-8 py-3 rounded-full hover:opacity-90 transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
