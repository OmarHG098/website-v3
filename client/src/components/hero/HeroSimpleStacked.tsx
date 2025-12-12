import type { HeroSimpleStacked as HeroSimpleStackedType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

interface HeroSimpleStackedProps {
  data: HeroSimpleStackedType;
}

const getIcon = (iconName: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
};

export function HeroSimpleStacked({ data }: HeroSimpleStackedProps) {
  return (
    <section 
      className={`py-12 md:py-16 ${data.background || "bg-gradient-to-b from-primary/5 to-background"}`}
      data-testid="section-hero"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-2xl mb-8">
            {data.badge && (
              <span 
                className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
                data-testid="text-hero-badge"
              >
                {data.badge}
              </span>
            )}
            
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight"
              data-testid="text-hero-title"
            >
              {data.title}
            </h1>
            
            {data.subtitle && (
              <p 
                className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
            )}

            {data.cta_buttons && data.cta_buttons.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
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

          <div className="w-full max-w-md">
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
