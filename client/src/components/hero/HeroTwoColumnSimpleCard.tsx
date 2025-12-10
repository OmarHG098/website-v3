import type { HeroTwoColumnSimpleCard as HeroTwoColumnSimpleCardType } from "@shared/schema";

interface HeroTwoColumnSimpleCardProps {
  data: HeroTwoColumnSimpleCardType;
}

export function HeroTwoColumnSimpleCard({ data }: HeroTwoColumnSimpleCardProps) {
  return (
    <section 
      className={`py-16 md:py-24 ${data.background || "bg-gradient-to-b from-primary/5 to-background"}`}
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 
              className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 text-foreground leading-tight"
              data-testid="text-hero-title"
            >
              {data.title}
            </h1>
            
            {data.subtitle && (
              <p 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
            )}
          </div>

          <div className="lg:col-span-2 relative">
            <img 
              src={data.image.src} 
              alt={data.image.alt}
              className="w-full h-auto rounded-lg shadow-lg"
              data-testid="img-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
