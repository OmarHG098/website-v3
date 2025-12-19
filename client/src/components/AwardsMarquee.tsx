import Marquee from "react-fast-marquee";

export interface AwardsMarqueeItem {
  id: string;
  logo?: string;
  alt: string;
  logoHeight?: string;
  source?: string;
  name?: string;
  year?: string;
}

interface AwardsMarqueeProps {
  items: AwardsMarqueeItem[];
  speed?: number;
  gradient?: boolean;
  gradientColor?: string;
  gradientWidth?: number;
  className?: string;
}

export function AwardsMarquee({ 
  items, 
  speed = 40,
  gradient = true,
  gradientColor,
  gradientWidth = 100,
  className = "",
}: AwardsMarqueeProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="pb-section">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <p className="text-body text-muted-foreground max-w-3xl mx-auto text-center">Recognized, Rated, and Recommended</p>
      </div>
      <div className={`mx-12 ${className}`} data-testid="awards-marquee">
        <Marquee
          speed={speed}
          pauseOnHover={false}
          gradient={gradient}
          gradientColor={gradientColor}
          gradientWidth={gradientWidth}
          autoFill={true}
        >
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="flex items-center justify-center mx-4 transition-opacity duration-brand ease-brand hover:opacity-80"
              data-testid={`marquee-item-${index}`}
            >
              {item.logo ? (
                <img 
                  src={item.logo} 
                  alt={item.alt}
                  className={`${item.logoHeight || "h-12 md:h-20"} w-auto object-contain`}
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {item.source} {item.year && `${item.year}`}
                  </span>
                  <span className="text-sm font-medium text-foreground mt-0.5">
                    {item.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

export default AwardsMarquee;
