import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

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

  useEffect(() => {
    if (prefersReducedMotion || isPaused || items.length <= 1 || isDragging) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused, goToNext, items.length, isDragging]);

  // Pointer/drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1) return;
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX.current;
    // Limit drag offset for subtle feedback (max 50px)
    const clampedDiff = Math.max(-50, Math.min(50, diff * 0.5));
    setDragOffset(clampedDiff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    
    // Determine if we should snap to next/prev based on drag distance
    const threshold = 30;
    
    if (dragOffset < -threshold) {
      goToNext();
    } else if (dragOffset > threshold) {
      goToPrev();
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setIsPaused(false);
  };

  const getCardIndex = (offset: number) => {
    return (activeIndex + offset + items.length) % items.length;
  };

  if (items.length === 0) return null;

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
          className={`relative h-[420px] md:h-[380px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseEnter={() => !isDragging && setIsPaused(true)}
          onMouseLeave={() => !isDragging && setIsPaused(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {/* Cards Container */}
          <div className="relative h-full flex items-center justify-center overflow-visible select-none">
            {/* Left Card */}
            {items.length > 1 && (
              <CarouselCard
                testimonial={items[getCardIndex(-1)]}
                position="left"
                prefersReducedMotion={prefersReducedMotion}
                dragOffset={dragOffset}
                isDragging={isDragging}
              />
            )}

            {/* Center Card */}
            <CarouselCard
              testimonial={items[activeIndex]}
              position="center"
              prefersReducedMotion={prefersReducedMotion}
              dragOffset={dragOffset}
              isDragging={isDragging}
            />

            {/* Right Card */}
            {items.length > 2 && (
              <CarouselCard
                testimonial={items[getCardIndex(1)]}
                position="right"
                prefersReducedMotion={prefersReducedMotion}
                dragOffset={dragOffset}
                isDragging={isDragging}
              />
            )}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="mt-8">
          <DotsIndicator
            count={items.length}
            activeIndex={activeIndex}
            onDotClick={goToIndex}
            className="justify-center"
            ariaLabel="Testimonial navigation"
          />
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

function CarouselCard({ 
  testimonial, 
  position,
  prefersReducedMotion,
  dragOffset,
  isDragging
}: { 
  testimonial: TestimonialItem; 
  position: "left" | "center" | "right";
  prefersReducedMotion: boolean;
  dragOffset: number;
  isDragging: boolean;
}) {
  const isCenter = position === "center";
  const isLeft = position === "left";

  const positionStyles = useMemo(() => {
    // Base positions
    const baseTranslate = isCenter ? 0 : isLeft ? -75 : 75;
    const baseScale = isCenter ? 1 : 0.88;
    const baseOpacity = isCenter ? 1 : 0.5;
    const zIndex = isCenter ? 30 : 10;

    // Add drag offset to all cards for subtle movement feedback
    const translateX = baseTranslate + (dragOffset * 0.15); // Subtle multiplier
    
    return {
      transform: `translateX(${translateX}%) scale(${baseScale})`,
      zIndex,
      opacity: baseOpacity,
    };
  }, [isCenter, isLeft, dragOffset]);

  return (
    <div
      className={`absolute w-full max-w-md px-4 ${
        prefersReducedMotion ? "" : isDragging ? "transition-none" : "transition-all duration-500 ease-out"
      }`}
      style={positionStyles}
    >
      <Card
        className={`border border-border ${
          isCenter 
            ? "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]" 
            : ""
        }`}
      >
        <CardContent className={`${isCenter ? "p-6" : "p-5"}`}>
          {/* Header with Avatar and Info */}
          <div className="flex items-center gap-3 mb-4">
            {/* Monochrome Initials Badge */}
            <div className={`${isCenter ? "w-12 h-12" : "w-10 h-10"} rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
              <span className={`font-semibold text-muted-foreground ${isCenter ? "text-base" : "text-sm"}`}>
                {getInitials(testimonial.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-foreground truncate ${isCenter ? "text-base" : "text-sm"}`}>
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
                <IconStarFilled key={i} className={`${isCenter ? "w-5 h-5" : "w-4 h-4"} text-yellow-500`} />
              ) : (
                <IconStar key={i} className={`${isCenter ? "w-5 h-5" : "w-4 h-4"} text-muted`} />
              ),
            )}
          </div>

          {/* Review Text */}
          <p className={`text-muted-foreground leading-relaxed ${
            isCenter 
              ? "text-sm line-clamp-6" 
              : "text-xs line-clamp-3"
          }`}>
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
