import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LearningPathCardProps {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
}

export default function LearningPathCard({ title, description, icon, onClick }: LearningPathCardProps) {
  return (
    <Card 
      className="flex flex-col items-center justify-center min-h-[280px] p-6 text-center transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
      data-testid={`card-learning-path-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <img src={icon} alt={title} className="h-16 w-16 object-contain" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">{description}</p>
      <Button className="mt-auto" data-testid={`button-select-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        Select Path
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
}
