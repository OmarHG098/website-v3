interface CurvedArrowSvgProps {
  className?: string;
}

export default function CurvedArrowSvg({ className = "" }: CurvedArrowSvgProps) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 20 5 
           C 35 10, 50 20, 55 35
           C 60 50, 50 55, 45 50
           C 40 45, 45 38, 52 42
           C 58 46, 55 55, 50 65
           C 45 80, 50 95, 50 105"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 42 98 L 50 110 L 58 98"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
