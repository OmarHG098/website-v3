import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import { DotsIndicator } from "@/components/DotsIndicator";
import type { TestimonialsSection as TestimonialsSectionType } from "@shared/schema";

interface LegacyTestimonial {
  id: string;
  name: string;
  role: string;
  course?: string;
  rating: number;
  comment: string;
}

interface TestimonialsSectionProps {
  data?: TestimonialsSectionType;
  testimonials?: LegacyTestimonial[];
}

interface TestimonialItem {
  name: string;
  role: string;
  rating: number;
  comment: string;
  company?: string;
  outcome?: string;
  avatar?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Interpolation helper
function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

// Card position configurations
const CARD_CONFIGS = {
  farLeft: { translateX: -150, scale: 0.75, opacity: 0, zIndex: 5 },
  left: { translateX: -75, scale: 0.88, opacity: 0.5, zIndex: 10 },
  center: { translateX: 0, scale: 1, opacity: 1, zIndex: 30 },
  right: { translateX: 75, scale: 0.88, opacity: 0.5, zIndex: 10 },
  farRight: { translateX: 150, scale: 0.75, opacity: 0, zIndex: 5 },
};

type CardPosition = keyof typeof CARD_CONFIGS;

// Get interpolated styles between two positions
function getInterpolatedStyles(
  fromPos: CardPosition,
  toPos: CardPosition,
  progress: number
) {
  const from = CARD_CONFIGS[fromPos];
  const to = CARD_CONFIGS[toPos];
  
  return {
    transform: `translateX(${lerp(from.translateX, to.translateX, progress)}%) scale(${lerp(from.scale, to.scale, progress)})`,
    opacity: lerp(from.opacity, to.opacity, progress),
    zIndex: progress > 0.5 ? to.zIndex : from.zIndex,
  };
}

// Get card styles based on slot position and drag progress
function getCardStyles(slotIndex: number, dragProgress: number) {
  // slotIndex: -2 = farLeft, -1 = left, 0 = center, 1 = right, 2 = farRight
  // dragProgress: negative = dragging left (right card coming in), positive = dragging right (left card coming in)
  
  const positions: CardPosition[] = ['farLeft', 'left', 'center', 'right', 'farRight'];
  const baseIndex = slotIndex + 2; // Convert to 0-4 range
  
  if (dragProgress === 0) {
    // At rest
    return {
      ...CARD_CONFIGS[positions[baseIndex]],
      transform: `translateX(${CARD_CONFIGS[positions[baseIndex]].translateX}%) scale(${CARD_CONFIGS[positions[baseIndex]].scale})`,
    };
  }
  
  // During drag, interpolate toward next position
  // Dragging left (negative) = cards move left, so each card moves toward the position to its left
  // Dragging right (positive) = cards move right, so each card moves toward the position to its right
  
  const absProgress = Math.abs(dragProgress);
  
  if (dragProgress < 0) {
    // Dragging left: cards shift left (right card becomes center, etc.)
    const fromPos = positions[baseIndex];
    const toPos = positions[Math.max(0, baseIndex - 1)];
    return getInterpolatedStyles(fromPos, toPos, absProgress);
  } else {
    // Dragging right: cards shift right (left card becomes center, etc.)
    const fromPos = positions[baseIndex];
    const toPos = positions[Math.min(4, baseIndex + 1)];
    return getInterpolatedStyles(fromPos, toPos, absProgress);
  }
}

export function TestimonialsSection({ data, testimonials }: TestimonialsSectionProps) {
  const items = data?.items || testimonials?.map(t => ({
    name: t.name,
    role: t.role,
    rating: t.rating,
    comment: t.comment,
    company: t.course,
  })) || [];

  const title = data?.title || "What Our Students Say";
  const subtitle = data?.subtitle;
  const ratingSummary = data?.rating_summary;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // -1 to 1
  const isAnimatingRef = useRef(false);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragDirectionRef = useRef<'left' | 'right' | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragProgressRef = useRef(0); // Track progress in ref for animation
  
  const dragThreshold = 0.3; // 30% drag triggers transition
  const cardWidth = 400; // Approximate width for drag calculation
  const dragResistance = 0.4; // Drag resistance multiplier (lower = more resistance)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const getItemIndex = useCallback((offset: number) => {
    return (activeIndex + offset + items.length) % items.length;
  }, [activeIndex, items.length]);

  const goToIndex = useCallback((index: number) => {
    const newIndex = (index + items.length) % items.length;
    setActiveIndex(newIndex);
  }, [items.length]);

  const goToNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const goToPrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  // Keep ref in sync with state
  useEffect(() => {
    dragProgressRef.current = dragProgress;
  }, [dragProgress]);

  // Auto-advance
  useEffect(() => {
    if (prefersReducedMotion || isPaused || items.length <= 1 || isDragging || isAnimatingRef.current) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused, goToNext, items.length, isDragging]);

  // Animate to complete or spring back
  const animateTransition = useCallback((targetProgress: number, onComplete: () => void) => {
    if (prefersReducedMotion) {
      setDragProgress(targetProgress);
      dragProgressRef.current = targetProgress;
      onComplete();
      return;
    }
    
    isAnimatingRef.current = true;
    const startProgress = dragProgressRef.current;
    const startTime = performance.now();
    const duration = 300;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentProgress = lerp(startProgress, targetProgress, eased);
      setDragProgress(currentProgress);
      dragProgressRef.current = currentProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDragProgress(0);
        dragProgressRef.current = 0;
        isAnimatingRef.current = false;
        onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }, [prefersReducedMotion]);

  // Pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1 || isAnimatingRef.current) return;
    
    // Store pointer ID and capture
    pointerIdRef.current = e.pointerId;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isAnimatingRef.current) return;
    const diff = e.clientX - dragStartX.current;
    // Apply drag resistance and convert to progress (-1 to 1), negative = dragging left
    const progress = Math.max(-1, Math.min(1, (-diff * dragResistance) / cardWidth));
    setDragProgress(progress);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    // Release pointer capture
    if (pointerIdRef.current !== null) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(pointerIdRef.current);
      } catch {
        // Ignore if already released
      }
      pointerIdRef.current = null;
    }
    
    setIsDragging(false);
    
    const currentProgress = dragProgress;
    const absProgress = Math.abs(currentProgress);
    
    if (absProgress >= dragThreshold) {
      // Store direction in ref before animation
      dragDirectionRef.current = currentProgress < 0 ? 'left' : 'right';
      const targetProgress = dragDirectionRef.current === 'left' ? -1 : 1;
      
      animateTransition(targetProgress, () => {
        // Use ref to determine which way to go
        if (dragDirectionRef.current === 'left') {
          goToNext();
        } else {
          goToPrev();
        }
        dragDirectionRef.current = null;
        setIsPaused(false);
      });
    } else {
      // Spring back
      dragDirectionRef.current = null;
      animateTransition(0, () => {
        setIsPaused(false);
      });
    }
  };

  if (items.length === 0) return null;

  // Render 5 cards: -2, -1, 0, 1, 2 relative to active index
  const cardSlots = [-2, -1, 0, 1, 2];

  return (
    <section 
      className="bg-background overflow-hidden"
      data-testid="section-testimonials"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          {ratingSummary && (
            <div 
              className="flex items-center justify-center gap-2 mb-4"
              data-testid="rating-summary"
            >
              <IconStarFilled className="w-7 h-7 text-yellow-500" />
              <span className="text-2xl font-bold text-foreground">
                {ratingSummary.average}
              </span>
              <span className="text-muted-foreground">
                / {ratingSummary.count} Reviews
              </span>
            </div>
          )}
          
          <h2 
            className="text-h2 mb-4 text-foreground"
            data-testid="text-testimonials-title"
          >
            {title}
          </h2>
          
          {subtitle && (
            <p 
              className="text-body text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-testimonials-subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className={`relative h-[420px] md:h-[380px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseEnter={() => !isDragging && !isAnimatingRef.current && setIsPaused(true)}
          onMouseLeave={() => !isDragging && !isAnimatingRef.current && setIsPaused(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {/* Cards Container */}
          <div className="relative h-full flex items-center justify-center overflow-hidden select-none">
            {cardSlots.map((slotOffset) => {
              const itemIndex = getItemIndex(slotOffset);
              const styles = getCardStyles(slotOffset, dragProgress);
              
              // Don't render cards that are completely invisible
              if (styles.opacity <= 0) return null;
              
              return (
                <CarouselCard
                  key={`slot-${slotOffset}`}
                  testimonial={items[itemIndex]}
                  styles={styles}
                  isCenter={slotOffset === 0 && Math.abs(dragProgress) < 0.1}
                />
              );
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="mt-8">
          <DotsIndicator
            count={items.length}
            activeIndex={activeIndex}
            onDotClick={(index) => {
              if (!isAnimatingRef.current) goToIndex(index);
            }}
            className="justify-center"
            ariaLabel="Testimonial navigation"
          />
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

interface CarouselCardProps {
  testimonial: TestimonialItem;
  styles: {
    transform: string;
    opacity: number;
    zIndex: number;
  };
  isCenter: boolean;
}

function CarouselCard({ testimonial, styles, isCenter }: CarouselCardProps) {
  return (
    <div
      className="absolute w-full max-w-md px-4"
      style={styles}
    >
      <Card
        className={`border border-border ${
          isCenter 
            ? "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]" 
            : ""
        }`}
      >
        <CardContent className="p-6">
          {/* Header with Avatar and Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="font-semibold text-muted-foreground text-base">
                {getInitials(testimonial.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate text-base">
                {testimonial.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {testimonial.role}
                {testimonial.company && ` at ${testimonial.company}`}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) =>
              i < testimonial.rating ? (
                <IconStarFilled key={i} className="w-5 h-5 text-yellow-500" />
              ) : (
                <IconStar key={i} className="w-5 h-5 text-muted" />
              ),
            )}
          </div>

          {/* Review Text */}
          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-5">
            {testimonial.comment}
          </p>

          {/* Outcome Badge */}
          {testimonial.outcome && (
            <div className="pt-3 border-t mt-4">
              <Badge variant="secondary" className="text-xs">
                {testimonial.outcome}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
