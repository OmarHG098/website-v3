interface FeatureCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FeatureCard({ children, className = "" }: FeatureCardProps) {
  return (
    <div 
      className={`bg-white dark:bg-card rounded-md p-8 md:p-10 md:min-h-[240px] border-2 border-black shadow-[8px_8px_0px_0px_black] ${className}`}
    >
      {children}
    </div>
  );
}
