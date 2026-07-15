import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h2 className="font-title-md text-title-lg text-foreground">
          Listing not found
        </h2>
        <p className="max-w-md text-on-surface-variant">
          This stay may have been removed or is no longer available.
        </p>
      </div>
      <Button asChild>
        <Link href="/listings">Browse all stays</Link>
      </Button>
    </div>
  );
}
