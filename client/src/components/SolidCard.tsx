interface SolidCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function SolidCard({ children, className = "", ...props }: SolidCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-card rounded-md border-2 border-gray-400 shadow-[8px_8px_0px_0px_gray] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
