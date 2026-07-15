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
  return (
    <html lang="en" className={cn(hanken.variable, geist.variable)}>
      <body className={cn('font-body-md antialiased min-h-screen flex flex-col bg-background text-foreground')}>
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary-container focus:px-4 focus:py-2 focus:text-on-primary"
          >
            Skip to content
          </a>
          <Header />
          <div id="main-content" className="flex-grow">{children}</div>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
