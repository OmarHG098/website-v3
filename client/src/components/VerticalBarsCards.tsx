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

  // Determine panel direction based on card position
  const getPanelDirection = (index: number, total: number): "right" | "left" => {
    if (index === total - 1) return "left";
    return "right";
  };

  const renderBars = (metric: MetricCard, metricIndex: number) => {
    const maxValue = Math.max(...metric.years.map((y) => y.value));

    return (
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
    );
  };

  return (
    <section
      ref={containerRef}
      className={`py-16 md:py-24 ${data.background || "bg-background"}`}
      data-testid="section-vertical-bars-cards"
    >
      <div className="max-w-6xl mx-auto px-4 overflow-visible">
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

        {/* Cards container - overflow visible to allow panels to show */}
        <div className="overflow-visible">
          {/* Base grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
            {data.metrics.map((metric, metricIndex) => {
              const isHovered = hoveredIndex === metricIndex;
              const isOtherHovered = hoveredIndex !== null && hoveredIndex !== metricIndex;
              const panelDirection = getPanelDirection(metricIndex, data.metrics.length);

              return (
                <div
                  key={metricIndex}
                  className="relative overflow-visible"
                  style={{ zIndex: isHovered ? 20 : 1 }}
                  onMouseEnter={() => setHoveredIndex(metricIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* The original card - always stays in place */}
                  <Card
                    className={`p-6 transition-all duration-300 ease-out cursor-pointer h-full overflow-visible ${
                      isOtherHovered
                        ? "opacity-20 scale-95 pointer-events-none" 
                        : "opacity-100"
                    } ${isHovered ? "shadow-lg ring-2 ring-primary/20" : ""}`}
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

                  {/* Sliding panel - positioned OUTSIDE the card as a sibling */}
                  {metric.description && (
                    <aside
                      className={`absolute top-0 h-full transition-all duration-300 ease-out pointer-events-none ${
                        panelDirection === "right" 
                          ? "left-full ml-3" 
                          : "right-full mr-3"
                      }`}
                      style={{
                        width: isHovered ? "280px" : "0px",
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered 
                          ? "translateX(0)" 
                          : panelDirection === "right" 
                            ? "translateX(-20px)" 
                            : "translateX(20px)",
                      }}
                    >
                      <Card 
                        className="h-full p-5 flex items-center pointer-events-auto"
                        data-testid={`card-metric-panel-${metricIndex}`}
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {metric.description}
                        </p>
                      </Card>
                    </aside>
                  )}
                </div>
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
