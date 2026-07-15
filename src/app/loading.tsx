import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Loader2 className="h-8 w-8 animate-spin text-m3-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
