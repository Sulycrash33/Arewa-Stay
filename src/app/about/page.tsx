'use client';

import { Info, Target, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SECTIONS = [
  { icon: Info, titleKey: 'aboutWhoTitle', bodyKey: 'aboutWhoBody' },
  { icon: Target, titleKey: 'aboutMissionTitle', bodyKey: 'aboutMissionBody' },
  { icon: Eye, titleKey: 'aboutVisionTitle', bodyKey: 'aboutVisionBody' },
];

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-4xl">
      <div className="text-center mb-stack-lg">
        <h1 className="font-display-lg text-4xl md:text-display-lg text-m3-primary">{t('aboutPageTitle')}</h1>
        <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant">
          {t('aboutPageSubtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-stack-md">
        {SECTIONS.map(({ icon: Icon, titleKey, bodyKey }) => (
          <div key={titleKey} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md shadow-tubali">
            <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary-container" />
              {t(titleKey)}
            </h2>
            <p className="font-body-md text-on-surface-variant">{t(bodyKey)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
