interface MatplotlibProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Matplotlib({
  width = "88px",
  height = "88px",
  color,
  style,
  className,
}: MatplotlibProps) {
  return (
    <svg
      width={width}
      height={height}
      style={style}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PASTE YOUR SVG CONTENT HERE */}
    </svg>
  );
}
