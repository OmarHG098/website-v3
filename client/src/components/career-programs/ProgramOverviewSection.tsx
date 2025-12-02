import { Card, CardContent } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import type { ProgramOverviewSection as ProgramOverviewSectionType } from "@shared/schema";
import type { ComponentType } from "react";

interface ProgramOverviewSectionProps {
  data: ProgramOverviewSectionType;
}

export function ProgramOverviewSection({ data }: ProgramOverviewSectionProps) {
  const getIcon = (iconName: string, size = 24, className = "text-primary") => {
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={size} className={className} /> : null;
  };

  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-program-overview"
    >
      <div className="max-w-6xl mx-auto px-4">
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

        {data.specs && data.specs.length > 0 && (
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            data-testid="program-specs"
          >
            {data.specs.map((spec, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50"
                data-testid={`spec-${index}`}
              >
                <div className="mb-2">
                  {getIcon(spec.icon, 28, "text-primary")}
                </div>
                <span className="text-lg font-bold text-foreground">{spec.value}</span>
                <span className="text-sm text-muted-foreground">{spec.label}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-6">
          {data.cards.map((card, index) => (
            <Card 
              key={index} 
              className="text-center hover-elevate"
              data-testid={`card-overview-${index}`}
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    {getIcon(card.icon, 28, "text-primary")}
                  </div>
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
