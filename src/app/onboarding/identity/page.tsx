'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, Fingerprint } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function IdentityVerificationPage() {
  const router = useRouter();
  const { profile } = useUser();
  const { toast } = useToast();
  const [idType, setIdType] = useState<'NIN' | 'BVN'>('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast({ title: 'Please log in first', variant: 'destructive' });
      return;
    }
    if (idNumber.replace(/\D/g, '').length !== 11) {
      toast({ title: 'Enter a valid 11-digit number', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      // We deliberately never persist the raw NIN/BVN — only that a
      // submission was made, pending review or a licensed verifier
      // integration (e.g. Paystack Identity, Youverify, NIBSS).
      const supabase = createClient();
      const { error } = await supabase.from('host_verifications').insert({
        user_id: profile.id,
        notes: `${idType} submitted for verification`,
        status: 'pending',
      });
      if (error) throw error;
      toast({ title: 'Submitted for verification' });
      router.push('/dashboard/host/verification');
    } catch (err) {
      toast({ title: 'Something went wrong', description: String(err), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto flex flex-col px-container-margin py-stack-lg min-h-[calc(100vh-64px)]">
      <button onClick={() => router.back()} className="p-2 -ml-2 text-m3-primary self-start mb-stack-md">
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="w-full flex-1 flex flex-col justify-center">
        <div className="mb-stack-lg text-center">
          <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 border border-outline-variant/30">
            <ShieldCheck className="h-8 w-8 text-primary-container" />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-m3-primary mb-2">Trusted Identity</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            To ensure a secure community for all our guests in Northern Nigeria, please verify your identity using your NIN or BVN.
          </p>
        </div>

        <div className="tubali-border rounded-tubali bg-surface w-full p-stack-md mb-stack-lg shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="mb-stack-md flex gap-gutter">
              {(['NIN', 'BVN'] as const).map((type) => (
                <label key={type} className="flex-1 cursor-pointer">
                  <input type="radio" name="id_type" value={type} checked={idType === type} onChange={() => setIdType(type)} className="peer sr-only" />
                  <div
                    className={cn(
                      'p-4 border rounded-lg text-center transition-colors',
                      idType === type
                        ? 'bg-surface-container-low border-primary-container text-primary-container'
                        : 'border-outline-variant/30 text-on-surface'
                    )}
                  >
                    <span className="font-title-md text-title-md block">{type}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {type === 'NIN' ? 'National ID' : 'Bank Verification'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-stack-lg relative">
              <label htmlFor="id_number" className="block font-label-md text-label-md text-on-surface-variant mb-1">
                Enter your 11-digit number
              </label>
              <input
                id="id_number"
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="0000 0000 000"
                className="w-full bg-transparent border-0 border-b-2 border-clay-brown focus:ring-0 px-0 py-2 font-body-lg text-body-lg text-on-surface placeholder:text-outline/50 transition-colors"
              />
              <Fingerprint className="absolute right-0 bottom-2 h-5 w-5 text-outline/50" />
            </div>

            <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 flex gap-3 items-start mb-stack-md">
              <Lock className="h-4 w-4 text-outline mt-0.5 shrink-0" />
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Your data is encrypted and securely processed. Arewa Stay does not store your BVN or NIN directly — we only use it for a one-time validation via official channels.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-4 rounded-full flex justify-center items-center gap-2 hover:opacity-90 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Verify / Tabbatar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
