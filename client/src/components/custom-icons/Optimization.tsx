interface OptimizationProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Optimization({
  width = "88px",
  height = "88px",
  color,
  style,
  className,
}: OptimizationProps) {
  return (
    <svg
      width={width}
      height={height}
      style={style}
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PASTE YOUR SVG CODE HERE - replace this placeholder */}
      <rect x="156" y="156" width="200" height="200" fill={color || "currentColor"} opacity="0.3" />
      <text x="256" y="270" textAnchor="middle" fill={color || "currentColor"} fontSize="48">?</text>
    </svg>
  );
}
