import { useState, useEffect, useMemo } from "react";
import Marquee from "react-fast-marquee";
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
  pattern: "stack-hero" | "hero-stack";
  items: LogoItem[];
}

const heroCardTexts = [
  "Building the future of work together.",
  "Transforming ideas into digital experiences.",
  "Innovating at the intersection of design and technology.",
  "Empowering teams to ship faster.",
  "Creating seamless user experiences.",
  "Scaling solutions for modern businesses.",
  "Redefining how teams collaborate.",
  "Shaping the next generation of products.",
];

const SMALL_CARD_HEIGHT = 130;
const GAP = 16;
const HERO_CARD_HEIGHT = SMALL_CARD_HEIGHT * 2 + GAP;

function LogoCard({ 
  logo, 
  size = "normal",
  heroText,
}: { 
  logo: LogoItem; 
  size?: "small" | "normal" | "hero";
  heroText?: string;
}) {
  const isHero = size === "hero";
  const isSmall = size === "small";

  const cardStyle = {
    height: isHero ? `${HERO_CARD_HEIGHT}px` : isSmall ? `${SMALL_CARD_HEIGHT}px` : "150px",
    width: isHero ? "340px" : isSmall ? "240px" : "280px",
  };

  return (
    <div
      className={`
        flex-shrink-0
        rounded-[0.8rem]
        bg-muted
        border border-border/20
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]
        transition-all duration-200
        hover:bg-muted/50 hover:border-border/40 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)]
        ${isHero ? "flex flex-col justify-between p-6" : "flex items-center justify-center p-5"}
      `}
      style={cardStyle}
    >
      {isHero ? (
        <>
          <div className="flex items-start">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-10 max-w-[140px] object-contain logo-grayscale"
              loading="lazy"
            />
          </div>
          <p className="text-sm text-muted-foreground/70 leading-relaxed">
            {heroText}
          </p>
        </>
      ) : (
        <img
          src={logo.src}
          alt={logo.alt}
          className="h-10 max-w-[160px] object-contain logo-grayscale"
          loading="lazy"
        />
      )}
    </div>
  );
}

function MosaicGroupComponent({ group, textIndex }: { group: MosaicGroup; textIndex: number }) {
  const { pattern, items } = group;
  const heroText = heroCardTexts[textIndex % heroCardTexts.length];

  if (pattern === "stack-hero" && items.length >= 3) {
    return (
      <div className="flex gap-4" style={{ height: `${HERO_CARD_HEIGHT}px` }}>
        <div className="flex flex-col gap-4">
          <LogoCard logo={items[0]} size="small" />
          <LogoCard logo={items[1]} size="small" />
        </div>
        <LogoCard logo={items[2]} size="hero" heroText={heroText} />
      </div>
    );
  }

  if (pattern === "hero-stack" && items.length >= 3) {
    return (
      <div className="flex gap-4" style={{ height: `${HERO_CARD_HEIGHT}px` }}>
        <LogoCard logo={items[0]} size="hero" heroText={heroText} />
        <div className="flex flex-col gap-4">
          <LogoCard logo={items[1]} size="small" />
          <LogoCard logo={items[2]} size="small" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4" style={{ height: `${HERO_CARD_HEIGHT}px` }}>
      {items.map((item, i) => (
        <LogoCard key={i} logo={item} size="normal" />
      ))}
    </div>
  );
}

export function WhosHiringCarousel({ data }: WhosHiringCarouselProps) {
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
    const patterns: Array<"stack-hero" | "hero-stack"> = ["stack-hero", "hero-stack"];
    
    let logoIndex = 0;
    let patternIndex = 0;
    
    while (logoIndex < logos.length) {
      const pattern = patterns[patternIndex % patterns.length];
      const items: LogoItem[] = [];
      
      for (let i = 0; i < 3 && logoIndex < logos.length; i++) {
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

  if (logos.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-section-lg bg-background overflow-hidden"
      data-testid="section-whos-hiring-carousel"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
            Customer Stories
          </p>
          <h2 
            className="text-h2 mb-4 text-foreground"
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

      <div className="relative py-8">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <Marquee
          speed={40}
          pauseOnHover={true}
          gradient={false}
          direction="left"
          autoFill={true}
          className="gap-4"
        >
          {mosaicGroups.map((group, index) => (
            <div key={`${group.id}-${index}`} className="ml-4">
              <MosaicGroupComponent 
                group={group}
                textIndex={index}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
