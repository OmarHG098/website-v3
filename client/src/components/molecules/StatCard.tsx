import { Card } from "@/components/ui/card";

export interface StatCardProps {
  value: string;
  title: string;
  use_card?: boolean;
  card_color?: string;
  className?: string;
}

function formatValueWithUnit(value: string) {
  const match = value.match(/^(\$?)([0-9.,]+)([A-Za-z%x]+)?(-)?(\$?)([0-9.,]+)?([A-Za-z%x]+)?$/);
  
  if (!match) {
    return <>{value}</>;
  }

  const [, prefix1, num1, unit1, separator, prefix2, num2, unit2] = match;

  return (
    <>
      {prefix1 && <span>{prefix1}</span>}
      <span>{num1}</span>
      {unit1 && <span className="text-2xl">{unit1}</span>}
      {separator && <span>{separator}</span>}
      {prefix2 && <span>{prefix2}</span>}
      {num2 && <span>{num2}</span>}
      {unit2 && <span className="text-2xl">{unit2}</span>}
    </>
  );
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
      <div className="text-5xl font-bold text-primary">
        {formatValueWithUnit(value)}
      </div>
      <div className="text-sm text-foreground">
        {title}
      </div>
    </div>
  );

  if (use_card) {
    return (
      <Card className={`items-center gap-2 rounded-card px-8 py-4 ${card_color} ${className}`}>
        {content}
      </Card>
    );
  }

  return (
    <div className={`items-center gap-2 rounded-card px-8 py-4 ${card_color} ${className}`}>
      {content}
    </div>
  );
}
