interface RocketProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Rocket({
  width = "88px",
  height = "88px",
  color = "#0097CD",
  style,
  className,
}: RocketProps) {
  return (
    <svg
      width={width}
      height={height}
      style={style}
      className={className}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PASTE YOUR SVG PATHS HERE */}
      <rect width="88" height="88" fill={color} fillOpacity="0.1" rx="8" />
      <text x="44" y="48" textAnchor="middle" fill={color} fontSize="10">Rocket</text>
    </svg>
  );
}
