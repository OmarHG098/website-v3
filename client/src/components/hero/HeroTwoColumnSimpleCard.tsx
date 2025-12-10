import type { HeroTwoColumnSimpleCard as HeroTwoColumnSimpleCardType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

interface HeroTwoColumnSimpleCardProps {
  data: HeroTwoColumnSimpleCardType;
}

const getIcon = (iconName: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
};

export function HeroTwoColumnSimpleCard({ data }: HeroTwoColumnSimpleCardProps) {
  return (
    <section 
      className={`py-16 md:py-24 ${data.background || "bg-gradient-to-b from-primary/5 to-background"}`}
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4">

        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <img 
              src={data.image.src} 
              alt={data.image.alt}
              className="w-full h-auto rounded-lg shadow-lg"
              data-testid="img-hero"
            />
          </div>

          <div className="lg:col-span-7 text-center lg:text-left">
            {data.subtitle && (
            <>
              <h1 
                className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4 text-foreground leading-tight text-center lg:text-left"
                data-testid="text-hero-title"
              >
                {data.title}
              </h1>
              <p 
                className="text-lg md:text-xl text-muted-foreground mb-4 leading-relaxed"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
        </>
            )}

            {data.cta_buttons && data.cta_buttons.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {data.cta_buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant === "primary" ? "default" : button.variant}
                    size="lg"
                    asChild
                    data-testid={`button-hero-cta-${index}`}
                  >
                    <a href={button.url} className="flex items-center gap-2">
                      {button.icon && getIcon(button.icon)}
                      {button.text}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
