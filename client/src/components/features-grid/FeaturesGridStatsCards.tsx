import type { FeaturesGridStatsCardsSection } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface FeaturesGridStatsCardsProps {
  data: FeaturesGridStatsCardsSection;
}

export function FeaturesGridStatsCards({ data }: FeaturesGridStatsCardsProps) {
  return (
    <section 
      className="py-section bg-muted/30"
      data-testid="section-features-grid-stats-cards"
    >
      <div className="max-w-6xl mx-auto px-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex items-center">
          <div className="flex flex-col gap-4 ">
            {data.items.map((item, index) => {
              const itemId = item.id || `stat-${index}`;
              return (
                <Card 
                  key={itemId}
                  className="items-center gap-2 rounded-card p-4"
                  data-testid={`card-stat-${itemId}`}
                >
                  <div className="text-h2 font-bold text-primary mb-1">
                    {item.value}
                  </div>
                  <div className="text-body text-foreground">
                    {item.title}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:pl-4">
            {data.title && (
              <h2 
                className="text-h2 mb-2 text-foreground"
                data-testid="text-stats-cards-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p 
                className="text-h4 mb-6 text-primary"
                data-testid="text-stats-cards-subtitle"
              >
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p 
                className="text-body text-muted-foreground leading-relaxed"
                data-testid="text-stats-cards-description"
              >
                {data.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
