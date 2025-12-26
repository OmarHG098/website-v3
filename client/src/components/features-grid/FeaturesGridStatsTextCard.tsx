import { useState } from "react";
import type { FeaturesGridStatsTextCardSection } from "@shared/schema";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { IconChevronDown } from "@tabler/icons-react";
import { SystemCoreDiagram } from "@/components/SystemCoreDiagram";

interface FeaturesGridStatsTextCardProps {
  data: FeaturesGridStatsTextCardSection;
}

export function FeaturesGridStatsTextCard({ data }: FeaturesGridStatsTextCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section 
      className="bg-primary/5"
      data-testid="section-features-grid-stats-text-card"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-center">
          <div className="flex flex-col gap-4 md:w-[280px] lg:w-[420px] md:flex-shrink-0">
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

          <Card className={`p-6 md:p-8 ${data.card_color || "bg-background"}`}>
            <div 
              className="md:cursor-default cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-description"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
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
                </div>
                {data.description && (
                  <IconChevronDown 
                    className={`md:hidden w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            </div>
            {data.description && (
              <div className={`overflow-hidden transition-all duration-200 md:max-h-none md:opacity-100 ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 md:mt-0'}`}>
                <p 
                  className="text-body text-muted-foreground leading-relaxed"
                  data-testid="text-stats-text-card-description"
                >
                  {data.description}
                </p>
              </div>
            )}
            <SystemCoreDiagram className="mt-4 hidden md:block" />
          </Card>
        </div>
      </div>
    </section>
  );
}
