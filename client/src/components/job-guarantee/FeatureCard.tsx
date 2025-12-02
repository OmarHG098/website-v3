interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FeatureCard({ children, className = "" }: FeatureCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-card rounded-md p-8 md:p-10 min-h-[200px] md:min-h-[240px] border-2 border-black shadow-[4px_4px_0px_0px_black] ${className}`}
    >
      {children}
    </div>
  );
}
