import { cn } from '@/lib/utils';

const ArewaStayLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary-container p-1.5 rounded-tubali">
        {/* Gateway + zanko-finial mark, recolored to the Heritage Hospitality palette */}
        <svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 12 L21 6 L24 12 Z" fill="#D4AF37" />
          <path d="M40 12 L43 6 L46 12 Z" fill="#D4AF37" />
          <path d="M29 9 L32 2 L35 9 Z" fill="#D4AF37" />
          <path d="M16 54 V32 C16 20 23 12 32 12 C41 12 48 20 48 32 V54 Z" fill="#D4AF37" />
          <path d="M25 54 V33 C25 26 28 21 32 21 C36 21 39 26 39 33 V54 Z" fill="#0F5257" />
        </svg>
      </div>
      <span className="font-headline-lg-mobile text-headline-lg-mobile font-semibold text-m3-primary tracking-tight">
        Arewa<span className="text-ochre-gold">Stay</span>
      </span>
    </div>
  );
};

export default ArewaStayLogo;
