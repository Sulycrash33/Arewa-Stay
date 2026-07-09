export default function HeroIllustration() {
  return (
<svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#001a1c"/>
      <stop offset="55%" stopColor="#0F5257"/>
      <stop offset="100%" stopColor="#2b676c"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35"/>
      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="600" fill="url(#skyGrad)"/>
  <ellipse cx="900" cy="120" rx="380" ry="220" fill="url(#glow)"/>

  <g fill="#04292c" opacity="0.9">
    <rect x="0" y="380" width="1200" height="220"/>
    <rect x="40" y="330" width="60" height="70"/>
    <path d="M60 330 a20 20 0 0 1 40 0 Z"/>
    <rect x="150" y="300" width="40" height="100"/>
    <circle cx="170" cy="290" r="18"/>
    <rect x="250" y="340" width="90" height="60"/>
    <polygon points="250,340 295,300 340,340"/>
    <rect x="420" y="310" width="50" height="90"/>
    <circle cx="445" cy="300" r="16"/>
    <rect x="1000" y="320" width="60" height="80"/>
    <circle cx="1030" cy="310" r="18"/>
    <rect x="1100" y="350" width="70" height="50"/>
    <polygon points="1100,350 1135,315 1170,350"/>
  </g>

  <g fill="#021d1f">
    <rect x="0" y="440" width="1200" height="160"/>
    <rect x="60" y="200" width="140" height="260"/>
    <path d="M130 130 C90 130 90 200 90 200 L170 200 C170 200 170 130 130 130 Z"/>
    <polygon points="105,130 130,80 155,130"/>
    <rect x="1000" y="200" width="140" height="260"/>
    <path d="M1070 130 C1030 130 1030 200 1030 200 L1110 200 C1110 200 1110 130 1070 130 Z"/>
    <polygon points="1045,130 1070,80 1095,130"/>
    <rect x="260" y="260" width="680" height="200"/>
    <path d="M600 260 C480 260 460 340 460 380 L740 380 C740 340 720 260 600 260 Z" fill="#0F5257"/>
    <g>
      <rect x="70" y="190" width="16" height="24"/>
      <rect x="100" y="190" width="16" height="24"/>
      <rect x="175" y="190" width="16" height="24"/>
      <rect x="1010" y="190" width="16" height="24"/>
      <rect x="1040" y="190" width="16" height="24"/>
      <rect x="1115" y="190" width="16" height="24"/>
    </g>
  </g>

  <g fill="#D4AF37" opacity="0.85">
    <circle cx="300" cy="380" r="4"/>
    <circle cx="380" cy="360" r="4"/>
    <circle cx="820" cy="360" r="4"/>
    <circle cx="900" cy="380" r="4"/>
    <circle cx="130" cy="420" r="4"/>
    <circle cx="1070" cy="420" r="4"/>
  </g>

  <g transform="translate(870,340)" fill="#010f10">
    <ellipse cx="0" cy="90" rx="70" ry="14" opacity="0.3"/>
    <path d="M-60 70 C-65 40 -50 10 -20 5 L40 5 C55 5 70 20 68 40 L64 75 L48 75 L46 55 L-10 58 L-14 75 L-30 75 Z"/>
    <path d="M-20 5 C-25 -20 -10 -40 15 -40 C30 -40 38 -28 36 -15 L20 -15 L18 5 Z"/>
    <path d="M4 -55 C-6 -55 -10 -46 -6 -40 L20 -40 C22 -48 14 -55 4 -55 Z"/>
    <path d="M-6 -70 L2 -50 M6 -70 L10 -50" stroke="#010f10" strokeWidth="4"/>
  </g>
</svg>
  );
}
