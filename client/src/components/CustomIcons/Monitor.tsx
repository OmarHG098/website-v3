interface MonitorProps {
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function Monitor({
  width = "88px",
  height = "79px",
  color = "#0097CD",
  style,
  className,
}: MonitorProps) {
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
      <rect x="4" y="4" width="72" height="48" rx="4" fill="white" stroke="black" strokeWidth="3"/>
      <rect x="4" y="4" width="72" height="40" fill={color}/>
      <rect x="4" y="4" width="72" height="40" stroke="black" strokeWidth="3"/>
      <rect x="32" y="52" width="16" height="8" fill="black"/>
      <rect x="24" y="60" width="32" height="6" rx="2" fill="black"/>
      <rect x="16" y="16" width="20" height="3" fill="white"/>
      <rect x="16" y="22" width="32" height="3" fill="white"/>
      <rect x="16" y="28" width="24" height="3" fill="#FFB718"/>
    </svg>
  );
}
