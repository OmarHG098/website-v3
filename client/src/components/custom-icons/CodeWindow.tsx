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
      viewBox="0 0 80 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="8" width="80" height="64" rx="4" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="0" y="8" width="80" height="16" fill="#FFB718"/>
      <rect x="0" y="8" width="80" height="16" stroke="black" strokeWidth="3"/>
      <circle cx="12" cy="16" r="3" fill={color}/>
      <circle cx="24" cy="16" r="3" fill={color}/>
      <text x="40" y="52" textAnchor="middle" fontSize="20" fontWeight="bold" fill="black">&lt;/&gt;</text>
    </svg>
  );
}
