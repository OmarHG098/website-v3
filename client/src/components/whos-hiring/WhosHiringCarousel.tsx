import { useState, useEffect, useRef, useMemo } from "react";
import type { WhosHiringSection as WhosHiringSectionType } from "@shared/schema";

interface WhosHiringCarouselProps {
  data: WhosHiringSectionType;
}

const CARD_SIZES = [
  { width: "w-32", height: "h-16" },
  { width: "w-40", height: "h-20" },
  { width: "w-36", height: "h-18" },
  { width: "w-44", height: "h-22" },
  { width: "w-28", height: "h-14" },
];

export function WhosHiringCarousel({ data }: WhosHiringCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const logos = data.logos || [];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const logoCards = useMemo(() => {
    return logos.map((logo, index) => {
      const sizeIndex = index % CARD_SIZES.length;
      const size = CARD_SIZES[sizeIndex];
      return { ...logo, size, id: `logo-${index}` };
    });
  }, [logos]);

  const duplicatedLogos = useMemo(() => {
    return [...logoCards, ...logoCards];
  }, [logoCards]);

  if (logos.length === 0) {
    return null;
  }

  const shouldAnimate = !prefersReducedMotion && !isPaused;

  return (
    <section 
      className="py-section bg-background overflow-hidden"
      data-testid="section-whos-hiring-carousel"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Customer Stories
          </p>
          <h2 
            className="text-h2 mb-3 text-foreground"
            data-testid="text-whos-hiring-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-body mb-4 text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-whos-hiring-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div 
            ref={trackRef}
            className={`flex gap-4 py-4 ${shouldAnimate ? "logo-carousel-track" : ""}`}
            style={{
              width: "max-content",
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className={`
                  flex-shrink-0 flex items-center justify-center
                  ${logo.size.width} ${logo.size.height}
                  p-4 rounded-[0.8rem]
                  bg-transparent
                  border border-border/40
                  transition-all duration-200
                  hover:bg-muted/30 hover:border-border
                `}
                data-testid={`card-logo-carousel-${index}`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain logo-grayscale"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
