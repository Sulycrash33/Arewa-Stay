import { cookies } from 'next/headers';
import en from '@/locales/en.json';
import ha from '@/locales/ha.json';
import fr from '@/locales/fr.json';

type Language = 'en' | 'ha' | 'fr';
type TranslationDictionary = typeof en;
type TranslationFn = ((key: string) => string) & Record<string, string>;

const translations: Record<Language, TranslationDictionary> = { en, ha, fr };

function isLanguage(value: string | undefined): value is Language {
  return value === 'en' || value === 'ha' || value === 'fr';
}

export async function getTranslations(): Promise<TranslationFn> {
  const cookieStore = await cookies();
  const language = cookieStore.get('arewa_language')?.value;
  const selectedLanguage = isLanguage(language) ? language : 'en';

  const translate = ((key: string) => {
    const value = translations[selectedLanguage][key as keyof TranslationDictionary];
    return typeof value === 'string' ? value : key;
  }) as TranslationFn;

  return new Proxy(translate, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        const value = translations[selectedLanguage][prop as keyof TranslationDictionary];
        return typeof value === 'string' ? value : prop;
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}
