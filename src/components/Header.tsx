'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, User, MessageSquare, ShieldCheck, LogOut, Globe, Search, Heart, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';
import ArewaStayLogo from './ArewaStayLogo';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { profile, isLoggedIn, signOut } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Scroll-compact effect: on the home page (which has a tall hero), the
  // header starts fully transparent-adjacent and condenses into a compact
  // search pill once the user scrolls past the hero — the same pattern
  // Airbnb uses, rather than always showing a static bar.
  const isHome = pathname === '/';

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const NAV_ITEMS = [
    { href: '/listings', label: t('exploreStays') },
    { href: '/become-a-host', label: t('becomeAHost') },
    { href: '/about', label: t('aboutUs') },
    { href: '/contact', label: t('contact') },
  ];

  const languageMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Language" className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <Globe className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(['en', 'ha', 'fr'] as const).map((code) => (
          <DropdownMenuItem key={code} onClick={() => setLanguage(code)} className={cn(language === code && 'font-semibold text-primary-container')}>
            {code === 'en' ? 'English' : code === 'ha' ? 'Hausa' : 'Français'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Single combined menu — everything (nav links, auth, account actions)
  // lives behind one clean bordered pill, instead of ~8 separate top-level
  // items competing for space.
  const combinedMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 border border-outline-variant/40 rounded-full pl-3 pr-1 py-1 hover:shadow-tubali transition-shadow bg-surface">
          <Menu className="h-4 w-4 text-on-surface-variant" />
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? 'User'} />
            <AvatarFallback className="bg-primary-container text-on-primary text-xs">
              {profile?.full_name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {isLoggedIn ? (
          <>
            <DropdownMenuLabel>{profile?.full_name || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard/messages"><MessageSquare className="mr-2 h-4 w-4" />Messages</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/bookings"><Calendar className="mr-2 h-4 w-4" />My Bookings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/favorites"><Heart className="mr-2 h-4 w-4" />Saved stays</Link></DropdownMenuItem>
            {profile?.role === 'admin' && (
              <DropdownMenuItem asChild><Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin Panel</Link></DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem asChild><Link href="/auth?tab=signup" className="font-semibold">Sign up</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/auth?tab=login">Log in</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {NAV_ITEMS.map((item) => (
          <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{item.label}</Link></DropdownMenuItem>
        ))}
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header
      className={cn(
        'top-0 w-full z-40 flex items-center px-container-margin h-16 transition-all duration-300',
        isHome && !scrolled ? 'bg-transparent absolute' : 'bg-surface border-b border-outline-variant/30 sticky shadow-sm'
      )}
    >
      <div className="flex items-center gap-2 flex-1">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Menu" className={cn('flex items-center justify-center transition-colors rounded-full p-2', isHome && !scrolled ? 'text-white' : 'text-primary-container hover:bg-surface-container-low')}>
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface">
              <div className="flex flex-col gap-4 py-6">
                <Link href="/"><ArewaStayLogo /></Link>
                <nav className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors px-1 py-2">{item.label}</Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4">
                  {isLoggedIn ? (
                    <button onClick={handleSignOut} className="text-left font-label-md text-label-md text-on-surface-variant">Log out</button>
                  ) : (
                    <>
                      <Link href="/auth?tab=login" className="font-label-md text-label-md text-primary-container">{t('login')}</Link>
                      <Link href="/auth?tab=signup" className="font-title-md text-sm bg-primary-container text-on-primary px-5 py-2 rounded-full text-center">{t('signUp')}</Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/">
          <ArewaStayLogo variant={isHome && !scrolled ? 'light' : 'default'} />
        </Link>
      </div>

      {/* Compact search pill — condenses in once scrolled past the hero
          (or is simply always shown on non-home pages), matching the
          reference's scroll-compact pattern instead of a static, stretched bar. */}
      <button
        onClick={() => router.push('/listings')}
        className={cn(
          'hidden md:flex items-center gap-3 rounded-full border border-outline-variant/40 bg-surface px-1 py-1 shadow-sm hover:shadow-tubali transition-all',
          scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute'
        )}
      >
        <span className="pl-4 pr-3 font-label-md text-label-md text-on-surface">Anywhere</span>
        <span className="h-4 w-px bg-outline-variant/40" />
        <span className="px-3 font-label-md text-label-md text-on-surface-variant">Any week</span>
        <span className="h-4 w-px bg-outline-variant/40" />
        <span className="pl-3 pr-1 font-label-md text-label-md text-on-surface-variant">Add guests</span>
        <span className="bg-primary-container text-on-primary rounded-full h-8 w-8 flex items-center justify-center shrink-0">
          <Search className="h-3.5 w-3.5" />
        </span>
      </button>

      <div className="hidden md:flex items-center gap-1 flex-1 justify-end">
        <div className={isHome && !scrolled ? 'text-white [&_button]:text-white' : ''}>{languageMenu}</div>
        {combinedMenu}
      </div>
      <div className="md:hidden">{combinedMenu}</div>
    </header>
  );
};

export default Header;
