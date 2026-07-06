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
    <section className="relative overflow-hidden bg-km-bg py-24">
      {/* Gold map-glow — signature Arewa Stay hero element */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #D7A33B 0%, transparent 70%)' }}
      />
      <div className="container relative mx-auto px-4 text-center">
        <h1 className="mb-4 font-display text-4xl font-semibold text-foreground md:text-6xl">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {t('heroSubtitle')}
        </p>

        <div className="glass mx-auto flex max-w-xl flex-col items-center gap-2 rounded-xl p-3 sm:flex-row">
          <Select onValueChange={setSelectedState}>
            <SelectTrigger className="w-full border-white/10 bg-transparent text-foreground sm:flex-1">
              <SelectValue placeholder={t('selectStatePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {arewaStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} size="lg" className="w-full bg-km-gold text-km-bg hover:bg-km-gold/90 sm:w-auto">
            <Search className="mr-2 h-5 w-5" />
            {t('searchButton')}
          </Button>
        </div>
      </div>
    </section>
  );
}
