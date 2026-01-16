import type { BannerSection as BannerSectionType } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface BannerProps {
  data: BannerSectionType;
}

export function Banner({ data }: BannerProps) {
  const { avatars, title, description, cta, background = "gradient" } = data;

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

  const renderAvatars = () => {
    if (!avatars || avatars.length === 0) return null;

    return (
      <div 
        className="flex justify-center -mt-14 mb-6"
        data-testid="banner-avatars"
      >
        <div className="flex -space-x-3">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="w-14 h-14 rounded-full border-4 border-white overflow-hidden flex items-center justify-center"
              style={{ 
                backgroundColor: avatar.background_color || "hsl(var(--muted))",
                zIndex: avatars.length - index,
              }}
              data-testid={`banner-avatar-${index}`}
            >
              <img 
                src={avatar.src} 
                alt={avatar.alt || ""} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section 
      className="py-12 md:py-16"
      data-testid="section-banner"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div 
          className="relative rounded-[0.8rem] px-6 pt-10 pb-12 md:px-12 md:pt-10 md:pb-16 text-center"
          style={getBackgroundStyle()}
          data-testid="banner-container"
        >
          {renderAvatars()}

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
