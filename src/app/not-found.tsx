import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-stack-lg">
      <section className="max-w-xl rounded-tubali border border-outline-variant/30 bg-surface p-stack-lg text-center shadow-sm">
        <Search className="mx-auto mb-stack-sm h-10 w-10 text-primary-container" />
        <h1 className="font-headline-md text-headline-md text-m3-primary">Page not found</h1>
        <p className="mt-stack-sm font-body-md text-on-surface-variant">
          This page may have moved, or the stay you are looking for is no longer available.
        </p>
        <Button asChild className="mt-stack-md rounded-full">
          <Link href="/listings">
            <Home className="mr-2 h-4 w-4" />
            Browse stays
          </Link>
        </Button>
      </section>
    </main>
  );
}
