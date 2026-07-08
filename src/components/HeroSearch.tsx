'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    <section className="relative w-full flex flex-col md:flex-row items-stretch overflow-hidden">
      {/* Decorative panel — stands in for a hero property photograph until
          real listing photography exists. Real henna-linework pattern as a
          subtle full-panel texture, referencing the culture directly rather
          than an abstract repeating band. */}
      <div className="relative md:w-[45%] lg:w-[40%] h-64 md:h-auto overflow-hidden rounded-b-[2rem] md:rounded-none md:rounded-br-[4rem] bg-primary-container">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 30% 20%, #96d0d6 0%, transparent 60%)' }}
          aria-hidden
        />
        <div className="henna-pattern-light absolute inset-0" aria-hidden />
        <svg className="absolute bottom-0 right-0 w-32 h-32 text-surface opacity-90 hidden md:block" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
          <polygon fill="currentColor" points="100,100 100,0 0,100" />
        </svg>
      </div>

      {/* Hero content */}
      <div className="relative flex-1 flex flex-col justify-center px-container-margin md:px-12 py-12 md:py-20 bg-surface">
        <div className="max-w-xl mx-auto md:mx-0 w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-clay-brown" />
            <span className="font-label-md text-label-md text-on-tertiary-fixed-variant uppercase tracking-widest">Boutique Hospitality</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-m3-primary mb-6 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
            {t('heroSubtitle')}
          </p>

          {/* Tubali search card */}
          <div className="bg-surface-container-lowest rounded-tubali p-6 tubali-shadow mb-8 relative">
            <div
              className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0F5257 1px, transparent 0)', backgroundSize: '8px 8px' }}
            />
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <div className="flex-1 min-w-0 border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Destination</label>
                <Select onValueChange={setSelectedState}>
                  <SelectTrigger className="w-full border-none p-0 h-auto bg-transparent font-body-md text-on-surface focus:ring-0 shadow-none">
                    <SelectValue placeholder={t('selectStatePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {arewaStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-px bg-outline-variant/30 hidden md:block" />
              <div className="flex-1 min-w-0 border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Dates</label>
                <input className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-on-surface placeholder-on-surface-variant/50" placeholder="Add dates" type="text" />
              </div>
              <div className="w-px bg-outline-variant/30 hidden md:block" />
              <div className="flex-1 min-w-0 border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Guests</label>
                <input className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-on-surface placeholder-on-surface-variant/50" placeholder="2 guests" type="text" />
              </div>
              <button
                onClick={handleSearch}
                aria-label="Search"
                className="mt-2 md:mt-0 bg-primary-container text-on-primary rounded-full w-12 h-12 flex items-center justify-center hover:opacity-90 transition-opacity active-pill-shadow shrink-0"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={handleSearch} className="bg-primary-container text-on-primary font-title-md text-sm px-8 py-3 rounded-full hover:opacity-90 transition-all active-pill-shadow flex items-center gap-2">
              {t('searchButton') || 'Explore Stays'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link href="/become-a-host" className="border border-clay-brown text-m3-primary font-title-md text-sm px-8 py-3 rounded-full hover:bg-surface-container-low transition-colors bg-surface">
              {t('becomeAHost')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
