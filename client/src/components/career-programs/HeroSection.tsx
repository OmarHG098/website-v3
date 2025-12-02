import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as TablerIcons from "@tabler/icons-react";
import type { HeroSection as HeroSectionType } from "@shared/schema";
import type { ComponentType } from "react";

interface HeroSectionProps {
  data: HeroSectionType;
}

export function HeroSection({ data }: HeroSectionProps) {
  const getIcon = (iconName: string) => {
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background"
      data-testid="section-hero"
    >
      <div className="container mx-auto px-4 text-center">
        {data.badge && (
          <Badge 
            variant="secondary" 
            className="mb-4"
            data-testid="badge-hero"
          >
            {data.badge}
          </Badge>
        )}
        
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
          data-testid="text-hero-title"
        >
          {data.title}
        </h1>
        
        {data.subtitle && (
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            data-testid="text-hero-subtitle"
          >
            {data.subtitle}
          </p>
        )}
        
        <div className="flex flex-wrap justify-center gap-4">
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
      </div>
    </section>
  );
}
