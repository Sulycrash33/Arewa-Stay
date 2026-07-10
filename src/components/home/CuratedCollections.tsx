import Link from 'next/link';
import Image from 'next/image';
import { Crown, Sun, Home as HomeIcon, Briefcase, Landmark, Music } from 'lucide-react';
import { realPropertyPhotos } from '@/lib/stock-photos';

const COLLECTIONS = [
  { icon: Crown, title: 'Royal Wedding Suites', desc: 'Celebrate in style.', photo: realPropertyPhotos.bedrooms[0] },
  { icon: Sun, title: 'Desert Escapes', desc: 'Serenity, silence, stars.', photo: realPropertyPhotos.lodges[0] },
  { icon: HomeIcon, title: 'Family Compounds', desc: 'Together, comfortably.', photo: realPropertyPhotos.compound[0] },
  { icon: Briefcase, title: 'Executive Residences', desc: 'Work. Rest. Thrive.', photo: realPropertyPhotos.kitchens[0] },
  { icon: Landmark, title: 'Heritage Homes', desc: 'Stay where history lives.', photo: realPropertyPhotos.lodges[1] },
  { icon: Music, title: 'Weekend Retreats', desc: 'Short trips. Big memories.', photo: realPropertyPhotos.pools[1] },
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
        {COLLECTIONS.map(({ icon: Icon, title, desc, photo }) => (
          <Link
            key={title}
            href="/listings"
            className="relative aspect-square rounded-tubali overflow-hidden group hover:-translate-y-1 transition-transform"
          >
            <Image
              src={photo}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <Icon className="absolute top-4 left-4 h-6 w-6 text-white/80" />
              <h3 className="font-title-md text-sm md:text-title-md text-white leading-tight">{title}</h3>
              <p className="font-label-sm text-label-sm text-white/70 mt-1 hidden md:block">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
