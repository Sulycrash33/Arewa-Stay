import Link from 'next/link';
import { MapPinned, Clock, Landmark, PartyPopper, UtensilsCrossed } from 'lucide-react';
import { getTranslations } from '@/lib/i18n';

const GUIDES = [
  { icon: MapPinned, title: 'Hidden Gems of Kano', desc: 'Places you need to see.' },
  { icon: Clock, title: '48 Hours in Zaria', desc: 'A perfect weekend itinerary.' },
  { icon: Landmark, title: 'Traditional Hausa Architecture', desc: 'Beauty. Heritage. Identity.' },
  { icon: PartyPopper, title: 'Guide to the Durbar Festival', desc: 'Culture, color and celebration.' },
  { icon: UtensilsCrossed, title: 'Northern Cuisine Worth Traveling For', desc: 'Flavors of the North.' },
];

export default async function TravelGuides() {
  const t = await getTranslations();
  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="flex items-end justify-between mb-stack-md">
        <div>
          <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">Stories from the North</span>
          <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">Travel guides, culture, and inspiration.</h2>
        </div>
        <Link href="/about" className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary-container hover:underline shrink-0">
          {t.viewAllStories} →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {GUIDES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-tubali overflow-hidden border border-outline-variant/30">
            <div className="aspect-[4/3] bg-tertiary-container/20 flex items-center justify-center">
              <Icon className="h-8 w-8 text-m3-tertiary/60" />
            </div>
            <div className="p-2 bg-surface-container-lowest">
              <h3 className="font-label-md text-label-md text-on-surface leading-tight">{title}</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
