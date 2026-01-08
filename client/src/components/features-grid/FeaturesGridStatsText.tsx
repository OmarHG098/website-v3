import type { FeaturesGridStatsTextSection } from "@shared/schema";

interface FeaturesGridStatsTextProps {
  data: FeaturesGridStatsTextSection;
}

export function FeaturesGridStatsText({ data }: FeaturesGridStatsTextProps) {
  return (
    <section 
      className={`py-12 ${data.background || 'bg-primary/5'}`}
      data-testid="section-features-grid-stats-text"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-6">
            {data.items.map((item, index) => {
              const itemId = item.id || `stat-${index}`;
              return (
                <div 
                  key={itemId}
                  className="flex flex-col"
                  data-testid={`stat-item-${itemId}`}
                >
                  <span className="text-h2 text-primary font-bold">{item.value}</span>
                  <span className="text-body text-muted-foreground">{item.title}</span>
                </div>
              );
            })}
          </div>

          <div className="lg:pl-4">
            {data.title && (
              <h2 
                className="text-h2 mb-2 text-foreground"
                data-testid="text-stats-text-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p 
                className="text-lg mb-2 text-primary"
                data-testid="text-stats-text-subtitle"
              >
                {data.subtitle}
              </p>
            )}
            {data.description && (
              <p 
                className="text-body text-muted-foreground leading-relaxed"
                data-testid="text-stats-text-description"
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
