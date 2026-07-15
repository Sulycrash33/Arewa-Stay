import { Heart, Briefcase, Users, Building2, GraduationCap, Stethoscope, Landmark, ArrowLeftRight, Film, Gem } from 'lucide-react';
import { getTranslations } from '@/lib/i18n';

const JOURNEYS = [
  { icon: Heart, label: 'Wedding Celebrations' },
  { icon: Briefcase, label: 'Business Travel' },
  { icon: Users, label: 'Family Reunions' },
  { icon: Building2, label: 'NGO & Mission Trips' },
  { icon: GraduationCap, label: 'Academic Conferences' },
  { icon: Stethoscope, label: 'Medical Visits' },
  { icon: Landmark, label: 'Pilgrimage Stopovers' },
  { icon: ArrowLeftRight, label: 'Cross-border Traders' },
  { icon: Film, label: 'Film Productions' },
  { icon: Gem, label: 'Luxury Getaways' },
];

export default async function JourneyTypes() {
  const t = await getTranslations();
  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="mb-stack-md">
        <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">{t.journeysTitle}</span>
        <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">{t.journeysSubtitle}</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {JOURNEYS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl border border-outline-variant/20 hover:border-primary-container/40 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary-container" />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
