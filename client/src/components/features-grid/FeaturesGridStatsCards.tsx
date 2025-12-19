import type { FeaturesGridStatsCardsSection } from "@shared/schema";

interface FeaturesGridStatsCardsProps {
  data: FeaturesGridStatsCardsSection;
}

export function FeaturesGridStatsCards({ data }: FeaturesGridStatsCardsProps) {
  return (
    <section 
      className="py-section"
      data-testid="section-features-grid-stats-cards"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-4">
            {data.items.map((item, index) => {
              const itemId = item.id || `stat-${index}`;
              return (
                <div 
                  key={itemId}
                  className="bg-primary/20 rounded-card p-6"
                  data-testid={`card-stat-${itemId}`}
                >
                  <div className="text-h2 font-bold text-foreground mb-1">
                    {item.value}
                  </div>
                  <div className="text-body text-foreground">
                    {item.title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:pl-4">
            {data.title && (
              <h2 
                className="text-h2 mb-6 text-foreground"
                data-testid="text-stats-cards-title"
              >
                {data.title}
              </h2>
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
