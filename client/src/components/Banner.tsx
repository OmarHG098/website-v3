import type { BannerSection as BannerSectionType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";

interface BannerProps {
  data: BannerSectionType;
}

export function Banner({ data }: BannerProps) {
  const { icon, title, description, cta, background = "gradient" } = data;

  const getBackgroundStyle = () => {
    switch (background) {
      case "gradient":
        return {
          background: "linear-gradient(135deg, #366bff 0%, #4aa5ff 100%)",
        };
      case "muted":
        return { backgroundColor: "hsl(var(--muted))" };
      case "card":
        return { backgroundColor: "hsl(var(--card))" };
      case "background":
      default:
        return { backgroundColor: "hsl(var(--background))" };
    }
  };

  const isGradient = background === "gradient";
  const textColorClass = isGradient ? "text-white" : "text-foreground";
  const descriptionColorClass = isGradient ? "text-white/85" : "text-muted-foreground";

  const renderIcon = () => {
    if (!icon) return null;

    const iconBgColor = icon.background_color || "hsl(var(--primary))";

    if (icon.type === "image" && icon.src) {
      return (
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-8 mb-6"
          style={{ backgroundColor: iconBgColor }}
          data-testid="banner-icon"
        >
          <img 
            src={icon.src} 
            alt={icon.alt || ""} 
            className="w-10 h-10 object-contain"
          />
        </div>
      );
    }

    if (icon.type === "tabler" && icon.name) {
      const IconComponent = (TablerIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[icon.name];
      if (IconComponent) {
        return (
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-8 mb-6"
            style={{ backgroundColor: iconBgColor }}
            data-testid="banner-icon"
          >
            <IconComponent size={32} className="text-white" />
          </div>
        );
      }
    }

    return null;
  };

  return (
    <section 
      className="py-12 md:py-16"
      data-testid="section-banner"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div 
          className="rounded-[0.8rem] px-6 py-12 md:px-12 md:py-16 text-center"
          style={getBackgroundStyle()}
          data-testid="banner-container"
        >
          {renderIcon()}

          <h2 
            className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 max-w-3xl mx-auto ${textColorClass}`}
            data-testid="text-banner-title"
          >
            {title}
          </h2>

          {description && (
            <p 
              className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 ${descriptionColorClass}`}
              data-testid="text-banner-description"
            >
              {description}
            </p>
          )}

          {cta && (
            <Button
              variant={
                cta.variant === "primary" ? (isGradient ? "secondary" : "default") :
                cta.variant === "secondary" ? "secondary" :
                "outline"
              }
              size="lg"
              asChild
              className={cta.variant === "outline" && isGradient ? "border-white text-white hover:bg-white/10" : ""}
              data-testid="button-banner-cta"
            >
              <a href={cta.url}>{cta.text}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
