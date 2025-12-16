import { useState, useEffect, useLayoutEffect, useRef, useCallback, type KeyboardEvent } from "react";
import type { FeaturesGridSpotlightSection, FeaturesGridHighlightItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";
import type { ComponentType } from "react";

function getIcon(iconName: string, className?: string, color?: string) {
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    return <CustomIcon width="100%" height="100%" color={color} className={className} />;
  }
  
  const IconComponent = TablerIcons[`Icon${iconName}` as keyof typeof TablerIcons] as ComponentType<{ className?: string; style?: React.CSSProperties }>;
  if (IconComponent) {
    const style = color ? { color } : undefined;
    return <IconComponent className={className || "w-full h-full text-primary"} style={style} />;
  }
  const style = color ? { color } : undefined;
  return <TablerIcons.IconBox className={className || "w-full h-full text-primary"} style={style} />;
}

interface SpotlightCardProps {
  item: FeaturesGridHighlightItem;
  iconColor?: string;
  isActive: boolean;
  onActivate: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SpotlightCard({ 
  item, 
  iconColor, 
  isActive, 
  onActivate,
  onMouseEnter,
  onMouseLeave,
}: SpotlightCardProps) {
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Card 
      className={`
        p-4 md:p-6 cursor-pointer outline-none
        transition-all duration-500 ease-out
        ${isActive 
          ? 'scale-105 shadow-lg z-10 bg-card border-primary/20' 
          : 'scale-95 opacity-60 bg-card/50 hover:opacity-80'
        }
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onActivate}
      data-testid={`card-spotlight-${itemId}`}
      data-active={isActive}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`
          transition-all duration-500
          ${isActive ? 'w-16 h-16 md:w-20 md:h-20' : 'w-12 h-12 md:w-14 md:h-14'}
        `}>
          {getIcon(item.icon, "w-full h-full", iconColor)}
        </div>
        
        {item.value && (
          <div className={`
            font-bold text-foreground transition-all duration-500
            ${isActive ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}
          `}>
            {item.value}
          </div>
        )}
        
        <div className={`
          font-semibold text-foreground transition-all duration-500
          ${isActive ? 'text-base md:text-lg' : 'text-sm md:text-base'}
        `}>
          {item.title}
        </div>
        
        {item.description && isActive && (
          <div className="text-sm text-muted-foreground mt-1 animate-in fade-in duration-300">
            {item.description}
          </div>
        )}
      </div>
    </Card>
  );
}

interface FeaturesGridSpotlightProps {
  data: FeaturesGridSpotlightSection;
}

export function FeaturesGridSpotlight({ data }: FeaturesGridSpotlightProps) {
  const config = data.spotlight_config || {};
  const initialIndex = config.initial_index ?? 0;
  const autoRotateMs = config.auto_rotate_ms ?? 4000;
  const pauseOnHover = config.pause_on_hover ?? true;
  
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementDone = useRef(false);
  
  const itemCount = data.items.length;
  const columns = data.columns || 3;
  
  const gridColsClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns] || "md:grid-cols-3";

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (autoRotateMs <= 0 || itemCount < 2) return;
    
    clearTimer();
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % itemCount);
    }, autoRotateMs);
  }, [autoRotateMs, itemCount, clearTimer]);

  useEffect(() => {
    if (!isPaused && autoRotateMs > 0 && itemCount >= 2) {
      startTimer();
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [isPaused, startTimer, clearTimer, autoRotateMs, itemCount]);

  useLayoutEffect(() => {
    if (measurementDone.current || !containerRef.current) return;
    
    const measureHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        if (height > 0) {
          setGridHeight(height);
          measurementDone.current = true;
        }
      }
    };

    const timeoutId = setTimeout(measureHeight, 600);
    return () => clearTimeout(timeoutId);
  }, [activeIndex]);

  const handleMouseEnter = useCallback((index: number) => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
    setActiveIndex(index);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [pauseOnHover]);

  const handleActivate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 100);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % itemCount);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 3000);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + itemCount) % itemCount);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 3000);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(itemCount - 1);
    }
  }, [itemCount]);

  const handleContainerFocus = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleContainerBlur = useCallback(() => {
    setIsPaused(false);
  }, []);

  return (
    <section 
      className={`py-14 ${data.background || ''}`}
      data-testid="section-features-grid-spotlight"
      aria-label={data.title || "Feature highlights"}
      aria-roledescription="carousel"
    >
      <div className="max-w-6xl mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className="text-center mb-8">
            {data.title && (
              <h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
                data-testid="text-features-grid-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <div 
          ref={containerRef}
          className={`grid grid-cols-1 ${gridColsClass} gap-6 items-center outline-none`}
          style={gridHeight ? { minHeight: `${gridHeight}px` } : undefined}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={handleContainerFocus}
          onBlur={handleContainerBlur}
          role="group"
          aria-label={`Feature carousel, ${itemCount} items. Use arrow keys to navigate.`}
        >
          {data.items.map((item, index) => (
            <SpotlightCard 
              key={item.id || index} 
              item={item} 
              iconColor={item.icon_color || data.icon_color}
              isActive={index === activeIndex}
              onActivate={() => handleActivate(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
        
        <div 
          className="flex justify-center gap-2 mt-6" 
          role="group" 
          aria-label="Slide indicators"
        >
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {`Showing item ${activeIndex + 1} of ${itemCount}: ${data.items[activeIndex]?.title}`}
          </div>
          {data.items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${index === activeIndex 
                  ? 'w-6 bg-primary' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }
              `}
              aria-label={`Go to ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              data-testid={`button-spotlight-indicator-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
