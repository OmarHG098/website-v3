import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface YearValue {
  year: string;
  value: number;
  displayValue: string;
}

interface MetricCard {
  title: string;
  icon?: string;
  unit?: string;
  years: YearValue[];
}

interface VerticalBarsCardsData {
  type: "vertical_bars_cards";
  version?: string;
  title?: string;
  subtitle?: string;
  metrics: MetricCard[];
  background?: string;
}

interface VerticalBarsCardsProps {
  data: VerticalBarsCardsData;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function VerticalBarsCards({ data }: VerticalBarsCardsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let hasScrolled = false;
    let isInView = false;

    const checkAndTrigger = () => {
      if (hasScrolled && isInView) {
        setIsVisible(true);
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };

    const onScroll = () => {
      hasScrolled = true;
      checkAndTrigger();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (isInView) {
            checkAndTrigger();
          }
        });
      },
      { threshold: 0.2 }
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.metrics.map((metric, metricIndex) => {
            const maxValue = Math.max(...metric.years.map((y) => y.value));

            return (
              <Card
                key={metricIndex}
                className="p-6"
                data-testid={`card-metric-${metricIndex}`}
              >
                <h3 className="text-lg font-bold text-foreground text-center mb-2">
                  {metric.title}
                </h3>
                {metric.unit && (
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    {metric.unit}
                  </p>
                )}

                <div className="flex justify-center items-end gap-6 h-44 mb-4">
                  {metric.years.map((yearData, yearIndex) => {
                    const percentage = (yearData.value / maxValue) * 100;
                    const delay = metricIndex * 150 + yearIndex * 100;
                    const barColor = chartColors[yearIndex % chartColors.length];

                    return (
                      <div
                        key={yearIndex}
                        className="flex flex-col items-center gap-2"
                      >
                        <span className="text-sm font-bold text-foreground">
                          {yearData.displayValue}
                        </span>
                        <div className="w-12 md:w-14 h-36 bg-muted rounded-t-md flex items-end overflow-hidden">
                          <div
                            className="w-full rounded-t-md transition-all duration-1000 ease-out"
                            style={{
                              height: isVisible ? `${percentage}%` : "0%",
                              backgroundColor: barColor,
                              transitionDelay: `${delay}ms`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {yearData.year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
