import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="font-title-md text-display-sm text-foreground">404</h1>
        <h2 className="font-title-md text-title-lg text-foreground">
          Page not found
        </h2>
        <p className="max-w-md text-on-surface-variant">
          The page you're looking for doesn't exist or may have been
          moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
