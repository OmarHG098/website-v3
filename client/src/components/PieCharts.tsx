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

const defaultColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function toColor(color: string): string {
  if (color.startsWith("chart-")) {
    return `hsl(var(--${color}))`;
  }
  return color;
}

interface SinglePieChartProps {
  chart: PieChartData;
  isVisible: boolean;
  delayOffset: number;
  isHovered: boolean;
  isOtherHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SinglePieChart({ 
  chart, 
  isVisible, 
  delayOffset, 
  isHovered, 
  isOtherHovered,
  onMouseEnter,
  onMouseLeave 
}: SinglePieChartProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  let cumulativeAngle = 0;

  const slices = chart.items.map((item, index) => {
    const percentage = item.value;
    const angle = (percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: cumulativeAngle,
      angle,
      color: item.color ? toColor(item.color) : defaultColors[index % defaultColors.length],
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

  const getSliceMidpoint = (slice: typeof slices[0], r: number) => {
    const midAngle = slice.startAngle + slice.angle / 2;
    const midRad = (midAngle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(midRad),
      y: cy + r * Math.sin(midRad),
      angle: midAngle,
    };
  };

  const containerSize = 320;
  const chartOffset = (containerSize - size) / 2;

  return (
    <div 
      className={`flex flex-col items-center transition-all duration-300 ease-out cursor-pointer ${
        isOtherHovered ? "opacity-30 duration-150" : "opacity-100"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide" data-testid="text-pie-chart-title">
        {chart.title}
      </h3>
      
      <div 
        className="relative"
        style={{
          width: containerSize,
          height: containerSize,
        }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-sm transition-transform duration-300 ease-out"
          style={{
            position: "absolute",
            left: chartOffset,
            top: chartOffset,
            transform: isHovered ? "scale(1.15)" : "scale(1)",
            transformOrigin: "center center",
          }}
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
        
        {slices.map((slice, index) => {
          if (currentAngle <= slice.startAngle) return null;
          
          const scaleFactor = isHovered ? 1.15 : 1;
          const midpoint = getSliceMidpoint(slice, radius * 0.65);
          const outerPoint = getSliceMidpoint(slice, radius + 35);
          
          const scaledMidX = chartOffset + cx + (midpoint.x - cx) * scaleFactor;
          const scaledMidY = chartOffset + cy + (midpoint.y - cy) * scaleFactor;
          const labelX = chartOffset + cx + (outerPoint.x - cx) * scaleFactor;
          const labelY = chartOffset + cy + (outerPoint.y - cy) * scaleFactor;
          
          const isRightSide = outerPoint.x > cx;
          
          return (
            <div
              key={`label-${index}`}
              className="absolute pointer-events-none transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0,
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <svg
                width={containerSize}
                height={containerSize}
                className="absolute left-0 top-0"
                style={{ overflow: "visible" }}
              >
                <line
                  x1={scaledMidX}
                  y1={scaledMidY}
                  x2={labelX}
                  y2={labelY}
                  stroke={slice.color}
                  strokeWidth={2}
                />
                <circle
                  cx={labelX}
                  cy={labelY}
                  r={3}
                  fill={slice.color}
                />
              </svg>
              <div
                className="absolute text-xs whitespace-nowrap"
                style={{
                  left: labelX + (isRightSide ? 8 : -8),
                  top: labelY,
                  transform: `translateY(-50%)`,
                  textAlign: isRightSide ? "left" : "right",
                }}
              >
                <div className="font-medium text-foreground">{slice.label}</div>
                <div className="text-muted-foreground">
                  {slice.displayValue || `${Math.round(slice.percentage)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PieCharts({ data }: PieChartsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
            <p className="text-muted-foreground text-lg" data-testid="text-pie-charts-subtitle">
              {data.subtitle}
            </p>
          )}
        </div>
      )}

      <div className={`grid gap-4 items-start justify-items-center ${
        data.charts.length === 1 ? 'grid-cols-1' :
        data.charts.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        'grid-cols-1 md:grid-cols-3'
      }`}>
        {data.charts.map((chart, index) => (
          <SinglePieChart 
            key={index} 
            chart={chart} 
            isVisible={isVisible}
            delayOffset={0}
            isHovered={hoveredIndex === index}
            isOtherHovered={hoveredIndex !== null && hoveredIndex !== index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
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
