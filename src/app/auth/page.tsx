'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ArewaStayLogo from '@/components/ArewaStayLogo';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [tab, setTab] = useState<'login' | 'signup'>(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'signup' && !agreedToTerms) {
      toast({ title: 'Please agree to the Terms and Privacy Policy to continue', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const supabase = createClient();

    if (tab === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Welcome to Arewa Stay', description: 'Check your email to confirm your account if required.' });
        router.push('/');
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Welcome back' });
        router.push('/');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-container-margin py-stack-lg bg-surface">
      <div className="mb-stack-lg"><ArewaStayLogo /></div>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-tubali tubali-border p-stack-lg shadow-tubali">
        <div className="flex bg-surface-container-low rounded-full p-1 mb-stack-lg">
          {(['login', 'signup'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 font-label-md text-label-md py-2 rounded-full transition-all',
                tab === t ? 'bg-primary-container text-on-primary active-pill-shadow' : 'text-on-surface-variant'
              )}
            >
              {t === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-stack-md">
          {tab === 'signup' && (
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Full Name</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
                placeholder="Malam Ibrahim"
              />
            </div>
          )}
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-md text-on-surface"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Password</label>
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

          {tab === 'signup' && (
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-clay-brown text-primary-container focus:ring-primary-container shrink-0"
              />
              <span className="font-body-md text-sm text-on-surface-variant">
                I agree to Arewa Stay&apos;s{' '}
                <a href="/terms" target="_blank" className="text-primary-container hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" className="text-primary-container hover:underline">Privacy Policy</a>.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={loading || (tab === 'signup' && !agreedToTerms)}
            className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
}
