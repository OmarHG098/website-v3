import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
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

const CARD_WIDTH = 380;
const CARD_GAP = 0; // No gap - cards overlap
const CARD_TOTAL = CARD_WIDTH; // Cards positioned edge-to-edge
const DRAG_MULTIPLIER = 0.7;
const SIDE_SCALE = 0.9;
const SIDE_OPACITY = 0.5;

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cardTransforms, setCardTransforms] = useState<Map<number, { scale: number; opacity: number; zIndex: number }>>(new Map());
  const isResettingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Drag state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);

  // Triple the items for infinite loop
  const extendedItems = [...items, ...items, ...items];
  const originalLength = items.length;

  const updateCardTransforms = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.clientWidth / 2;
    const scrollLeft = container.scrollLeft;

    const newTransforms = new Map<number, { scale: number; opacity: number; zIndex: number }>();

    // Find the card closest to center first
    let closestIndex = 0;
    let closestDistance = Infinity;

    extendedItems.forEach((_, index) => {
      const cardCenterX = (index * CARD_TOTAL) + (CARD_WIDTH / 2) - scrollLeft;
      const distance = Math.abs(cardCenterX - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // Apply transforms based on distance from the closest (center) card
    extendedItems.forEach((_, index) => {
      const cardCenterX = (index * CARD_TOTAL) + (CARD_WIDTH / 2) - scrollLeft;
      const distanceFromCenter = Math.abs(cardCenterX - containerCenter);
      const indexDiff = Math.abs(index - closestIndex);

      let scale: number;
      let opacity: number;
      let zIndex: number;

      if (index === closestIndex) {
        // Center card - always full scale/opacity
        scale = 1;
        opacity = 1;
        zIndex = 10;
      } else if (indexDiff === 1) {
        // Immediate neighbors - side cards
        // Interpolate based on how close we are to becoming center
        const t = Math.min(1, distanceFromCenter / CARD_TOTAL);
        scale = 1 - (t * (1 - SIDE_SCALE));
        opacity = 1 - (t * (1 - SIDE_OPACITY));
        zIndex = 5;
      } else {
        // All other cards - hidden
        scale = SIDE_SCALE;
        opacity = 0;
        zIndex = 1;
      }

      newTransforms.set(index, { scale, opacity, zIndex });
    });

    setCardTransforms(newTransforms);
  }, [extendedItems.length]);

  const checkInfiniteLoop = useCallback(() => {
    if (isResettingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const singleSetWidth = originalLength * CARD_TOTAL;
    const minScroll = singleSetWidth * 0.5;
    const maxScroll = singleSetWidth * 2;

    if (container.scrollLeft < minScroll) {
      isResettingRef.current = true;
      container.scrollLeft += singleSetWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
        updateCardTransforms();
      });
    } else if (container.scrollLeft > maxScroll) {
      isResettingRef.current = true;
      container.scrollLeft -= singleSetWidth;
      requestAnimationFrame(() => {
        isResettingRef.current = false;
        updateCardTransforms();
      });
    }
  }, [originalLength, updateCardTransforms]);

  const handleScroll = useCallback(() => {
    checkInfiniteLoop();

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(updateCardTransforms);
  }, [checkInfiniteLoop, updateCardTransforms]);

  // Smooth scroll animation to target
  const animateScrollTo = useCallback((targetScroll: number, duration: number = 300) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const startScroll = container.scrollLeft;
    const distance = targetScroll - startScroll;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      container.scrollLeft = startScroll + (distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        checkInfiniteLoop();
        updateCardTransforms();
      }
    };

    requestAnimationFrame(animate);
  }, [checkInfiniteLoop, updateCardTransforms]);

  // Snap to nearest card center
  const snapToNearestCard = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.clientWidth / 2;
    const currentScroll = container.scrollLeft;

    // Find which card center is closest to container center
    let closestIndex = 0;
    let closestDistance = Infinity;

    extendedItems.forEach((_, index) => {
      const cardCenterX = (index * CARD_TOTAL) + (CARD_WIDTH / 2) - currentScroll;
      const distance = Math.abs(cardCenterX - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    // Calculate scroll position to center that card
    const targetScroll = (closestIndex * CARD_TOTAL) + (CARD_WIDTH / 2) - containerCenter;
    
    // Animate to target
    animateScrollTo(targetScroll, 250);
  }, [extendedItems.length, animateScrollTo]);

  // Drag handlers
  const handleDragStart = useCallback((clientX: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    scrollStartRef.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaX = (dragStartXRef.current - clientX) * DRAG_MULTIPLIER;
    container.scrollLeft = scrollStartRef.current + deltaX;
  }, []);

  const handleDragEnd = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = false;
    container.style.cursor = 'grab';

    // Smooth snap to nearest card
    snapToNearestCard();
  }, [snapToNearestCard]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      handleDragEnd();
    }
  }, [handleDragEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Initialize scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0) return;

    // Start in the middle set, centered on first card
    const containerCenter = container.clientWidth / 2;
    const initialScroll = (originalLength * CARD_TOTAL) + (CARD_WIDTH / 2) - containerCenter;
    container.scrollLeft = initialScroll;
    container.style.cursor = 'grab';

    requestAnimationFrame(updateCardTransforms);
  }, [items.length, originalLength, updateCardTransforms]);

  // Set up listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCardTransforms);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCardTransforms);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateCardTransforms, handleMouseMove, handleMouseUp]);

  if (items.length === 0) return null;

  const totalWidth = extendedItems.length * CARD_TOTAL;

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
        <div className="relative h-[420px]">
          {/* Left fade - softer gradient */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[180px] bg-gradient-to-r from-background to-transparent z-30 pointer-events-none"
          />
          
          {/* Right fade - softer gradient */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[180px] bg-gradient-to-l from-background to-transparent z-30 pointer-events-none"
          />

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Cards track - no gap, cards overlap */}
            <div
              className="h-full flex items-center"
              style={{ 
                width: `${totalWidth}px`,
              }}
            >
              {extendedItems.map((testimonial, index) => {
                const transform = cardTransforms.get(index) || { scale: SIDE_SCALE, opacity: 0, zIndex: 1 };
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 transition-transform duration-100 ease-out pointer-events-none"
                    style={{
                      width: `${CARD_WIDTH}px`,
                      transform: `scale(${transform.scale})`,
                      opacity: transform.opacity,
                      zIndex: transform.zIndex,
                      visibility: transform.opacity > 0 ? 'visible' : 'hidden',
                    }}
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="h-full border border-border bg-card">
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
  );
}
