interface SolidCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SolidCard({ children, className = "" }: SolidCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-card rounded-md p-5 md:p-10 border-2 border-black shadow-[8px_8px_0px_0px_black] ${className}`}
    >
      {children}
    </div>
  );
}
