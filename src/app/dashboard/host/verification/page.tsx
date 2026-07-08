import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getHostVerificationStatus } from '@/lib/data';
import { Check, Clock, Handshake, MessageCircle, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIER_INFO: Record<string, { label: string; next: string; threshold: number }> = {
  bako: { label: 'Bako (Visitor)', next: 'Majidadin', threshold: 15 },
  majidadin: { label: 'Majidadin (Trusted)', next: 'Sarki', threshold: 999 },
  sarki: { label: 'Sarki (Elite)', next: '', threshold: 999 },
};

export default async function HostVerificationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  const { profile, latestVerification } = await getHostVerificationStatus(user.id);
  const tier = TIER_INFO[profile?.host_tier ?? 'bako'];
  const progressPct = Math.min(100, Math.round(((profile?.completed_stays ?? 0) / tier.threshold) * 100));

  const status = latestVerification?.status ?? null;
  const steps = [
    { title: 'Identity Submitted', done: !!latestVerification, desc: 'NIN/BVN submission received.' },
    { title: 'Structural Inspection', done: status === 'approved', desc: 'Physical safety and amenity check.' },
    { title: 'Cultural Compliance', done: status === 'approved', current: status === 'pending', desc: 'Reviewing architectural and community standards.' },
    { title: 'Final Approval', done: status === 'approved', desc: 'Listing goes live for guests.' },
  ];

  return (
    <main className="px-container-margin py-stack-md space-y-stack-lg max-w-2xl mx-auto w-full">
      <section className="bg-surface-container-lowest rounded-tubali p-stack-md tubali-border shadow-tubali">
        <div className="flex items-start justify-between mb-stack-md">
          <div>
            <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-wider mb-1 block">
              {status === 'approved' ? 'Verified' : status === 'revoked' ? 'Revoked' : latestVerification ? 'In Progress' : 'Not Started'}
            </span>
            <h2 className="font-title-md text-title-md text-m3-primary">{tier.label}</h2>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-stack-md">
          {latestVerification
            ? 'Your identity submission is being reviewed.'
            : 'Submit your NIN or BVN to start host verification.'}
        </p>
        <div className="w-full bg-surface-variant rounded-full h-2 mb-2 overflow-hidden">
          <div className="bg-ochre-gold h-2 rounded-full" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant">
          <span>{profile?.completed_stays ?? 0} stays completed</span>
          {tier.next && <span>{tier.threshold - (profile?.completed_stays ?? 0)} more to reach {tier.next}</span>}
        </div>
      </section>

      <section className="pl-4">
        <h3 className="font-title-md text-title-md text-m3-primary mb-stack-md">Verification Steps</h3>
        <div className="relative border-l-2 border-surface-variant pb-stack-md">
          {steps.map((step, i) => (
            <div key={i} className={cn('mb-stack-md relative pl-stack-md', !step.done && !step.current && 'opacity-50')}>
              <div
                className={cn(
                  'absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-container-lowest',
                  step.done ? 'bg-emerald-green' : step.current ? 'bg-ochre-gold animate-pulse' : 'bg-surface-variant'
                )}
              >
                {step.done ? <Check className="h-3 w-3 text-white" /> : step.current ? <Clock className="h-3 w-3 text-white" /> : null}
              </div>
              <h4 className={cn('font-label-md text-label-md', step.done ? 'text-emerald-green' : step.current ? 'text-ochre-gold' : 'text-on-surface')}>
                {step.title}
              </h4>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community liaison card */}
      <section className="bg-surface-container-low rounded-xl p-stack-md tubali-border">
        <h3 className="font-title-md text-title-md text-m3-primary mb-stack-md flex items-center gap-2">
          <Handshake className="h-5 w-5 text-clay-brown" />
          Community Liaison
        </h3>
        {latestVerification?.liaison_name ? (
          <>
            <div className="flex items-center gap-stack-md mb-stack-md">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest tubali-border flex items-center justify-center font-title-md text-m3-primary">
                {latestVerification.liaison_name[0]}
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">{latestVerification.liaison_name}</h4>
                <p className="font-body-md text-sm text-on-surface-variant">Local Culture &amp; Standards Officer</p>
              </div>
            </div>
            {latestVerification.notes && (
              <p className="font-body-md text-sm text-on-surface-variant mb-stack-md italic border-l-2 border-clay-brown/50 pl-3 py-1">
                &quot;{latestVerification.notes}&quot;
              </p>
            )}
            <div className="flex gap-stack-sm">
              <a href={`tel:${latestVerification.liaison_contact ?? ''}`} className="flex-1 bg-primary-container text-white font-label-md text-label-md py-3 rounded-full flex justify-center items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Contact Liaison
              </a>
              <button className="flex-1 border-2 border-clay-brown text-primary-container font-label-md text-label-md py-3 rounded-full flex justify-center items-center gap-2 bg-transparent">
                <ClipboardList className="h-4 w-4" /> Field Notes
              </button>
            </div>
          </>
        ) : (
          <p className="font-body-md text-sm text-on-surface-variant">
            A community liaison will be assigned once your identity submission is reviewed.
          </p>
        )}
      </section>
    </main>
  );
}
