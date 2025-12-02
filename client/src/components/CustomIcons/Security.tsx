interface SecurityProps {
  className?: string;
  size?: number;
}

export default function Security({ className = "", size = 48 }: SecurityProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Paste SVG path data here */}
    </svg>
  );
}
