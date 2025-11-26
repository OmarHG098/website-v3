import { Card, CardContent } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import type { ProgramOverviewSection as ProgramOverviewSectionType } from "@shared/schema";
import type { ComponentType } from "react";

interface ProgramOverviewSectionProps {
  data: ProgramOverviewSectionType;
}

export function ProgramOverviewSection({ data }: ProgramOverviewSectionProps) {
  const getIcon = (iconName: string) => {
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={32} className="text-primary" /> : null;
  };

  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-program-overview"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            data-testid="text-overview-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-overview-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {data.cards.map((card, index) => (
            <Card 
              key={index} 
              className="text-center p-6 hover-elevate"
              data-testid={`card-overview-${index}`}
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {getIcon(card.icon)}
                </div>
                <h3 
                  className="text-xl font-semibold mb-2 text-foreground"
                  data-testid={`text-overview-card-title-${index}`}
                >
                  {card.title}
                </h3>
                <p 
                  className="text-muted-foreground"
                  data-testid={`text-overview-card-desc-${index}`}
                >
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
