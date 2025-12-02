interface StatCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function StatCard({ children, className = "" }: StatCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-card rounded-md p-6 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
