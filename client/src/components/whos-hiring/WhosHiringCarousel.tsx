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

const SMALL_CARD_HEIGHT_MOBILE = 85;
const SMALL_CARD_HEIGHT_DESKTOP = 130;
const GAP_MOBILE = 10;
const GAP_DESKTOP = 16;
const HERO_CARD_HEIGHT_MOBILE = SMALL_CARD_HEIGHT_MOBILE * 2 + GAP_MOBILE;
const HERO_CARD_HEIGHT_DESKTOP = SMALL_CARD_HEIGHT_DESKTOP * 2 + GAP_DESKTOP;

function LogoCard({ 
  logo, 
  size = "normal",
  heroText,
  isMobile,
}: { 
  logo: LogoItem; 
  size?: "small" | "normal" | "hero";
  heroText?: string;
  isMobile?: boolean;
}) {
  const isHero = size === "hero";
  const isSmall = size === "small";
  
  const smallHeight = isMobile ? SMALL_CARD_HEIGHT_MOBILE : SMALL_CARD_HEIGHT_DESKTOP;
  const heroHeight = isMobile ? HERO_CARD_HEIGHT_MOBILE : HERO_CARD_HEIGHT_DESKTOP;

  const cardStyle = {
    height: isHero ? `${heroHeight}px` : isSmall ? `${smallHeight}px` : (isMobile ? "100px" : "150px"),
    width: isHero ? (isMobile ? "220px" : "340px") : isSmall ? (isMobile ? "156px" : "240px") : (isMobile ? "182px" : "280px"),
  };

  return (
    <div
      className={`
        logo-card
        flex-shrink-0
        rounded-[0.8rem]
        border border-border/80
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]
        transition-all duration-200
        hover:border-border/40 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06)]
        ${isHero ? "flex flex-col justify-between p-6" : "flex items-center justify-center p-5"}
      `}
      style={{
        ...cardStyle,
        background: 'linear-gradient(hsl(var(--secondary) / 0.5), hsl(var(--secondary) / 0.5)), hsl(var(--background))',
      }}
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

function MosaicGroupComponent({ group, textIndex, isMobile }: { group: MosaicGroup; textIndex: number; isMobile: boolean }) {
  const { pattern, items } = group;
  const heroText = heroCardTexts[textIndex % heroCardTexts.length];
  const heroHeight = isMobile ? HERO_CARD_HEIGHT_MOBILE : HERO_CARD_HEIGHT_DESKTOP;
  const gap = isMobile ? GAP_MOBILE : GAP_DESKTOP;

  if (pattern === "stack-hero" && items.length >= 3) {
    return (
      <div className="flex" style={{ height: `${heroHeight}px`, gap: `${gap}px` }}>
        <div className="flex flex-col" style={{ gap: `${gap}px` }}>
          <LogoCard logo={items[0]} size="small" isMobile={isMobile} />
          <LogoCard logo={items[1]} size="small" isMobile={isMobile} />
        </div>
        <LogoCard logo={items[2]} size="hero" heroText={heroText} isMobile={isMobile} />
      </div>
    );
  }

  if (pattern === "hero-stack" && items.length >= 3) {
    return (
      <div className="flex" style={{ height: `${heroHeight}px`, gap: `${gap}px` }}>
        <LogoCard logo={items[0]} size="hero" heroText={heroText} isMobile={isMobile} />
        <div className="flex flex-col" style={{ gap: `${gap}px` }}>
          <LogoCard logo={items[1]} size="small" isMobile={isMobile} />
          <LogoCard logo={items[2]} size="small" isMobile={isMobile} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ height: `${heroHeight}px`, gap: `${gap}px` }}>
      {items.map((item, i) => (
        <LogoCard key={i} logo={item} size="normal" isMobile={isMobile} />
      ))}
    </div>
  );
}

export function WhosHiringCarousel({ data }: WhosHiringCarouselProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const logos = data.logos || [];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mobileQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener("change", handler);
    return () => mobileQuery.removeEventListener("change", handler);
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
      className="bg-background overflow-hidden"
      data-testid="section-whos-hiring-carousel"
    >
      <div className="bg-primary/5 py-4 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          {data.label && (
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
              {data.label}
            </p>
          )}
          <h2 
            className="text-h2 mb-4 text-foreground"
            data-testid="text-whos-hiring-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p 
              className="text-body mb-4 text-muted-foreground max-w-2xl mx-auto text-primary"
              data-testid="text-whos-hiring-subtitle"
            >
              {data.subtitle}
            </p>
          )}
        </div>
      </div>

      <div 
        className="relative pb-8"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.05) 0%, hsl(var(--primary) / 0.05) 73%, transparent 73%)' }}
      >
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-primary/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <Marquee
          speed={40}
          pauseOnHover={false}
          gradient={false}
          direction="left"
          autoFill={true}
          className="gap-4"
        >
          {mosaicGroups.map((group, index) => (
            <div key={`${group.id}-${index}`} className={isMobile ? "ml-2" : "ml-4"}>
              <MosaicGroupComponent 
                group={group}
                textIndex={index}
                isMobile={isMobile}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
