import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import type { TestimonialsSection } from "@shared/schema";
import { DotsIndicator } from "@/components/DotsIndicator";

interface TestimonialsCarouselProps {
  data: TestimonialsSection;
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

const CARD_WIDTH_DESKTOP = 380;
const CARD_SPACING_DESKTOP = 330;
const CARD_WIDTH_MOBILE = 240;
const CARD_SPACING_MOBILE = 220;

const DRAG_MULTIPLIER = 0.5;
const SIDE_SCALE = 0.85;
const SIDE_OPACITY = 0.5;

export function TestimonialsCarousel({ data }: TestimonialsCarouselProps) {
  const items = data?.items || [];
  const title = data?.title || "What Our Students Say";
  const subtitle = data?.subtitle;
  const ratingSummary = data?.rating_summary;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cardTransforms, setCardTransforms] = useState<Map<number, { scale: number; opacity: number; zIndex: number }>>(new Map());
  const [activeIndex, setActiveIndex] = useState(1);
  const isResettingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  
  const [isDesktopOrTablet, setIsDesktopOrTablet] = useState(false);
  
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)');
    setIsDesktopOrTablet(query.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktopOrTablet(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  
  const cardWidth = isDesktopOrTablet ? CARD_WIDTH_DESKTOP : CARD_WIDTH_MOBILE;
  const cardSpacing = isDesktopOrTablet ? CARD_SPACING_DESKTOP : CARD_SPACING_MOBILE;

  const extendedItems = isDesktopOrTablet ? [...items, ...items, ...items] : items;
  const originalLength = items.length;

  const updateCardTransforms = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.clientWidth / 2;
    const scrollLeft = container.scrollLeft;
    const mobileLeftOffset = isDesktopOrTablet ? 0 : (containerCenter - cardWidth / 2);

    const newTransforms = new Map<number, { scale: number; opacity: number; zIndex: number }>();
    let closestIndex = 0;
    let closestDistance = Infinity;

    extendedItems.forEach((_, index) => {
      const cardCenterX = mobileLeftOffset + (index * cardSpacing) + (cardWidth / 2) - scrollLeft;
      const distanceFromCenter = Math.abs(cardCenterX - containerCenter);
      
      if (distanceFromCenter < closestDistance) {
        closestDistance = distanceFromCenter;
        closestIndex = index;
      }
      
      const normalizedDist = distanceFromCenter / cardSpacing;

      let scale: number;
      let opacity: number;
      let zIndex: number;
      
      if (normalizedDist <= 1) {
        scale = 1 - (normalizedDist * (1 - SIDE_SCALE));
        opacity = 1 - (normalizedDist * (1 - SIDE_OPACITY));
        zIndex = Math.round(10 - normalizedDist * 5);
      } else if (normalizedDist <= 2) {
        const fadeProgress = normalizedDist - 1;
        scale = SIDE_SCALE;
        opacity = SIDE_OPACITY * (1 - fadeProgress);
        zIndex = 1;
      } else {
        scale = SIDE_SCALE;
        opacity = 0;
        zIndex = 1;
      }

      newTransforms.set(index, { scale, opacity, zIndex });
    });

    setCardTransforms(newTransforms);
    setActiveIndex(closestIndex % originalLength);
  }, [extendedItems.length, originalLength, cardWidth, cardSpacing, isDesktopOrTablet]);

  const checkInfiniteLoop = useCallback(() => {
    if (!isDesktopOrTablet) return;
    if (isResettingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const singleSetWidth = originalLength * cardSpacing;
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
  }, [originalLength, updateCardTransforms, cardSpacing, isDesktopOrTablet]);

  const handleScroll = useCallback(() => {
    checkInfiniteLoop();
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(updateCardTransforms);
  }, [checkInfiniteLoop, updateCardTransforms]);

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

  const navigateToCard = useCallback((targetOriginalIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.clientWidth / 2;
    const targetExtendedIndex = originalLength + targetOriginalIndex;
    const targetScroll = (targetExtendedIndex * cardSpacing) + (cardWidth / 2) - containerCenter;
    
    animateScrollTo(targetScroll, 300);
  }, [originalLength, animateScrollTo, cardWidth, cardSpacing]);

  const snapToNearestCard = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.clientWidth / 2;
    const currentScroll = container.scrollLeft;

    let closestIndex = 0;
    let closestDistance = Infinity;

    extendedItems.forEach((_, index) => {
      const cardCenterX = (index * cardSpacing) + (cardWidth / 2) - currentScroll;
      const distance = Math.abs(cardCenterX - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const targetScroll = (closestIndex * cardSpacing) + (cardWidth / 2) - containerCenter;
    animateScrollTo(targetScroll, 250);
  }, [extendedItems.length, animateScrollTo, cardWidth, cardSpacing]);

  const handleDragStart = useCallback((clientX: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    dragStartXRef.current = clientX;
    scrollStartRef.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaX = (dragStartXRef.current - clientX) * DRAG_MULTIPLIER;
    container.scrollLeft = scrollStartRef.current + deltaX;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = false;
    container.style.cursor = 'grab';
    document.body.style.userSelect = '';

    snapToNearestCard();
  }, [snapToNearestCard]);

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

  const touchStartYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0) return;

    const containerCenter = container.clientWidth / 2;
    
    if (isDesktopOrTablet) {
      const initialScroll = (originalLength * cardSpacing) + cardSpacing + (cardWidth / 2) - containerCenter;
      container.scrollLeft = initialScroll;
      container.style.cursor = 'grab';
    } else {
      container.scrollLeft = cardSpacing;
    }

    requestAnimationFrame(updateCardTransforms);
  }, [items.length, originalLength, updateCardTransforms, cardWidth, cardSpacing, isDesktopOrTablet]);

  const nativeTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartYRef.current = touch.clientY;
    isHorizontalSwipeRef.current = null;
    handleDragStart(touch.clientX);
  }, [handleDragStart]);

  const nativeTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - dragStartXRef.current);
    const deltaY = Math.abs(touch.clientY - touchStartYRef.current);
    
    if (isHorizontalSwipeRef.current === null && (deltaX > 10 || deltaY > 10)) {
      isHorizontalSwipeRef.current = deltaX > deltaY;
    }
    
    if (isHorizontalSwipeRef.current) {
      e.preventDefault();
      handleDragMove(touch.clientX);
    } else {
      isDraggingRef.current = false;
    }
  }, [handleDragMove]);

  const nativeTouchEnd = useCallback(() => {
    isHorizontalSwipeRef.current = null;
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWindowBlur = () => {
      if (isDraggingRef.current) {
        handleDragEnd();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCardTransforms);
    
    if (isDesktopOrTablet) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('blur', handleWindowBlur);
      container.addEventListener('touchstart', nativeTouchStart, { passive: true });
      container.addEventListener('touchmove', nativeTouchMove, { passive: false });
      container.addEventListener('touchend', nativeTouchEnd, { passive: true });
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCardTransforms);
      if (isDesktopOrTablet) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('blur', handleWindowBlur);
        container.removeEventListener('touchstart', nativeTouchStart);
        container.removeEventListener('touchmove', nativeTouchMove);
        container.removeEventListener('touchend', nativeTouchEnd);
      }
      document.body.style.userSelect = '';
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateCardTransforms, handleMouseMove, handleMouseUp, handleDragEnd, nativeTouchStart, nativeTouchMove, nativeTouchEnd, isDesktopOrTablet]);

  if (items.length === 0) return null;

  const totalWidth = extendedItems.length * cardSpacing;
  const mobileOffset = isDesktopOrTablet ? 0 : `calc(50vw - ${cardWidth / 2}px)`;

  return (
    <section 
      className="bg-background overflow-hidden"
      data-testid="section-testimonials"
    >
      <div className="max-w-6xl mx-auto px-0 md:px-4">
        <div className="text-center">
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

        <div className="relative h-[340px] lg:h-[300px]">
          <div 
            className="absolute left-0 top-0 bottom-0 w-[20px] lg:w-[180px] bg-gradient-to-r from-background to-transparent z-30 pointer-events-none"
          />
          
          <div 
            className="absolute right-0 top-0 bottom-0 w-[20px] lg:w-[180px] bg-gradient-to-l from-background to-transparent z-30 pointer-events-none"
          />

          <div
            ref={scrollContainerRef}
            className={`h-full overflow-x-auto overflow-y-hidden scrollbar-hide ${
              isDesktopOrTablet 
                ? "select-none cursor-grab" 
                : "snap-x snap-mandatory touch-auto"
            }`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            onMouseDown={isDesktopOrTablet ? handleMouseDown : undefined}
          >
            <div
              className="h-full relative"
              style={{ 
                width: `${totalWidth + cardWidth}px`,
              }}
            >
              {extendedItems.map((testimonial, index) => {
                const transform = cardTransforms.get(index) || { scale: SIDE_SCALE, opacity: 0, zIndex: 1 };
                const leftPosition = index * cardSpacing;
                
                return (
                  <div
                    key={index}
                    className={`absolute top-1/2 pointer-events-none ${!isDesktopOrTablet ? "snap-center" : ""}`}
                    style={{
                      width: `${cardWidth}px`,
                      left: isDesktopOrTablet ? `${leftPosition}px` : `calc(${mobileOffset} + ${leftPosition}px)`,
                      transform: `translateY(-50%) scale(${transform.scale})`,
                      opacity: transform.opacity,
                      zIndex: transform.zIndex,
                    }}
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <DotsIndicator
            count={originalLength}
            activeIndex={activeIndex}
            onDotClick={navigateToCard}
            ariaLabel="Testimonial navigation"
          />
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="min-h-[320px] md:min-h-[270px] border border-border bg-card">
      <CardContent className="p-6 h-full flex flex-col min-h-[320px] md:min-h-[270px]">
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

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) =>
            i < testimonial.rating ? (
              <IconStarFilled key={i} className="w-5 h-5 text-yellow-500" />
            ) : (
              <IconStar key={i} className="w-5 h-5 text-muted" />
            ),
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed text-sm line-clamp-none md:line-clamp-5 flex-1">
          {testimonial.comment}
        </p>

        {testimonial.outcome && (
          <div className="pt-3 mt-auto">
            <Badge variant="secondary" className="text-xs">
              {testimonial.outcome}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
