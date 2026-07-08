export default function DagiLoader({ label, sublabel }: { label?: string; sublabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-stack-lg py-stack-lg">
      <div className="relative w-32 h-32 flex justify-center items-center">
        <div className="absolute inset-0 rounded-full border border-tertiary-fixed-dim/40 animate-dagi-pulse" />
        <div className="absolute inset-4 rounded-full border border-primary-container/20 animate-dagi-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="relative z-10 text-primary-container animate-dagi-spin">
          <svg className="stroke-current" fill="none" height="64" viewBox="0 0 100 100" width="64" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L90 50 L50 90 L10 50 Z" strokeLinejoin="round" strokeWidth="4" />
            <path d="M20 20 L80 80 M80 20 L20 80" strokeLinecap="round" strokeWidth="4" />
            <circle cx="50" cy="50" r="15" strokeWidth="4" />
          </svg>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="space-y-stack-sm">
          {label && <p className="font-title-md text-title-md text-m3-primary">{label}</p>}
          {sublabel && <p className="font-body-md text-body-md text-on-surface-variant opacity-80">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
