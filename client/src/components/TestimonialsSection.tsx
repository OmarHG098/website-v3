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
const CARD_GAP = 24;
const CARD_TOTAL = CARD_WIDTH + CARD_GAP;

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [cardTransforms, setCardTransforms] = useState<Map<number, { scale: number; opacity: number }>>(new Map());
  const isResettingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Triple the items for infinite loop (before + original + after)
  const extendedItems = [...items, ...items, ...items];
  const originalLength = items.length;

  const updateCardTransforms = useCallback(() => {
    const container = scrollContainerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.width / 2;
    const scrollLeft = container.scrollLeft;

    const newTransforms = new Map<number, { scale: number; opacity: number }>();

    // Calculate transforms for each card based on distance from center
    extendedItems.forEach((_, index) => {
      const cardCenterX = (index * CARD_TOTAL) + (CARD_WIDTH / 2) - scrollLeft;
      const distanceFromCenter = Math.abs(cardCenterX - containerCenter);
      const normalizedDistance = distanceFromCenter / CARD_TOTAL;

      let scale: number;
      let opacity: number;

      if (normalizedDistance < 0.5) {
        // Center card
        scale = 1;
        opacity = 1;
      } else if (normalizedDistance < 1.5) {
        // Side cards - interpolate from center to side
        const t = Math.min(1, (normalizedDistance - 0.5));
        scale = 1 - (t * 0.12); // 1 -> 0.88
        opacity = 1 - (t * 0.5); // 1 -> 0.5
      } else {
        // Hidden cards
        scale = 0.88;
        opacity = 0;
      }

      newTransforms.set(index, { scale, opacity });
    });

    setCardTransforms(newTransforms);
  }, [extendedItems.length]);

  const handleScroll = useCallback(() => {
    if (isResettingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    // Calculate boundaries for infinite loop
    const singleSetWidth = originalLength * CARD_TOTAL;
    const minScroll = singleSetWidth * 0.5;
    const maxScroll = singleSetWidth * 2;

    // Check if we need to loop
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

    // Update transforms on every scroll
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(updateCardTransforms);
  }, [originalLength, updateCardTransforms]);

  // Initialize scroll position and transforms
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0) return;

    // Start in the middle set, centered on first card
    const initialScroll = (originalLength * CARD_TOTAL) + (container.clientWidth / 2) - (CARD_WIDTH / 2);
    container.scrollLeft = initialScroll;

    // Initial transform calculation
    requestAnimationFrame(updateCardTransforms);
  }, [items.length, originalLength, updateCardTransforms]);

  // Set up scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCardTransforms);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCardTransforms);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateCardTransforms]);

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

        {/* Scroll-based Carousel Container */}
        <div className="relative h-[420px]">
          {/* Left fade gradient */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-[200px] bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none"
          />
          
          {/* Right fade gradient */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[200px] bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none"
          />

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="h-full overflow-x-auto scrollbar-hide"
            style={{ 
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Cards track */}
            <div
              ref={contentRef}
              className="h-full flex items-center"
              style={{ 
                width: `${totalWidth}px`,
                gap: `${CARD_GAP}px`,
              }}
            >
              {extendedItems.map((testimonial, index) => {
                const transform = cardTransforms.get(index) || { scale: 0.88, opacity: 0 };
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 transition-all duration-150 ease-out"
                    style={{
                      width: `${CARD_WIDTH}px`,
                      transform: `scale(${transform.scale})`,
                      opacity: transform.opacity,
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
