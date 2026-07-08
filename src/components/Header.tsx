'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, User, MessageSquare, ShieldCheck, LogOut, Search } from 'lucide-react';
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

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { profile, isLoggedIn, signOut } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = (
    <>
      <Link href="/listings" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors px-3 py-2">{t('exploreStays')}</Link>
      <Link href="/become-a-host" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors px-3 py-2">{t('becomeAHost')}</Link>
      <Link href="/about" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors px-3 py-2">{t('aboutUs')}</Link>
      <Link href="/contact" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors px-3 py-2">{t('contact')}</Link>
    </>
  );

  // Persistent language switcher pill — matches the reference spec exactly:
  // active segment gets a Deep Emerald tonal fill, inactive stay text-only.
  const languageSwitcher = (
    <div className="hidden md:flex bg-surface-container-low rounded-full p-1 tubali-shadow items-center">
      {(['en', 'ha', 'fr'] as const).map((code) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={cn(
            'font-label-md text-label-md px-4 py-1.5 rounded-full transition-all',
            language === code
              ? 'bg-primary-container text-on-primary active-pill-shadow'
              : 'text-primary-container hover:bg-surface-container-high'
          )}
        >
          {code === 'en' ? 'English' : code === 'ha' ? 'Hausa' : 'Français'}
        </button>
      ))}
    </div>
  );

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full overflow-hidden border border-outline-variant/30 hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? 'User'} />
            <AvatarFallback className="bg-primary-container text-on-primary">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{profile?.full_name || 'My Account'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/messages"><MessageSquare className="mr-2 h-4 w-4" /><span>Messages</span></Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile"><User className="mr-2 h-4 w-4" /><span>Profile</span></Link>
        </DropdownMenuItem>
        {profile?.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" /><span>Admin Panel</span></Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const guestButtons = (
    <>
      <Link href="/auth?tab=login" className="font-label-md text-label-md text-primary-container px-4 py-2">{t('login')}</Link>
      <Link href="/auth?tab=signup" className="font-title-md text-sm bg-primary-container text-on-primary px-5 py-2 rounded-full hover:opacity-90 active-pill-shadow transition-all">{t('signUp')}</Link>
    </>
  );

  return (
    <header className="sticky top-0 w-full z-40 flex justify-between items-center px-container-margin h-16 bg-surface border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Menu" className="flex items-center justify-center text-primary-container hover:bg-surface-container-low transition-colors rounded-full p-2">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface">
              <div className="flex flex-col gap-4 py-6">
                <Link href="/" className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-primary-container">Arewa Stay</Link>
                <nav className="flex flex-col gap-2">{navLinks}</nav>
                <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4">{isLoggedIn ? userMenu : guestButtons}</div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Link href="/" className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-primary-container">
          Arewa Stay
        </Link>
      </div>

      <nav className="hidden md:flex items-center">{navLinks}</nav>

      <div className="flex items-center gap-4">
        {languageSwitcher}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? userMenu : guestButtons}
        </div>
        <div className="md:hidden">{isLoggedIn && userMenu}</div>
      </div>
    </header>
  );
};

export default Header;
