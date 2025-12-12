import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface MetricItem {
  label: string;
  value: number;
  displayValue: string;
  color?: string;
}

interface YearGroup {
  year: string;
  metrics: MetricItem[];
}

interface VerticalBarsCardsData {
  type: "vertical_bars_cards";
  version?: string;
  title?: string;
  subtitle?: string;
  years: YearGroup[];
  background?: string;
}

interface VerticalBarsCardsProps {
  data: VerticalBarsCardsData;
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

export function VerticalBarsCards({ data }: VerticalBarsCardsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInitiallyVisible) {
      const handleScroll = () => {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, []);

  const metricMaxValues: Record<number, number> = {};
  if (data.years.length > 0) {
    const numMetrics = data.years[0].metrics.length;
    for (let i = 0; i < numMetrics; i++) {
      const valuesForMetric = data.years.map((y) => y.metrics[i]?.value || 0);
      metricMaxValues[i] = Math.max(...valuesForMetric);
    }
  }

  return (
    <section
      ref={containerRef}
      className={`py-16 md:py-24 ${data.background || "bg-background"}`}
      data-testid="section-vertical-bars-cards"
    >
      <div className="max-w-6xl mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className="text-center mb-12">
            {data.title && (
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                data-testid="text-vertical-bars-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p
                className="text-muted-foreground text-lg"
                data-testid="text-vertical-bars-subtitle"
              >
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.years.map((yearGroup, yearIndex) => (
            <Card
              key={yearGroup.year}
              className="p-6"
              data-testid={`card-year-${yearGroup.year}`}
            >
              <h3 className="text-xl font-bold text-foreground text-center mb-6">
                {yearGroup.year}
              </h3>

              <div className="flex justify-center items-end gap-4 h-48 mb-4">
                {yearGroup.metrics.map((metric, metricIndex) => {
                  const maxForThisMetric = metricMaxValues[metricIndex] || 1;
                  const percentage = (metric.value / maxForThisMetric) * 100;
                  const delay = yearIndex * 150 + metricIndex * 100;
                  const color =
                    metric.color || defaultColors[metricIndex % defaultColors.length];

                  return (
                    <div
                      key={metricIndex}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <div className="w-full h-40 bg-muted rounded-t-md flex items-end overflow-hidden">
                        <div
                          className="w-full rounded-t-md transition-all duration-1000 ease-out"
                          style={{
                            height: isVisible ? `${percentage}%` : "0%",
                            backgroundColor: color,
                            transitionDelay: `${delay}ms`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">
                        {metric.displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-4">
                {yearGroup.metrics.map((metric, metricIndex) => {
                  const color =
                    metric.color || defaultColors[metricIndex % defaultColors.length];
                  return (
                    <div
                      key={metricIndex}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="truncate">{metric.label}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
