'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import ArewaStayLogo from './ArewaStayLogo';
import { Menu, Globe, User, MessageSquare, ShieldCheck, LogOut } from 'lucide-react';
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

const Header = () => {
  const { t, setLanguage } = useLanguage();
  const { profile, isLoggedIn, signOut } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = (
    <>
      <Button variant="ghost" asChild><Link href="/listings">{t('exploreStays')}</Link></Button>
      <Button variant="ghost" asChild><Link href="/become-a-host">{t('becomeAHost')}</Link></Button>
      <Button variant="ghost" asChild><Link href="/about">{t('aboutUs')}</Link></Button>
      <Button variant="ghost" asChild><Link href="/contact">{t('contact')}</Link></Button>
    </>
  );

  const languageSelector = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ha')}>Hausa</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')}>Français</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const userMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? 'User'} />
            <AvatarFallback className="bg-km-primary text-foreground">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
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
      <Button variant="ghost" asChild><Link href="/auth?tab=login">{t('login')}</Link></Button>
      <Button asChild className="bg-km-gold text-km-bg hover:bg-km-gold/90"><Link href="/auth?tab=signup">{t('signUp')}</Link></Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/"><ArewaStayLogo /></Link>

        <nav className="hidden md:flex items-center gap-2">{navLinks}</nav>

        <div className="hidden md:flex items-center gap-2">
          {languageSelector}
          {isLoggedIn ? userMenu : guestButtons}
        </div>

        <div className="md:hidden flex items-center gap-1">
          {languageSelector}
          {isLoggedIn ? userMenu : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background">
                <div className="flex flex-col gap-4 py-6">
                  <Link href="/"><ArewaStayLogo /></Link>
                  <nav className="flex flex-col gap-2">{navLinks}</nav>
                  <div className="flex flex-col gap-2 border-t border-border pt-4">{guestButtons}</div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
