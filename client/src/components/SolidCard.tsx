interface SolidCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function SolidCard({ children, className = "", ...props }: SolidCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-card rounded-md border-2 border-[#6B6B6B] shadow-[8px_8px_0px_0px_#6B6B6B] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
