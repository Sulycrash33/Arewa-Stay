'use client';

import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { arewaCities } from '@/lib/constants';

const DEFAULT_RATE = 25000; // ₦/night fallback for towns with no listings yet
const BEDROOM_MULTIPLIER: Record<string, number> = { '1': 0.7, '2': 1, '3': 1.4, '4': 1.9, '5+': 2.5 };

export default function EarningsEstimator({ ratesByCity }: { ratesByCity: Record<string, number> }) {
  const [city, setCity] = useState('Kano');
  const [bedrooms, setBedrooms] = useState('2');
  const [nightsPerMonth, setNightsPerMonth] = useState(8);

  const baseRate = ratesByCity[city] ?? DEFAULT_RATE;
  const estimate = useMemo(() => {
    const rate = baseRate * (BEDROOM_MULTIPLIER[bedrooms] ?? 1);
    return Math.round((rate * nightsPerMonth) / 1000) * 1000;
  }, [baseRate, bedrooms, nightsPerMonth]);

  // Stylized price-bubble cluster — our own visual language (henna/topaz
  // tones, hand-placed bubbles) standing in for a real map embed, so no
  // external Maps API/billing dependency is needed.
  const bubbles = [
    { x: '20%', y: '30%', amt: Math.round(estimate * 0.8 / 1000) },
    { x: '45%', y: '15%', amt: Math.round(estimate * 1.15 / 1000) },
    { x: '65%', y: '40%', amt: Math.round(estimate / 1000) },
    { x: '30%', y: '65%', amt: Math.round(estimate * 0.9 / 1000) },
    { x: '75%', y: '70%', amt: Math.round(estimate * 1.3 / 1000) },
    { x: '55%', y: '80%', amt: Math.round(estimate * 0.75 / 1000) },
  ];

  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="text-center max-w-2xl mx-auto mb-stack-lg">
        <h2 className="font-display-lg text-3xl md:text-display-lg text-m3-primary mb-2">
          Your home could make{' '}
          <span className="text-ochre-gold">₦{estimate.toLocaleString()}</span> a month on Arewa Stay
        </h2>
        <p className="font-body-md text-on-surface-variant">
          {nightsPerMonth} nights &middot; ~₦{Math.round(baseRate * (BEDROOM_MULTIPLIER[bedrooms] ?? 1)).toLocaleString()}/night in {city}
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-stack-md">
        <input
          type="range"
          min={1}
          max={28}
          value={nightsPerMonth}
          onChange={(e) => setNightsPerMonth(Number(e.target.value))}
          className="w-full accent-primary-container"
        />
      </div>

      <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 mb-stack-lg">
        <div className="flex-1 border border-outline-variant/40 rounded-full px-4 py-2">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="border-none p-0 h-auto bg-transparent focus:ring-0 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {arewaCities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 border border-outline-variant/40 rounded-full px-4 py-2">
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="border-none p-0 h-auto bg-transparent focus:ring-0 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(BEDROOM_MULTIPLIER).map((b) => (
                <SelectItem key={b} value={b}>{b} bedroom{b !== '1' ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stylized rate-cluster visual */}
      <div className="relative max-w-2xl mx-auto h-64 rounded-tubali bg-primary-container/5 border border-outline-variant/20 overflow-hidden">
        <div className="henna-pattern absolute inset-0 opacity-30" aria-hidden />
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest border border-ochre-gold/40 shadow-tubali rounded-full px-3 py-1.5 font-label-md text-label-md text-m3-primary"
            style={{ left: b.x, top: b.y }}
          >
            ₦{b.amt}k
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shadow-tubali">
          <span className="text-on-primary text-lg">🏠</span>
        </div>
      </div>
    </section>
  );
}
