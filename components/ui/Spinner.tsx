const DIM = { sm: 20, md: 32, lg: 48 } as const;
type Size = keyof typeof DIM;

interface SpinnerProps {
  size?: Size;
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  const d = DIM[size];
  const c = d / 2;
  const r = d * 0.42;
  const sw = Math.max(1.5, d * 0.068);
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={d}
      height={d}
      viewBox={`0 0 ${d} ${d}`}
      fill="none"
      style={{ animationDuration: "0.7s" }}
      className={`animate-spin ${className}`}
      aria-hidden="true"
    >
      <circle
        cx={c}
        cy={c}
        r={r}
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth={sw}
      />
      <circle
        cx={c}
        cy={c}
        r={r}
        stroke="currentColor"
        strokeWidth={sw}
        strokeDasharray={`${circ * 0.72} ${circ * 0.28}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
      />
    </svg>
  );
}
