'use client';

import Link from 'next/link';
import { Users, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TESTIMONIALS = [
  { quote: 'Our wedding guests stayed in one place and everything was perfect. The host was amazing!', name: 'Fatima A.', location: 'Kaduna' },
  { quote: "The apartment was spotless, secure, and in the best location. I'll definitely book again.", name: 'Ibrahim M.', location: 'Kano' },
  { quote: 'As an NGO worker, I travel a lot. Arewa Stay makes it easy to find safe, comfortable and affordable stays.', name: 'Clara D.', location: 'Niamey' },
];

export function BrandStory() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="grid md:grid-cols-2 gap-stack-lg items-center">
        <div>
          <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">{t('storyTitle')}</span>
          <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1 mb-stack-sm">{t('storyTitle')}</h2>
          <p className="font-body-md text-on-surface-variant mb-stack-md">
            {t('storyBody')}
          </p>
          <Link href="/about" className="inline-block bg-primary-container text-on-primary font-title-md text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all">
            {t('learnMoreAboutUs')}
          </Link>
        </div>
        <div className="henna-pattern rounded-tubali aspect-video bg-primary-container/5 border border-outline-variant/20" />
      </div>
    </section>
  );
}

export function HostCTABanner() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto px-4 py-stack-md">
      <div className="rounded-tubali bg-primary-container overflow-hidden relative">
        <div className="henna-pattern-light absolute inset-0 opacity-30" aria-hidden />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-stack-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-white/70 uppercase tracking-wider">{t('becomeAHost')}</span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-white leading-tight">
                {t('hostCtaTitle')}
              </h2>
            </div>
          </div>
          <Link href="/become-a-host" className="bg-secondary-fixed-dim text-on-secondary-fixed font-title-md text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all whitespace-nowrap">
            {t('startHosting')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="mb-stack-md">
        <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">{t('testimonialsTitle')}</span>
        <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">{t('testimonialsSubtitle')}</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-stack-md">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="rounded-tubali border border-outline-variant/30 p-stack-md bg-surface-container-lowest">
            <div className="flex gap-0.5 mb-stack-sm">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-ochre-gold fill-ochre-gold" />)}
            </div>
            <p className="font-body-md text-on-surface-variant italic mb-stack-sm">&quot;{t.quote}&quot;</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center font-label-sm text-m3-primary">
                {t.name[0]}
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">{t.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
