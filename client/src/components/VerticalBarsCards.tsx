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
  description?: string;
  years: YearValue[];
}

interface VerticalBarsCardsData {
  type: "vertical_bars_cards";
  version?: string;
  title?: string;
  subtitle?: string;
  footer_description?: string;
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  const renderBars = (metric: MetricCard, metricIndex: number, compact: boolean = false) => {
    const maxValue = Math.max(...metric.years.map((y) => y.value));

    return (
      <div className={`flex justify-center items-end ${compact ? "gap-4" : "gap-6"} ${compact ? "h-32" : "h-44"} mb-4`}>
        {metric.years.map((yearData, yearIndex) => {
          const percentage = (yearData.value / maxValue) * 100;
          const delay = metricIndex * 150 + yearIndex * 100;
          const barColor = chartColors[yearIndex % chartColors.length];

          return (
            <div
              key={yearIndex}
              className="flex flex-col items-center gap-2"
            >
              <span className={`font-bold text-foreground ${compact ? "text-xs" : "text-sm"}`}>
                {yearData.displayValue}
              </span>
              <div className={`${compact ? "w-8 h-24" : "w-12 md:w-14 h-36"} bg-muted rounded-t-md flex items-end overflow-hidden`}>
                <div
                  className="w-full rounded-t-md transition-all duration-1000 ease-out"
                  style={{
                    height: isVisible ? `${percentage}%` : "0%",
                    backgroundColor: barColor,
                    transitionDelay: `${delay}ms`,
                  }}
                />
              </div>
              <span className={`font-medium text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
                {yearData.year}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

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

        {/* Cards container */}
        <div 
          className="relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Expanded overlay - appears on top when a card is hovered */}
          <div 
            className={`absolute inset-0 z-20 transition-opacity duration-300 pointer-events-none ${
              hoveredIndex !== null ? "opacity-100" : "opacity-0"
            }`}
          >
            {hoveredIndex !== null && data.metrics[hoveredIndex] && (
              <Card
                className="w-full h-full p-8 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
                data-testid={`card-metric-expanded-${hoveredIndex}`}
              >
                <div className="flex flex-col lg:flex-row items-center gap-8 h-full">
                  {/* Left side: Graph (compact) */}
                  <div className="flex flex-col items-center lg:w-2/5 flex-shrink-0">
                    <h3 className="text-xl font-bold text-foreground text-center mb-2">
                      {data.metrics[hoveredIndex].title}
                    </h3>
                    {data.metrics[hoveredIndex].unit && (
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {data.metrics[hoveredIndex].unit}
                      </p>
                    )}
                    {renderBars(data.metrics[hoveredIndex], hoveredIndex, false)}
                  </div>

                  {/* Right side: Description */}
                  <div className="lg:w-3/5 flex flex-col justify-center">
                    {data.metrics[hoveredIndex].description && (
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {data.metrics[hoveredIndex].description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Base grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.metrics.map((metric, metricIndex) => {
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== metricIndex;
              const isHovered = hoveredIndex === metricIndex;

              return (
                <Card
                  key={metricIndex}
                  className={`p-6 transition-all duration-300 ease-out cursor-pointer ${
                    isOtherHovered || isHovered
                      ? "opacity-0 scale-95" 
                      : "opacity-100 scale-100"
                  }`}
                  onMouseEnter={() => setHoveredIndex(metricIndex)}
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
                  {renderBars(metric, metricIndex)}
                </Card>
              );
            })}
          </div>
        </div>

        {data.footer_description && (
          <p className="text-base text-muted-foreground leading-relaxed italic text-center mt-8 max-w-3xl mx-auto">
            {data.footer_description}
          </p>
        )}
      </div>
    </section>
  );
}
