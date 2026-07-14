import { ShieldCheck } from 'lucide-react';

export default function VerifiedHostBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium text-primary-container ${className ?? ''}`}>
      <ShieldCheck className="h-3.5 w-3.5 fill-primary-container/15" />
      Verified Host
    </span>
  );
}
