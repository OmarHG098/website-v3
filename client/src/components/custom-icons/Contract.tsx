interface ContractProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Contract({
  width = "64px",
  height = "64px",
  color = "#0097CD",
  style,
  className,
}: ContractProps) {
  return (
    <svg
      width={width || "64px"}
      height={height || "64px"}
      style={style}
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paste SVG content here */}
    </svg>
  );
}
