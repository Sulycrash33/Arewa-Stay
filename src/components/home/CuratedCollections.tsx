import Link from 'next/link';
import { Crown, Sun, Home as HomeIcon, Briefcase, Landmark, Music } from 'lucide-react';

const COLLECTIONS = [
  { icon: Crown, title: 'Royal Wedding Suites', desc: 'Celebrate in style.', gradient: 'from-tertiary-container to-m3-tertiary' },
  { icon: Sun, title: 'Desert Escapes', desc: 'Serenity, silence, stars.', gradient: 'from-secondary-fixed-dim to-m3-secondary' },
  { icon: HomeIcon, title: 'Family Compounds', desc: 'Together, comfortably.', gradient: 'from-primary-fixed-dim to-primary-container' },
  { icon: Briefcase, title: 'Executive Residences', desc: 'Work. Rest. Thrive.', gradient: 'from-surface-tint to-m3-primary' },
  { icon: Landmark, title: 'Heritage Homes', desc: 'Stay where history lives.', gradient: 'from-tertiary-fixed-dim to-tertiary-container' },
  { icon: Music, title: 'Weekend Retreats', desc: 'Short trips. Big memories.', gradient: 'from-primary-container to-m3-primary' },
];

export default function CuratedCollections() {
  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="flex items-end justify-between mb-stack-md">
        <div>
          <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">Curated Collections</span>
          <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">Find stays that fit your journey.</h2>
        </div>
        <Link href="/listings" className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary-container hover:underline shrink-0">
          View all collections →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {COLLECTIONS.map(({ icon: Icon, title, desc, gradient }) => (
          <Link
            key={title}
            href="/listings"
            className={`relative aspect-square rounded-tubali overflow-hidden bg-gradient-to-br ${gradient} p-4 flex flex-col justify-end group hover:-translate-y-1 transition-transform`}
          >
            <Icon className="absolute top-4 left-4 h-6 w-6 text-white/70" />
            <h3 className="font-title-md text-sm md:text-title-md text-white leading-tight">{title}</h3>
            <p className="font-label-sm text-label-sm text-white/70 mt-1 hidden md:block">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
