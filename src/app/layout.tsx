import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600', '700'],
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Arewa Stay',
  description: 'Your home in the heart of Northern Nigeria and the Sahel.',
  themeColor: '#4A1F16',
  openGraph: {
    title: 'Arewa Stay',
    description: 'Your home in the heart of Northern Nigeria and the Sahel.',
    siteName: 'Arewa Stay',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(fraunces.variable, jakarta.variable, plexMono.variable)}>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background text-foreground')}>
        <LanguageProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
