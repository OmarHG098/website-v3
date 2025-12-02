interface CodeWindowProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function CodeWindow({
  width = "88px",
  height = "79px",
  color = "#0097CD",
  style,
  className,
}: CodeWindowProps) {
  return (
    <svg
      width={width || "88px"}
      height={height || "79px"}
      style={style}
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paste SVG path data here */}
    </svg>
  );
}
