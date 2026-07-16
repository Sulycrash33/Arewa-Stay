'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { allRegions } from '@/lib/constants';
import { heroPhotos, realPropertyPhotos } from '@/lib/stock-photos';
import Image from 'next/image';

export default function HeroSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Full-bleed hero photo — interior window view of a guest watching a
          rider pass a Heritage Hospitality compound at golden hour. */}
      <div className="relative h-[520px] md:h-[600px] w-full">
        <Image
          src={realPropertyPhotos.hero[0]}
          alt="Arewa Stay — a guest's window view of Northern Hospitality"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        <div className="relative z-10 h-full flex flex-col justify-center container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="font-display-lg text-4xl md:text-display-lg text-white mb-4 leading-tight">
              {t('heroTitle')}<br />
              <span className="text-secondary-fixed-dim">{t('heroTitleAccent')}</span>
            </h1>
            <p className="font-body-lg text-body-lg text-white/85 mb-8 max-w-xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleSearch} className="bg-primary-container text-on-primary font-title-md text-sm px-8 py-3 rounded-full hover:opacity-90 transition-all active-pill-shadow flex items-center gap-2">
                {t('heroPrimaryCta')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link href="/become-a-host" className="border border-white/60 text-white font-title-md text-sm px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                {t('heroSecondaryCta')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tubali search card, overlapping the hero bottom edge */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-8 md:-mt-9 z-20 bg-surface-container-lowest rounded-tubali shadow-tubali tubali-border p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t('destination')}</label>
              <Select onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full border-none p-0 h-auto bg-transparent font-body-md text-on-surface focus:ring-0 shadow-none">
                  <SelectValue placeholder={t('destinationPlaceholder')} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {allRegions.map((group) => (
                    <SelectGroup key={group.state}>
                      <SelectLabel>{group.state}</SelectLabel>
                      {group.cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t('checkIn')}</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-on-surface text-sm" />
            </div>
            <div className="border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t('checkOut')}</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-on-surface text-sm" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1 border-b-2 border-clay-brown/30 focus-within:border-primary-container transition-colors pb-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{t('guests')}</label>
                <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-on-surface text-sm" />
              </div>
              <button onClick={handleSearch} aria-label={t('searchAriaLabel')} className="bg-primary-container text-on-primary rounded-full w-11 h-11 flex items-center justify-center hover:opacity-90 transition-opacity active-pill-shadow shrink-0">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
