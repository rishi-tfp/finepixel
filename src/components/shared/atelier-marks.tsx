/** Fine Pixel atelier marks — line drawings, not generic UI icons. */

type MarkProps = {
  className?: string;
};

export function MarkPaperGrain({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="14"
        y="10"
        width="36"
        height="44"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M22 22h20M22 30h16M22 38h18M22 46h12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M18 14c6 4 10-4 16 0s10-4 16 0"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

export function MarkFoilFinish({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M12 40 L32 12 L52 40 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M22 40 L32 24 L42 40"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M18 48h28"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MarkTwinWire({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M20 12v40M28 12v40"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {[18, 26, 34, 42, 50].map((y) => (
        <path
          key={y}
          d={`M20 ${y}c4-3 8-3 12 0`}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M36 16h14v32H36"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MarkMinimalLayout({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M20 24h24M20 32h14"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="44" cy="44" r="2" fill="currentColor" />
    </svg>
  );
}

export function MarkFoilStamp({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M18 46V22l14-8 14 8v24"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M26 30h12M29 36h6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M32 18v8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function MarkLoupe({ className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle
        cx="28"
        cy="28"
        r="14"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M38 38l12 12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M22 28h12M28 22v12"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
