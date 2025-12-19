import { Card } from "@/components/ui/card";

export interface StatCardProps {
  value: string;
  title: string;
  use_card?: boolean;
  card_color?: string;
  className?: string;
}

export function StatCard({ 
  value, 
  title, 
  use_card = true, 
  card_color = "bg-primary/5",
  className = ""
}: StatCardProps) {
  const content = (
    <div className="font-inter">
      <div className="text-3xl font-bold text-primary mb-1">
        {value}
      </div>
      <div className="text-body text-foreground">
        {title}
      </div>
    </div>
  );

  if (use_card) {
    return (
      <Card className={`items-center gap-2 rounded-card p-4 ${card_color} ${className}`}>
        {content}
      </Card>
    );
  }

  return (
    <div className={`items-center gap-2 rounded-card p-4 ${card_color} ${className}`}>
      {content}
    </div>
  );
}
