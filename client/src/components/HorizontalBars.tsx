import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface HorizontalBarsItem {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
}

interface HorizontalBarsData {
  type: "horizontal_bars";
  version?: string;
  title?: string;
  subtitle?: string;
  items: HorizontalBarsItem[];
  background?: string;
  use_card?: boolean;
}

interface HorizontalBarsProps {
  data: HorizontalBarsData;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function HorizontalBars({ data }: HorizontalBarsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInitiallyVisible) {
      const timeout = setTimeout(() => setIsVisible(true), 300);
      const handleScroll = () => {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        clearTimeout(timeout);
        window.removeEventListener("scroll", handleScroll);
      };
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

  const maxValue = Math.max(...data.items.map((item) => item.value));

  const barsContent = (
    <>
      {(data.title || data.subtitle) && (
        <div className={data.use_card ? "mb-6" : "text-center mb-12"}>
          {data.title && (
            <h2
              className={data.use_card 
                ? "text-lg font-bold text-foreground mb-1" 
                : "text-2xl md:text-3xl font-bold text-foreground mb-4"
              }
              data-testid="text-horizontal-bars-title"
            >
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p
              className="text-muted-foreground text-sm"
              data-testid="text-horizontal-bars-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4 justify-center items-end h-48">
        {data.items.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const delay = index * 150;
          const barColor = item.color || chartColors[index % chartColors.length];
          const displayText = item.displayValue || `${item.value}%`;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2"
              data-testid={`bar-item-${index}`}
            >
              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                {displayText}
              </span>
              <div className="w-16 md:w-20 h-36 bg-muted rounded-t-md overflow-hidden flex items-end">
                <div
                  className="w-full transition-all duration-1000 ease-out rounded-t-md"
                  style={{
                    height: isVisible ? `${percentage}%` : "0%",
                    transitionDelay: `${delay}ms`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );

  if (data.use_card) {
    return (
      <section
        ref={containerRef}
        className={`py-6 ${data.background || "bg-background"}`}
        data-testid="section-horizontal-bars"
      >
        <div className="max-w-6xl mx-auto px-4">
          <Card className="p-6">
            {barsContent}
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={`py-12 ${data.background || "bg-background"}`}
      data-testid="section-horizontal-bars"
    >
      <div className="max-w-4xl mx-auto px-4">
        {barsContent}
      </div>
    </section>
  );
}
