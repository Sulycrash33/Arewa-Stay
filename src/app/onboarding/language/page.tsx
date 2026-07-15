'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { code: 'en' as const, title: 'English', subtitle: 'Latin script', icon: Languages },
  { code: 'ha' as const, title: 'Hausa', subtitle: 'Boko – Hausa da aka daidaita', icon: BookOpen },
  { code: 'fr' as const, title: 'Français', subtitle: 'Pour les visiteurs du Niger', icon: Languages },
];

export default function LanguageOnboardingPage() {
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState(language);
  const router = useRouter();

  const handleContinue = () => {
    setLanguage(selected);
    router.push('/');
  };

  return (
    <main className="w-full max-w-md mx-auto flex flex-col justify-center px-container-margin py-stack-lg min-h-[calc(100vh-64px)]">
      <header className="mb-stack-lg text-center">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-m3-primary mb-stack-sm">
          {language === 'ha' ? 'Zaɓi yaren ka' : language === 'fr' ? 'Choisissez votre langue' : 'Choose your language'}
          <br />
          <span className="text-on-surface-variant font-title-md text-title-md">{language === 'ha' ? 'Zaɓi yaren da kake so' : language === 'fr' ? 'Sélectionnez votre langue' : 'Choose your language'}</span>
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {language === 'ha' ? 'Zaɓi yaren da ya dace da ka domin ƙwarewa ta musamman.' : language === 'fr' ? 'Choisissez la langue qui vous convient pour une expérience sur mesure.' : 'Select your preferred language for a tailored experience.'}
        </p>
      </header>

      <div className="space-y-stack-md">
        {OPTIONS.map(({ code, title, subtitle, icon: Icon }) => (
          <label key={code} className="block cursor-pointer group">
            <input
              type="radio"
              name="language"
              value={code}
              checked={selected === code}
              onChange={() => setSelected(code)}
              className="peer sr-only"
            />
            <div
              className={cn(
                'bg-surface-container-lowest rounded-tubali p-stack-md tubali-shadow transition-all duration-300 flex items-center justify-between group-hover:bg-surface-container-low',
                selected === code && 'ring-2 ring-primary-container bg-surface'
              )}
            >
              <div className="flex items-center gap-gutter">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    selected === code ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-m3-primary'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface">{title}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{subtitle}</p>
                </div>
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                  selected === code ? 'border-primary-container' : 'border-outline-variant'
                )}
              >
                <div className={cn('w-3 h-3 rounded-full bg-primary-container transition-opacity', selected === code ? 'opacity-100' : 'opacity-0')} />
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-stack-lg">
        <button
          onClick={handleContinue}
          className="w-full bg-primary-container text-on-primary rounded-full py-3 px-6 font-title-md text-title-md hover:opacity-90 transition-colors flex items-center justify-center gap-2"
        >
          {language === 'ha' ? 'Ci gaba' : language === 'fr' ? 'Continuer' : 'Continue'}
          <ArrowRight className="h-4 w-4" />
        </button>
        <div className="mt-stack-md text-center">
          <button onClick={() => router.push('/')} className="font-label-md text-label-md text-outline hover:text-primary-container transition-colors">
            {language === 'ha' ? 'Tsallake a yanzu' : language === 'fr' ? 'Passer pour l’instant' : 'Skip for now'}
          </button>
        </div>
      </div>
    </main>
  );
}
