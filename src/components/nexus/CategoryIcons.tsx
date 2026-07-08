/**
 * Category glyphs — cyan-accented, technical, restrained.
 * Rendered as inline SVGs so they inherit currentColor and stay crisp.
 */

type Props = { className?: string; strokeWidth?: number };

const base = "w-6 h-6 md:w-7 md:h-7";

const S = ({ children, className = "", strokeWidth = 1.4 }: Props & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${base} ${className}`}
    aria-hidden
  >
    {children}
  </svg>
);

const glyphs = {
  user: (p: Props) => (
    <S {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M4.5 20c1.6-4 4.6-5.6 7.5-5.6S18 16 19.5 20" />
    </S>
  ),
  flag: (p: Props) => (
    <S {...p}>
      <path d="M5 3v18" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </S>
  ),
  folder: (p: Props) => (
    <S {...p}>
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h9A1.5 1.5 0 0 1 21 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6.5Z" />
    </S>
  ),
  certificate: (p: Props) => (
    <S {...p}>
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.2" />
      <path d="M7 9h10M7 12h6" />
      <path d="M9 16.5l-1 4 3-1.5 3 1.5-1-4" />
    </S>
  ),
  portfolio: (p: Props) => (
    <S {...p}>
      <rect x="3.5" y="6" width="17" height="13" rx="1.2" />
      <path d="M9 6V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6" />
      <path d="M3.5 12h17" />
    </S>
  ),
  mail: (p: Props) => (
    <S {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.2" />
      <path d="M3.5 7.5l8.5 6 8.5-6" />
    </S>
  ),
  signal: (p: Props) => (
    <S {...p}>
      <path d="M4 15l3-3 3 3 4-6 3 4 3-2" />
      <path d="M3 20h18" />
    </S>
  ),
  canon: (p: Props) => (
    <S {...p}>
      <path d="M4 4.5h11a3 3 0 0 1 3 3V20" />
      <path d="M4 4.5V20h14" />
      <path d="M7.5 8.5h7M7.5 12h7M7.5 15.5h5" />
    </S>
  ),
  wave: (p: Props) => (
    <S {...p}>
      <path d="M2.5 12c1.5-4 3-4 4.5 0s3 4 4.5 0 3-4 4.5 0 3 4 4.5 0" />
      <path d="M2.5 17h19" />
    </S>
  ),
  chart: (p: Props) => (
    <S {...p}>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <rect x="7" y="12" width="2.5" height="6" />
      <rect x="11.5" y="8" width="2.5" height="10" />
      <rect x="16" y="14" width="2.5" height="4" />
    </S>
  ),
  grant: (p: Props) => (
    <S {...p}>
      <rect x="4" y="3.5" width="13" height="17" rx="1" />
      <path d="M7 8h7M7 11h7M7 14h5" />
      <path d="M17 15l3 3-3 3-1.5-1.5" />
    </S>
  ),
  check: (p: Props) => (
    <S {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.5l2.7 2.7L16 9.5" />
    </S>
  ),
  video: (p: Props) => (
    <S {...p}>
      <rect x="3" y="6" width="14" height="12" rx="1.2" />
      <path d="M17 10l4-2v8l-4-2" />
    </S>
  ),
  brief: (p: Props) => (
    <S {...p}>
      <rect x="4" y="4" width="16" height="16" rx="1.2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </S>
  ),
  grid: (p: Props) => (
    <S {...p}>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </S>
  ),
  vault: (p: Props) => (
    <S {...p}>
      <rect x="3" y="4" width="18" height="16" rx="1.2" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 12l3-3" />
      <path d="M6 8v-1M6 17v-1M18 8v-1M18 17v-1" />
    </S>
  ),
  shield: (p: Props) => (
    <S {...p}>
      <path d="M12 3l8 3v6c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V6l8-3Z" />
      <path d="M9 12l2.2 2.2L15 10.5" />
    </S>
  ),
};

export type CategoryIconName = keyof typeof glyphs;

interface IconProps { name: string; className?: string }

export const CategoryIcon = ({ name, className }: IconProps) => {
  const g = (glyphs as Record<string, (p: Props) => JSX.Element>)[name];
  if (!g) return glyphs.grid({ className });
  return g({ className });
};
