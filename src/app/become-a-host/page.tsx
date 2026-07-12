import Link from 'next/link';
import { Home, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import { getAverageRatesByCity } from '@/lib/data';
import EarningsEstimator from '@/components/host/EarningsEstimator';
import { TrustSection, LiaisonCTA } from '@/components/host/TrustSections';

const STEPS = [
  { icon: ShieldCheck, title: 'Verify your identity', desc: 'Submit your NIN or BVN so guests know you\'re a trusted host.', href: '/onboarding/identity' },
  { icon: Home, title: 'List your property', desc: 'Add photos, cultural features, and pricing for your space.', href: '/host/listings/new' },
  { icon: Wallet, title: 'Start earning', desc: 'Accept booking requests (Maraba) and get paid via Paystack.', href: '/dashboard/host/verification' },
];

export default async function BecomeAHostPage() {
  const ratesByCity = await getAverageRatesByCity();

  return (
    <main>
      <div className="container mx-auto px-4 pt-stack-lg max-w-4xl">
        <div className="text-center mb-stack-lg">
          <h1 className="font-display-lg text-4xl md:text-display-lg text-m3-primary mb-stack-sm">Host with Arewa Stay</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Turn your zaure, guest wing, or family compound into income — while keeping the privacy and dignity your household expects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-stack-md mb-stack-lg">
          {STEPS.map(({ icon: Icon, title, desc, href }, i) => (
            <Link key={title} href={href} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md shadow-tubali hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center mb-stack-sm">
                <Icon className="h-6 w-6 text-primary-container" />
              </div>
              <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-wider">Step {i + 1}</span>
              <h2 className="font-title-md text-title-md text-on-surface mb-1">{title}</h2>
              <p className="font-body-md text-sm text-on-surface-variant mb-stack-sm">{desc}</p>
              <span className="font-label-md text-label-md text-primary-container flex items-center gap-1 group-hover:gap-2 transition-all">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <EarningsEstimator ratesByCity={ratesByCity} />
      <TrustSection />
      <LiaisonCTA />

      <div className="text-center py-stack-lg">
        <Link href="/onboarding/identity" className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title-md text-title-md px-8 py-3 rounded-full hover:opacity-90 transition-all">
          Start Hosting <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
