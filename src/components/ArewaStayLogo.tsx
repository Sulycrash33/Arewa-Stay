import { cn } from "@/lib/utils";

const ArewaStayLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary p-2 rounded-md">
        {/* Compound-gate silhouette, referencing Kofar Mata (city gate) rather than a generic house icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 21V11C4 8 7 4 12 4C17 4 20 8 20 11V21"
            stroke="#D7A33B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 21V13H16V21"
            stroke="currentColor"
            className="text-primary-foreground"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-display text-xl font-semibold text-foreground tracking-tight">
        Arewa<span className="text-km-gold">Stay</span>
      </span>
    </div>
  );
};

export default ArewaStayLogo;
