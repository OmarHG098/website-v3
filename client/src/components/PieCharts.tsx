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

  const baseSize = 180;
  const expandedSize = 280;
  const size = isHovered ? expandedSize : baseSize;
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

  const leaderLineLength = 40;
  const labelOffset = 12;

  return (
    <div 
      className={`flex flex-col items-center transition-all duration-300 ease-out cursor-pointer ${
        isOtherHovered ? "opacity-30" : "opacity-100"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform: isHovered ? "scale(1)" : "scale(1)",
      }}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide" data-testid="text-pie-chart-title">
        {chart.title}
      </h3>
      
      <div 
        className="relative transition-all duration-300 ease-out"
        style={{
          width: isHovered ? expandedSize + 160 : baseSize,
          height: isHovered ? expandedSize + 40 : baseSize,
        }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-sm transition-all duration-300 ease-out"
          style={{
            position: "absolute",
            left: isHovered ? 80 : 0,
            top: isHovered ? 20 : 0,
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
          
          {isHovered && slices.map((slice, index) => {
            if (currentAngle <= slice.startAngle) return null;
            
            const midpoint = getSliceMidpoint(slice, radius * 0.7);
            const outerPoint = getSliceMidpoint(slice, radius + leaderLineLength);
            const isRightSide = outerPoint.x > cx;
            
            const labelX = isRightSide 
              ? outerPoint.x + labelOffset 
              : outerPoint.x - labelOffset;
            
            return (
              <g 
                key={`leader-${index}`}
                className="transition-opacity duration-300"
                style={{
                  opacity: isHovered ? 1 : 0,
                }}
              >
                <line
                  x1={midpoint.x}
                  y1={midpoint.y}
                  x2={outerPoint.x}
                  y2={outerPoint.y}
                  stroke={slice.color}
                  strokeWidth={2}
                  className="transition-all duration-300"
                />
                <circle
                  cx={outerPoint.x}
                  cy={outerPoint.y}
                  r={3}
                  fill={slice.color}
                />
                <text
                  x={labelX}
                  y={outerPoint.y}
                  textAnchor={isRightSide ? "start" : "end"}
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-foreground"
                >
                  {slice.label}
                </text>
                <text
                  x={labelX}
                  y={outerPoint.y + 14}
                  textAnchor={isRightSide ? "start" : "end"}
                  dominantBaseline="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {slice.displayValue || `${Math.round(slice.percentage)}%`}
                </text>
              </g>
            );
          })}
        </svg>
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

      <div className={`grid gap-8 items-start ${
        data.charts.length === 1 ? 'grid-cols-1 justify-items-center' :
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
