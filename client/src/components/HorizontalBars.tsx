import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface HorizontalBarsItem {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarsData {
  type: "horizontal_bars";
  version?: string;
  title?: string;
  subtitle?: string;
  items: HorizontalBarsItem[];
  background?: string;
}

interface HorizontalBarsProps {
  data: HorizontalBarsData;
}

export function HorizontalBars({ data }: HorizontalBarsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Check if element is initially visible
    const rect = element.getBoundingClientRect();
    const isInitiallyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInitiallyVisible) {
      // Element is visible on load - wait for scroll then animate
      const handleScroll = () => {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // Element is below viewport - use intersection observer
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

  return (
    <section
      ref={containerRef}
      className={`py-12 ${data.background || "bg-background"}`}
      data-testid="section-horizontal-bars"
    >
      <div className="max-w-4xl mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className="text-center mb-12">
            {data.title && (
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                data-testid="text-horizontal-bars-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p
                className="text-muted-foreground text-lg"
                data-testid="text-horizontal-bars-subtitle"
              >
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="space-y-6">
          {data.items.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const delay = index * 150;

            return (
              <div
                key={index}
                className="flex items-center gap-4"
                data-testid={`bar-item-${index}`}
              >
                <div className="w-32 md:w-40 flex justify-end">
                  <Badge variant="secondary" data-testid={`badge-label-${index}`}>
                    {item.label}
                  </Badge>
                </div>
                <div className="flex-1 h-8 md:h-10 bg-muted rounded-md overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-md flex items-center justify-end pr-3 transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${percentage}%` : "0%",
                      transitionDelay: `${delay}ms`,
                      backgroundColor: item.color || undefined,
                    }}
                  >
                    <span className="text-sm md:text-base font-bold text-primary-foreground">
                      {item.value}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
