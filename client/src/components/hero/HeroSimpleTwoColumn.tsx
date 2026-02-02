import type { HeroSimpleTwoColumn as HeroSimpleTwoColumnType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";

interface HeroSimpleTwoColumnProps {
  data: HeroSimpleTwoColumnType;
}

const getIcon = (iconName: string) => {
  const icons = TablerIcons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const IconComponent = icons[`Icon${iconName}`];
  return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
};

// Default placeholder image when none is provided
const DEFAULT_IMAGE = {
  src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  alt: "Students learning together"
};

export function HeroSimpleTwoColumn({ data }: HeroSimpleTwoColumnProps) {
  const image = data.image || DEFAULT_IMAGE;
  
  return (
    <section 
      className={`${data.background || "bg-gradient-to-b from-primary/5 to-background"}`}
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4">

        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <img 
              src={image.src}
              alt={image.alt}
              className="w-full h-auto rounded-card shadow-card"
              data-testid="img-hero"
            />
          </div>

          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 
              className="text-h1 mb-4 text-foreground text-center lg:text-left"
              data-testid="text-hero-title"
            >
              {data.title}
            </h1>
            {data.subtitle && (
              <p 
                className="text-body text-muted-foreground mb-4 leading-relaxed"
                data-testid="text-hero-subtitle"
              >
                {data.subtitle}
              </p>
            )}
            {data.badge && (
              <span 
                className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
                data-testid="text-hero-badge"
              >
                {data.badge}
              </span>
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
