interface ChecklistVerifyProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function ChecklistVerify({
  width = 48,
  height = 48,
  color = "#1a1a1a",
  style,
  className,
}: ChecklistVerifyProps) {
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
      <rect x="8" y="4" width="32" height="40" rx="3" stroke={color} strokeWidth="2.5" fill="none" />
      <circle cx="16" cy="16" r="3" stroke={color} strokeWidth="2" fill="none" />
      <path d="M14 16L15.5 17.5L18 14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="24" y1="16" x2="34" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="26" r="3" stroke={color} strokeWidth="2" fill="none" />
      <path d="M14 26L15.5 27.5L18 24.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="24" y1="26" x2="34" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="36" r="3" stroke={color} strokeWidth="2" fill="none" />
      <line x1="24" y1="36" x2="34" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
