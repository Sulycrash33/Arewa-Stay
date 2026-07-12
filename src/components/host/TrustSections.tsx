import Link from 'next/link';
import { Home, Wallet, ShieldCheck, Handshake, ArrowRight } from 'lucide-react';

const REASONS = [
  {
    icon: Home,
    title: "It's simple",
    body: 'List your zaure, guest wing, or family compound in a few steps — with support from our community liaisons at every stage.',
  },
  {
    icon: Wallet,
    title: "It's worth it",
    body: "Getting started is free. You set your price, and we only take a fee once you've been paid — never before.",
  },
  {
    icon: ShieldCheck,
    title: "You're protected",
    body: 'Consent-first bookings (Maraba), verified guest trust tiers, and dispute support give you real peace of mind.',
  },
];

export function TrustSection() {
  return (
    <section className="container mx-auto px-4 py-stack-lg text-center">
      <h2 className="font-headline-lg text-headline-lg text-m3-primary mb-stack-lg">
        Join hosts across the North
      </h2>
      <div className="grid md:grid-cols-3 gap-stack-md text-left max-w-4xl mx-auto">
        {REASONS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex gap-stack-sm">
            <div className="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-m3-primary" />
            </div>
            <div>
              <h3 className="font-title-md text-title-md text-on-surface mb-1">{title}</h3>
              <p className="font-body-md text-sm text-on-surface-variant">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LiaisonCTA() {
  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="rounded-tubali bg-surface-container-low tubali-border p-stack-lg text-center max-w-2xl mx-auto">
        <Handshake className="h-9 w-9 text-primary-container mx-auto mb-stack-sm" />
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-m3-primary mb-2">
          A community liaison can help you get started
        </h2>
        <p className="font-body-md text-on-surface-variant mb-stack-md">
          Not sure how to price your space or get your first booking? A local liaison can help you list your property, prepare your space, and understand what guests are looking for.
        </p>
        <Link href="/onboarding/identity" className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title-md text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all">
          Request a liaison <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
