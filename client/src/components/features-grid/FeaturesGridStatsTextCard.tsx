import { useState, useEffect } from "react";
import type { FeaturesGridStatsTextCardSection } from "@shared/schema";
import { StatCard } from "@/components/molecules/StatCard";
import { Card } from "@/components/ui/card";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface FeaturesGridStatsTextCardProps {
  data: FeaturesGridStatsTextCardSection;
}

export function FeaturesGridStatsTextCard({ data }: FeaturesGridStatsTextCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStatIndex, setSelectedStatIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <section 
      className="py-8 md:py-section bg-primary/5"
      data-testid="section-features-grid-stats-text-card"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 md:items-center">
          <div className="flex flex-col gap-4 md:w-[280px] lg:w-[420px] md:flex-shrink-0">
            <div className="grid grid-cols-2 gap-6">
              {data.items.slice(0, 2).map((item, index) => {
                const itemId = item.id || `stat-${index}`;
                const isSelected = selectedStatIndex === index;
                return (
                  <div
                    key={itemId}
                    onClick={() => !isDesktop && setSelectedStatIndex(index)}
                    onMouseEnter={() => isDesktop && setSelectedStatIndex(index)}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      !isDesktop && isSelected && "scale-110",
                      !isDesktop && !isSelected && "opacity-60"
                    )}
                  >
                    <StatCard
                      value={item.value}
                      title={item.title}
                      use_card={false}
                      card_color="bg-transparent"
                      size="small"
                      className="text-center"
                      data-testid={`stat-${itemId}`}
                    />
                  </div>
                );
              })}
            </div>
            {data.items.length > 2 && (
              <div className="flex justify-center">
                {data.items.slice(2, 3).map((item, index) => {
                  const itemId = item.id || `stat-${index + 2}`;
                  const actualIndex = index + 2;
                  const isSelected = selectedStatIndex === actualIndex;
                  return (
                    <div
                      key={itemId}
                      onClick={() => !isDesktop && setSelectedStatIndex(actualIndex)}
                      onMouseEnter={() => isDesktop && setSelectedStatIndex(actualIndex)}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        !isDesktop && isSelected && "scale-110",
                        !isDesktop && !isSelected && "opacity-60"
                      )}
                    >
                      <StatCard
                        value={item.value}
                        title={item.title}
                        use_card={false}
                        card_color="bg-transparent"
                        size="small"
                        className="text-center"
                        data-testid={`stat-${itemId}`}
                      />
                    </div>
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
          </Card>
        </div>
      </div>
    </section>
  );
}
