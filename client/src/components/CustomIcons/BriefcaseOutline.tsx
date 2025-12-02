interface BriefcaseOutlineProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function BriefcaseOutline({
  width = 48,
  height = 48,
  color = "#1a1a1a",
  style,
  className,
}: BriefcaseOutlineProps) {
  return (
    <svg
      width={width}
      height={height}
      style={style}
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* TODO: Replace with actual SVG path from user */}
      <rect x="4" y="14" width="40" height="28" rx="3" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M16 14V10C16 7.79086 17.7909 6 20 6H28C30.2091 6 32 7.79086 32 10V14" stroke={color} strokeWidth="2.5" fill="none" />
      <line x1="4" y1="26" x2="44" y2="26" stroke={color} strokeWidth="2.5" />
      <rect x="20" y="22" width="8" height="8" rx="1" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  );
}
