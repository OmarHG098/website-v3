import { useState, useEffect, useMemo } from "react";
import type { WhosHiringSection as WhosHiringSectionType } from "@shared/schema";

interface WhosHiringCarouselProps {
  data: WhosHiringSectionType;
}

interface LogoItem {
  src: string;
  alt: string;
}

interface MosaicGroup {
  id: string;
  pattern: "stack-hero" | "hero-stack" | "triple-stack";
  items: LogoItem[];
}

function LogoCard({ 
  logo, 
  size = "normal",
  showCaption = false 
}: { 
  logo: LogoItem; 
  size?: "small" | "normal" | "hero";
  showCaption?: boolean;
}) {
  const sizeClasses = {
    small: "h-16 w-28",
    normal: "h-20 w-36",
    hero: "h-[168px] w-44",
  };

  return (
    <div
      className={`
        flex-shrink-0 flex flex-col items-center justify-center
        ${sizeClasses[size]}
        p-4 rounded-[0.8rem]
        bg-transparent
        border border-border/40
        transition-all duration-200
        hover:bg-muted/30 hover:border-border
      `}
    >
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-h-full max-w-full object-contain logo-grayscale"
        loading="lazy"
      />
      {showCaption && (
        <span className="mt-2 text-xs text-muted-foreground truncate max-w-full">
          {logo.alt}
        </span>
      )}
    </div>
  );
}

function MosaicGroupComponent({ group }: { group: MosaicGroup }) {
  const { pattern, items } = group;

  if (pattern === "stack-hero" && items.length >= 3) {
    return (
      <div className="flex gap-4 h-[168px]">
        <div className="flex flex-col gap-4">
          <LogoCard logo={items[0]} size="small" />
          <LogoCard logo={items[1]} size="small" />
        </div>
        <LogoCard logo={items[2]} size="hero" showCaption={Math.random() > 0.7} />
      </div>
    );
  }

  if (pattern === "hero-stack" && items.length >= 3) {
    return (
      <div className="flex gap-4 h-[168px]">
        <LogoCard logo={items[0]} size="hero" showCaption={Math.random() > 0.7} />
        <div className="flex flex-col gap-4">
          <LogoCard logo={items[1]} size="small" />
          <LogoCard logo={items[2]} size="small" />
        </div>
      </div>
    );
  }

  if (pattern === "triple-stack" && items.length >= 3) {
    return (
      <div className="flex gap-4 h-[168px]">
        <div className="flex flex-col gap-4">
          <LogoCard logo={items[0]} size="small" />
          <LogoCard logo={items[1]} size="small" />
        </div>
        <div className="flex flex-col gap-4">
          <LogoCard logo={items[2]} size="small" />
          {items[3] && <LogoCard logo={items[3]} size="small" />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[168px]">
      {items.map((item, i) => (
        <LogoCard key={i} logo={item} size="normal" />
      ))}
    </div>
  );
}

export function WhosHiringCarousel({ data }: WhosHiringCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const logos = data.logos || [];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const mosaicGroups = useMemo(() => {
    const groups: MosaicGroup[] = [];
    const patterns: Array<"stack-hero" | "hero-stack" | "triple-stack"> = [
      "stack-hero", "hero-stack", "triple-stack", "hero-stack", "stack-hero"
    ];
    
    let logoIndex = 0;
    let patternIndex = 0;
    
    while (logoIndex < logos.length) {
      const pattern = patterns[patternIndex % patterns.length];
      const itemsNeeded = pattern === "triple-stack" ? 4 : 3;
      const items: LogoItem[] = [];
      
      for (let i = 0; i < itemsNeeded && logoIndex < logos.length; i++) {
        items.push(logos[logoIndex % logos.length]);
        logoIndex++;
      }
      
      if (items.length >= 3) {
        groups.push({
          id: `group-${groups.length}`,
          pattern,
          items,
        });
      }
      
      patternIndex++;
    }
    
    return groups;
  }, [logos]);

  const duplicatedGroups = useMemo(() => {
    return [...mosaicGroups, ...mosaicGroups];
  }, [mosaicGroups]);

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
            className={`flex gap-6 py-4 ${shouldAnimate ? "logo-carousel-track" : ""}`}
            style={{
              width: "max-content",
            }}
          >
            {duplicatedGroups.map((group, index) => (
              <MosaicGroupComponent 
                key={`${group.id}-${index}`} 
                group={group} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
