import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface PieChartItem {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
}

interface PieChartData {
  title: string;
  items: PieChartItem[];
}

interface PieChartsData {
  type: "pie_charts";
  version?: string;
  title?: string;
  subtitle?: string;
  charts: PieChartData[];
  background?: string;
  use_card?: boolean;
}

interface PieChartsProps {
  data: PieChartsData;
}

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function SinglePieChart({ chart, isVisible, delayOffset }: { chart: PieChartData; isVisible: boolean; delayOffset: number }) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const total = chart.items.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  const slices = chart.items.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: cumulativeAngle,
      angle,
      color: item.color || chartColors[index % chartColors.length],
    };
  });

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const delay = delayOffset;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;
      
      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, delayOffset]);

  const createSlicePath = (startAngle: number, angle: number, radius: number, cx: number, cy: number) => {
    if (angle <= 0) return "";
    
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angle - 90) * (Math.PI / 180);
    
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;

  const currentAngle = animationProgress * 360;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide" data-testid="text-pie-chart-title">
        {chart.title}
      </h3>
      
      <div className="relative">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-sm"
        >
          {slices.map((slice, index) => {
            const visibleStart = Math.max(0, Math.min(slice.startAngle, currentAngle));
            const visibleEnd = Math.min(slice.endAngle, currentAngle);
            const visibleAngle = Math.max(0, visibleEnd - slice.startAngle);
            
            if (currentAngle <= slice.startAngle) return null;
            
            return (
              <path
                key={index}
                d={createSlicePath(slice.startAngle, visibleAngle, radius, cx, cy)}
                fill={slice.color}
                data-testid={`pie-slice-${index}`}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-4 space-y-1">
        {slices.map((slice, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 text-sm"
            style={{
              opacity: animationProgress >= (slice.startAngle / 360) ? 1 : 0,
              transform: animationProgress >= (slice.startAngle / 360) ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.3s ease-out',
            }}
            data-testid={`pie-legend-${index}`}
          >
            <div 
              className="w-3 h-3 rounded-sm shrink-0" 
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-muted-foreground">
              {slice.label}: {slice.displayValue || `${slice.value} (${Math.round(slice.percentage)}%)`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PieCharts({ data }: PieChartsProps) {
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

  const content = (
    <>
      {(data.title || data.subtitle) && (
        <div className="text-center mb-8">
          {data.title && (
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2" data-testid="text-pie-charts-title">
              {data.title}
            </h2>
          )}
          {data.subtitle && (
            <p className="text-muted-foreground" data-testid="text-pie-charts-subtitle">
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      <div className={`grid gap-8 ${
        data.charts.length === 1 ? 'grid-cols-1 justify-items-center' :
        data.charts.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        'grid-cols-1 md:grid-cols-3'
      }`}>
        {data.charts.map((chart, index) => (
          <SinglePieChart 
            key={index} 
            chart={chart} 
            isVisible={isVisible}
            delayOffset={index * 200}
          />
        ))}
      </div>
    </>
  );

  if (data.use_card) {
    return (
      <section
        ref={containerRef}
        className={`py-6 ${data.background || "bg-background"}`}
        data-testid="section-pie-charts"
      >
        <div className="max-w-6xl mx-auto px-4">
          <Card className="p-6">
            {content}
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={`py-12 ${data.background || "bg-background"}`}
      data-testid="section-pie-charts"
    >
      <div className="max-w-6xl mx-auto px-4">
        {content}
      </div>
    </section>
  );
}
