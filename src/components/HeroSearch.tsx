'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { arewaStates } from '@/lib/constants';

export default function HeroSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedState, setSelectedState] = useState('');

  const handleSearch = () => {
    router.push(selectedState ? `/listings?state=${selectedState}` : '/listings');
  };

  return (
    <section className="relative overflow-hidden bg-sand pb-20 pt-0 md:pb-28">
      {/* Real decorative facade band — top of hero, like the painted band
          under a roofline in Hausa architecture. This is the actual
          signature element, not an abstraction of one. */}
      <div className="facade-band w-full" aria-hidden />

      {/* Faint teal wash top-right, indigo wash bottom-left — richer than a
          single flat accent, echoing the multi-color facades. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full opacity-[0.10]"
        style={{ background: '#1C6E62' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full opacity-[0.08]"
        style={{ background: '#1E2A4A' }}
      />

      <div className="container relative mx-auto px-4 pt-16 text-center">
        <span className="mb-4 inline-block font-body text-xs font-medium uppercase tracking-[0.2em] text-henna/60">
          Northern Nigeria &middot; Niger Republic
        </span>
        <h1 className="mb-4 font-display text-4xl font-semibold text-henna-deep md:text-6xl">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-henna/70 md:text-xl">
          {t('heroSubtitle')}
        </p>

        <div className="topaz-glow mx-auto flex max-w-xl flex-col items-center gap-2 rounded-xl border-2 border-topaz/40 bg-card p-3 sm:flex-row">
          <Select onValueChange={setSelectedState}>
            <SelectTrigger className="w-full border-transparent bg-transparent text-henna-deep sm:flex-1">
              <SelectValue placeholder={t('selectStatePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {arewaStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} size="lg" className="w-full bg-henna text-sand hover:bg-henna-deep sm:w-auto">
            <Search className="mr-2 h-5 w-5" />
            {t('searchButton')}
          </Button>
        </div>
      </div>

      {/* Bottom band bookends the section */}
      <div className="facade-band absolute bottom-0 w-full" aria-hidden />
    </section>
  );
}
