import type { FeaturesGridStatsTextCardSection } from "@shared/schema";
import { StatCard } from "@/components/molecules/StatCard";
import { Card } from "@/components/ui/card";

interface FeaturesGridStatsTextCardProps {
  data: FeaturesGridStatsTextCardSection;
}

export function FeaturesGridStatsTextCard({ data }: FeaturesGridStatsTextCardProps) {
  return (
    <section 
      className="py-section bg-primary/5"
      data-testid="section-features-grid-stats-text-card"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-center">
          <div className="flex flex-col gap-4 lg:min-w-[420px]">
            <div className="grid grid-cols-2 gap-6">
              {data.items.slice(0, 2).map((item, index) => {
                const itemId = item.id || `stat-${index}`;
                return (
                  <StatCard
                    key={itemId}
                    value={item.value}
                    title={item.title}
                    use_card={false}
                    card_color="bg-transparent"
                    size="small"
                    className="text-center"
                    data-testid={`stat-${itemId}`}
                  />
                );
              })}
            </div>
            {data.items.length > 2 && (
              <div className="flex justify-center">
                {data.items.slice(2, 3).map((item, index) => {
                  const itemId = item.id || `stat-${index + 2}`;
                  return (
                    <StatCard
                      key={itemId}
                      value={item.value}
                      title={item.title}
                      use_card={false}
                      card_color="bg-transparent"
                      size="small"
                      className="text-center"
                      data-testid={`stat-${itemId}`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <Card className={`p-6 lg:p-8 ${data.card_color || "bg-background"}`}>
            {data.title && (
              <h2 
                className="text-h2 mb-2 text-foreground"
                data-testid="text-stats-text-card-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p 
                className="text-lg mb-2 text-primary"
                data-testid="text-stats-text-card-subtitle"
              >
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p 
                className="text-body text-muted-foreground leading-relaxed"
                data-testid="text-stats-text-card-description"
              >
                {data.description}
              </p>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
