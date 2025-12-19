import { cn } from "@/lib/utils";

interface DotsIndicatorProps {
  count: number;
  activeIndex: number;
  onDotClick?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
  dotSize?: string;
  activeDotWidth?: string;
  gap?: string;
}

export function DotsIndicator({ 
  count, 
  activeIndex, 
  onDotClick,
  className,
  ariaLabel = "Slide indicators",
  dotSize = "w-2 h-2",
  activeDotWidth = "w-6",
  gap = "gap-2"
}: DotsIndicatorProps) {
  return (
    <div 
      className={cn("flex justify-center items-center", gap, className)}
      role="group" 
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className="relative cursor-pointer before:absolute before:inset-[-6px] before:content-['']"
          aria-label={`Go to item ${index + 1}`}
          aria-current={index === activeIndex ? "true" : undefined}
          data-testid={`button-dot-indicator-${index}`}
        >
          <span
            className={cn(
              "block rounded-full transition-all duration-brand ease-brand",
              dotSize,
              index === activeIndex 
                ? cn(activeDotWidth, "bg-primary") 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        </button>
      ))}
    </div>
  );
}
