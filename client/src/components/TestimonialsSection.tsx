import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconStarFilled, IconStar, IconUser, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
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
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || items.length <= 1) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused, goToNext, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStart(null);
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
          className="relative h-[420px] md:h-[380px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden md:flex items-center justify-center"
            data-testid="button-carousel-prev"
            aria-label="Previous review"
          >
            <IconChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-background border border-border shadow-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden md:flex items-center justify-center"
            data-testid="button-carousel-next"
            aria-label="Next review"
          >
            <IconChevronRight size={24} />
          </button>

          {/* Cards Container */}
          <div className="relative h-full flex items-center justify-center overflow-visible">
            {/* Left Card */}
            {items.length > 1 && (
              <CarouselCard
                testimonial={items[getCardIndex(-1)]}
                position="left"
                prefersReducedMotion={prefersReducedMotion}
              />
            )}

            {/* Center Card */}
            <CarouselCard
              testimonial={items[activeIndex]}
              position="center"
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Right Card */}
            {items.length > 2 && (
              <CarouselCard
                testimonial={items[getCardIndex(1)]}
                position="right"
                prefersReducedMotion={prefersReducedMotion}
              />
            )}
          </div>
        </div>

        {/* Mobile Indicator Dots */}
        <div className="flex justify-center gap-2 mt-6 md:hidden">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

function CarouselCard({ 
  testimonial, 
  position,
  prefersReducedMotion
}: { 
  testimonial: TestimonialItem; 
  position: "left" | "center" | "right";
  prefersReducedMotion: boolean;
}) {
  const isCenter = position === "center";
  const isLeft = position === "left";
  const isRight = position === "right";

  const positionStyles = useMemo(() => {
    if (isCenter) {
      return {
        transform: "translateX(0) scale(1)",
        zIndex: 30,
        opacity: 1,
      };
    }
    if (isLeft) {
      return {
        transform: "translateX(-75%) scale(0.88)",
        zIndex: 10,
        opacity: 0.5,
      };
    }
    return {
      transform: "translateX(75%) scale(0.88)",
      zIndex: 10,
      opacity: 0.5,
    };
  }, [isCenter, isLeft]);

  return (
    <div
      className={`absolute w-full max-w-md px-4 ${
        prefersReducedMotion ? "" : "transition-all duration-500 ease-out"
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
