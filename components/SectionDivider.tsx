type Props = {
  /** Fond sombre sous le séparateur (ex. avant Portfolio navy) */
  onDark?: boolean;
  className?: string;
};

/**
 * Séparation entre sections — diagonale « route » + angle « toit »
 * issus du pictogramme ALLIANCE M.O BTP, dégradé navy → vert discret.
 */
export default function SectionDivider({ onDark = false, className = "" }: Props) {
  const id = onDark ? "sec-div-dark" : "sec-div-light";

  return (
    <div
      className={`relative z-[1] h-10 w-full overflow-hidden md:h-12 ${className}`}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={onDark ? "#1a5f8a" : "#0b4372"}
              stopOpacity={onDark ? 0.45 : 0.28}
            />
            <stop
              offset="55%"
              stopColor="#19862b"
              stopOpacity={onDark ? 0.35 : 0.22}
            />
            <stop
              offset="100%"
              stopColor="#1fa336"
              stopOpacity={onDark ? 0.2 : 0.12}
            />
          </linearGradient>
        </defs>

        {/* Trame fine sous-jacente */}
        <line
          x1="0"
          y1="24"
          x2="1440"
          y2="24"
          stroke={onDark ? "rgba(255,255,255,0.06)" : "rgba(11,67,114,0.06)"}
          strokeWidth="1"
        />

        {/* Diagonale type route / perspective */}
        <path
          d="M0 38 L520 18 L760 28 L1440 8"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Marquage parallèle (bande blanche de chaussée) */}
        <path
          d="M40 40 L540 22 L780 32 L1400 12"
          fill="none"
          stroke={onDark ? "rgba(255,255,255,0.12)" : "rgba(11,67,114,0.1)"}
          strokeWidth="1"
          strokeDasharray="6 10"
          strokeLinecap="round"
        />
        {/* Angle de toit — chevron */}
        <path
          d="M680 36 L760 14 L840 36"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="1.5"
          strokeLinejoin="miter"
          strokeLinecap="square"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
