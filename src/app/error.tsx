'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-stack-lg">
      <section className="max-w-xl rounded-tubali border border-outline-variant/30 bg-surface p-stack-lg text-center shadow-sm">
        <AlertTriangle className="mx-auto mb-stack-sm h-10 w-10 text-destructive" />
        <h1 className="font-headline-md text-headline-md text-m3-primary">Something went wrong</h1>
        <p className="mt-stack-sm font-body-md text-on-surface-variant">
          We could not load this part of Arewa Stay. Please try again.
        </p>
        {error.digest && (
          <p className="mt-stack-sm font-label-sm text-label-sm text-on-surface-variant/70">
            Reference: {error.digest}
          </p>
        )}
        <Button type="button" onClick={reset} className="mt-stack-md rounded-full">
          Try again
        </Button>
      </section>
    </main>
  );
}
