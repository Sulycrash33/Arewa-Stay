'use client';
import Link from 'next/link';
import ArewaStayLogo from './ArewaStayLogo';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <ArewaStayLogo />
            <p className="mt-4 text-sm text-muted-foreground">
              {t('footerDescription')}
            </p>
          </div>
          <div>
            <h4 className="font-headline font-semibold">{t('explore')}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/listings" className="text-muted-foreground hover:text-foreground">{t('allStays')}</Link></li>
              <li><Link href="/listings?state=Kano" className="text-muted-foreground hover:text-foreground">Kano</Link></li>
              <li><Link href="/listings?state=Kaduna" className="text-muted-foreground hover:text-foreground">Kaduna</Link></li>
              <li><Link href="/listings?state=Zinder" className="text-muted-foreground hover:text-foreground">Zinder</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold">{t('company')}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">{t('aboutUs')}</Link></li>
              <li><Link href="/become-a-host" className="text-muted-foreground hover:text-foreground">{t('becomeAHost')}</Link></li>
              <li><Link href="/help" className="text-muted-foreground hover:text-foreground">{t('helpSupport')}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">{t('contact')}</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-headline font-semibold">{t('connect')}</h4>
             <p className="mt-4 text-sm text-muted-foreground">
                {t('connectDescription')}
             </p>
             <div className="mt-2 flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href="#" aria-label="X (formerly Twitter)">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zM11.46 13.812h1.57L4.84 2.05H3.2L11.46 13.812z"></path></svg>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                   <Link href="#" aria-label="Instagram">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.011-4.85-.069c-3.225-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802C9.042 3.965 8.72 3.975 7.61 4.02c-2.52.115-3.483.435-4.14 1.096-.656.656-.98 1.62-1.095 4.14-.045 1.11-.055 1.43-.055 4.49s.01 3.38.055 4.49c.115 2.52.435 3.483 1.096 4.14.656.657 1.62.98 4.14 1.095 1.11.045 1.43.055 4.49.055s3.38-.01 4.49-.055c2.52-.115 3.483-.435 4.14-1.096.657-.656.98-1.62 1.095-4.14.045-1.11.055-1.43.055-4.49s-.01-3.38-.055-4.49c-.115-2.52-.435-3.483-1.096-4.14-.656-.657-1.62-.98-4.14-1.095-1.11-.045-1.43-.055-4.49-.055zm0 3.572c-2.43 0-4.39 1.96-4.39 4.39s1.96 4.39 4.39 4.39 4.39-1.96 4.39-4.39-1.96-4.39-4.39-4.39zm0 7.21c-1.55 0-2.82-1.27-2.82-2.82s1.27-2.82 2.82-2.82 2.82 1.27 2.82 2.82-1.27 2.82-2.82 2.82zm5.42-7.33c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"></path></svg>
                   </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="#" aria-label="Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.034C18.343 21.153 22 16.991 22 12z"></path></svg>
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="#" aria-label="WhatsApp">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM16.9 14.71c-.22-.11-1.3-.64-1.5-1.11-.2-.47-.44-1.04-.22-1.34s.5-.64.84-1.02c.34-.38.44-.64.6-.93s.08-.22-.04-.33c-.11-.11-.26-.11-.37-.11h-.11c-.11 0-.26.04-.37.15-.11.11-.48.47-.64.64-.15.15-.3.33-.44.51-.15.19-.29.4-.48.64-.19.22-.37.48-.6.76-.22.26-.44.55-.72.87-.29.33-.59.68-.94 1.06-.35.38-.72.77-1.15 1.18-.44.4-1.04.92-1.8 1.6-1.52 1.34-2.62 2.26-3.7 2.04-1.08-.22-1.34-1.52-1.52-1.8-1.19-1.89-2.3-3.75-2.62-4.22-.33-.48-.68-.84-1.06-1.15s-1.04-.55-1.52-.55c-.48 0-.93.22-1.25.48-.33.26-.64.59-.87.94-.22.35-.44.72-.6 1.15-.15.44-.22 1.04-.11 1.8.11.76.64 1.52 1.02 1.8 1.48 1.04 3.25 1.93 5.25 2.15h.6c.76-.08 1.52-.22 2.19-.51.68-.29 1.25-.68 1.76-1.15.51-.48 1.04-1.02 1.52-1.6.48-.59.92-1.25 1.29-1.97.38-.72.68-1.52.87-2.37.19-.84.22-1.6.11-2.26-.11-.64-.29-1.15-.51-1.52-.22-.38-.51-.68-.84-.94-.33-.26-.68-.48-.97-.6s-.44-.11-.6-.04c-.15.08-.26.15-.33.22-.08.08-.15.19-.19.29s-.04.22-.04.33c0 .15.08.33.19.55.11.22.26.48.44.76.19.29.37.59.55.94.19.35.29.72.33 1.11.04.4-.04.84-.15 1.25z"/></svg>
                  </Link>
                </Button>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>{t('copyright').replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
