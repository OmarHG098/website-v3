interface SecurityProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Security({
  width = "88px",
  height = "79px",
  color = "#0097CD",
  style,
  className,
}: SecurityProps) {
  return (
    <svg
      width={width || "88px"}
      height={height || "79px"}
      style={style}
      className={className}
      viewBox="0 0 88 79"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paste SVG path data here */}
    </svg>
  );
}
