interface FolderCheckProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function FolderCheck({
  width = 48,
  height = 48,
  color = "#1a1a1a",
  style,
  className,
}: FolderCheckProps) {
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
      <path d="M6 14C6 11.7909 7.79086 10 10 10H18L22 14H38C40.2091 14 42 15.7909 42 18V38C42 40.2091 40.2091 42 38 42H10C7.79086 42 6 40.2091 6 38V14Z" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M18 28L22 32L30 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
