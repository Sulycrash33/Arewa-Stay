import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['400', '500', '600', '700'],
});
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  weight: ['400', '500', '600'],
});

export const viewport: Viewport = {
  themeColor: '#0F5257',
};

export const metadata: Metadata = {
  title: 'Arewa Stay — Modern Comfort, Timeless Heritage',
  description: 'Authentic Northern Nigerian boutique hospitality. Discover curated stays across Kano, Kaduna, Sokoto and beyond.',
  openGraph: {
    title: 'Arewa Stay',
    description: 'Modern Comfort, Timeless Heritage — boutique stays across Northern Nigeria and the Sahel.',
    siteName: 'Arewa Stay',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Inline script runs before hydration to set <html lang> from the persisted
  // language choice, avoiding a flash of the wrong language attribute for
  // screen readers. LanguageContext (client) keeps React state in sync after.
  const setLangScript = `(function(){try{var l=localStorage.getItem('arewa_language');if(l&&['en','ha','fr'].includes(l))document.documentElement.lang=l;}catch(e){}})()`;

  return (
    <html lang="en" className={cn(hanken.variable, geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setLangScript }} />
      </head>
      <body className={cn('font-body-md antialiased min-h-screen flex flex-col text-foreground hausa-wall bg-background')}>
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-m3-primary focus:px-4 focus:py-2 focus:text-on-primary"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
