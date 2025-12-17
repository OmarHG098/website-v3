import { useEffect, useRef, useState, useCallback } from "react";
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

interface CardRect {
  left: number;
  top: number;
  width: number;
  height: number;
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
  const [cardRects, setCardRects] = useState<CardRect[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measure card positions relative to grid container
  const measureCards = useCallback(() => {
    if (!gridRef.current) return;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    setContainerWidth(gridRect.width);
    
    const rects: CardRect[] = cardRefs.current.map((cardEl) => {
      if (!cardEl) return { left: 0, top: 0, width: 0, height: 0 };
      const rect = cardEl.getBoundingClientRect();
      return {
        left: rect.left - gridRect.left,
        top: rect.top - gridRect.top,
        width: rect.width,
        height: rect.height,
      };
    });
    
    setCardRects(rects);
  }, []);

  // Measure on mount and resize
  useEffect(() => {
    measureCards();
    window.addEventListener("resize", measureCards);
    return () => window.removeEventListener("resize", measureCards);
  }, [measureCards, data.metrics.length]);

  // Re-measure after initial render
  useEffect(() => {
    const timer = setTimeout(measureCards, 100);
    return () => clearTimeout(timer);
  }, [measureCards]);

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

        {/* Container for both layers */}
        <div className="relative">
          {/* BASE LAYER: Static cards that never move */}
          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.metrics.map((metric, metricIndex) => (
              <div
                key={metricIndex}
                ref={(el) => { cardRefs.current[metricIndex] = el; }}
              >
                <Card
                  className={`p-6 h-full transition-opacity duration-300 ${
                    hoveredIndex !== null && hoveredIndex !== metricIndex
                      ? "opacity-30"
                      : "opacity-100"
                  }`}
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
              </div>
            ))}
          </div>

          {/* OVERLAY LAYER: Absolutely positioned overlays (NO grid wrapper) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            {data.metrics.map((metric, metricIndex) => {
              const isHovered = hoveredIndex === metricIndex;
              const rect = cardRects[metricIndex];
              
              if (!rect || rect.width === 0) return null;
              
              const isLastCard = metricIndex === data.metrics.length - 1;
              
              // Expanded width: from card's left edge to container's right edge (or vice versa for last card)
              const expandedWidth = isLastCard
                ? rect.left + rect.width  // Expand left: cover from left edge to this card's right
                : containerWidth - rect.left;  // Expand right: cover from this card to right edge
              
              return (
                <Card
                  key={metricIndex}
                  className={`
                    absolute p-6
                    pointer-events-auto cursor-pointer
                    transition-all duration-300 ease-out
                    max-w-none
                    ${isHovered ? "shadow-xl z-20" : "opacity-0"}
                  `}
                  style={{
                    top: rect.top,
                    left: isLastCard 
                      ? (isHovered ? 0 : rect.left)  // Last card: starts at rect.left, expands to left edge
                      : rect.left,  // Other cards: always start at rect.left
                    width: isHovered ? expandedWidth : rect.width,
                    height: rect.height,
                  }}
                  onMouseEnter={() => setHoveredIndex(metricIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  data-testid={`card-overlay-${metricIndex}`}
                >
                  <div className={`flex ${isHovered ? "flex-row gap-6" : "flex-col"} h-full`}>
                    {/* Graph section - same width as original card */}
                    <div 
                      className="flex-shrink-0 flex flex-col"
                      style={{ width: rect.width - 48 }}
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
                    </div>

                    {/* Description panel - appears when expanded */}
                    {metric.description && isHovered && (
                      <div className="flex-1 flex items-center animate-in fade-in slide-in-from-left-4 duration-300">
                        <p className="text-base text-muted-foreground leading-relaxed">
                          {metric.description}
                        </p>
                      </div>
                    )}
                  </div>
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
