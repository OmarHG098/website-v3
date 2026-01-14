import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import type {
  HeroProductShowcase as HeroProductShowcaseType,
  HeroApplyFormProductShowcase,
} from "@shared/schema";
import { UniversalVideo } from "@/components/UniversalVideo";
import { Button } from "@/components/ui/button";
import { IconStarFilled, IconArrowRight } from "@tabler/icons-react";
import { LeadForm, type LeadFormData } from "@/components/LeadForm";

interface HeroProductShowcaseProps {
  data: HeroProductShowcaseType | HeroApplyFormProductShowcase;
}

export function HeroProductShowcase({ data }: HeroProductShowcaseProps) {
  // Hide background image on screens smaller than 1280px for better mobile experience
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setShowBackground(window.innerWidth >= 1280);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Safely access properties that may not exist on all variants
  const backgroundImage =
    "background_image" in data ? data.background_image : null;
  const welcomeText = "welcome_text" in data ? data.welcome_text : null;
  const subtitle = "subtitle" in data ? data.subtitle : null;
  const video = "video" in data ? data.video : null;
  const image = "image" in data ? data.image : null;
  const marquee = "marquee" in data ? data.marquee : null;

  const shouldShowBackground = backgroundImage && showBackground;

  const colorMap: Record<string, string> = {
    primary: "hsl(var(--primary))",
    accent: "hsl(var(--accent))",
    destructive: "hsl(var(--destructive))",
    "chart-1": "hsl(var(--chart-1))",
    "chart-2": "hsl(var(--chart-2))",
    "chart-3": "hsl(var(--chart-3))",
    "chart-4": "hsl(var(--chart-4))",
    "chart-5": "hsl(var(--chart-5))",
  };

  return (
    <section
      id="hero-form"
      className="relative overflow-hidden"
      style={
        shouldShowBackground
          ? {
              backgroundImage: `url(${backgroundImage!.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-start">
          <div className="md:col-span-3 flex flex-col items-center md:items-start justify-start min-w-0">
            <div className="text-center md:text-left relative w-full min-w-0">
              {welcomeText && (
                <p className="text-body text-muted-foreground mb-4">
                  {welcomeText}
                </p>
              )}

              {data.brand_mark && (
                <h1 className="font-heading text-h1 tracking-tight mb-3">
                  {data.brand_mark.prefix && (
                    <span className="text-foreground">
                      {data.brand_mark.prefix}{" "}
                    </span>
                  )}
                  <span
                    style={{
                      color: colorMap[data.brand_mark.color || "primary"],
                    }}
                  >
                    {data.brand_mark.highlight}
                  </span>
                  {data.brand_mark.suffix && (
                    <span className="text-foreground">
                      {" "}
                      {data.brand_mark.suffix}
                    </span>
                  )}
                </h1>
              )}
              <h2 
                className="text-4xl lg:text-5xl font-medium mb-2 text-foreground"
                data-testid="text-hero-title"
              >
                {data.title}
              </h2>

              {subtitle && (
                <p
                  className="text-body text-muted-foreground mb-8 max-w-xl leading-relaxed"
                  data-testid="text-hero-subtitle"
                >
                  {subtitle}
                </p>
              )}

              {data.description && (
                <div className="relative">
                  <p className="text-body text-foreground mb-0 md:mb-10 max-w-xl leading-relaxed">
                    {data.description}
                  </p>
                </div>
              )}

              {marquee && marquee.items && marquee.items.length > 0 && (
                <div className="w-full max-w-xl mt-6 mb-8 overflow-hidden" data-testid="hero-embedded-marquee">
                  <Marquee
                    speed={marquee.speed || 40}
                    pauseOnHover={false}
                    gradient={marquee.gradient ?? true}
                    gradientColor={marquee.gradientColor}
                    gradientWidth={marquee.gradientWidth || 50}
                    autoFill={true}
                  >
                    {marquee.items.map((item, index) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-center mx-4 transition-opacity duration-brand ease-brand hover:opacity-80"
                        data-testid={`hero-marquee-item-${index}`}
                      >
                        {item.logo ? (
                          <img 
                            src={item.logo} 
                            alt={item.alt}
                            className={`${item.logoHeight || "h-8 md:h-12"} w-auto object-contain`}
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
              )}

              {data.form && (
                <div className="mt-2 mb-8 flex justify-center md:justify-start">
                  <LeadForm
                    data={
                      {
                        ...data.form,
                        variant: data.form.variant || "inline",
                        consent: data.form.consent,
                        show_terms: data.form.show_terms ?? false,
                        className: "w-full max-w-md",
                      } as LeadFormData
                    }
                  />
                </div>
              )}

              {data.cta_button && !data.form && (
                <div className="mt-2 mb-8">
                  <Button
                    variant={
                      data.cta_button.variant === "outline"
                        ? "outline"
                        : "default"
                    }
                    size="lg"
                    asChild
                    data-testid="button-hero-cta"
                  >
                    <a href={data.cta_button.url}>
                      {data.cta_button.text}
                      <IconArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}

              {data.trust_bar && (
                <div className="flex justify-center md:justify-start">
                  <div className="inline-flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-muted/50 rounded-card px-4 py-3 transition-all duration-brand ease-brand">
                    <div className="flex flex-col gap-1">
                      {data.trust_bar.rating && (
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const rating = parseFloat(
                                data.trust_bar!.rating || "0",
                              );
                              const fullStars = Math.floor(rating);
                              const hasHalf = rating % 1 >= 0.5;
                              const isHalfStar =
                                hasHalf && star === fullStars + 1;

                              if (star <= fullStars) {
                                return (
                                  <IconStarFilled
                                    key={star}
                                    className="h-6 w-6 text-yellow-500"
                                  />
                                );
                              } else if (isHalfStar) {
                                return (
                                  <div key={star} className="relative h-6 w-6">
                                    <IconStarFilled className="h-6 w-6 text-muted" />
                                    <div
                                      className="absolute inset-0 overflow-hidden"
                                      style={{ width: "50%" }}
                                    >
                                      <IconStarFilled className="h-6 w-6 text-yellow-500" />
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <IconStarFilled
                                    key={star}
                                    className="h-6 w-6 text-muted"
                                  />
                                );
                              }
                            })}
                          </div>
                        </div>
                      )}
                      {data.trust_bar.review_count && (
                        <span className="text-[12px] font-bold">
                          {data.trust_bar.review_count}
                        </span>
                      )}
                    </div>
                    {data.trust_bar.review_logos &&
                      data.trust_bar.review_logos.length > 0 && (
                        <div className="flex items-center gap-3">
                          {data.trust_bar.review_logos.map((logo, index) =>
                            logo.logo ? (
                              <img
                                key={index}
                                src={logo.logo}
                                alt={logo.name}
                                className="h-10 object-contain"
                                data-testid={`img-review-logo-${index}`}
                              />
                            ) : (
                              <span
                                key={index}
                                className="font-medium text-foreground"
                                data-testid={`text-review-logo-${index}`}
                              >
                                {logo.name}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 w-full md:w-auto flex justify-center md:justify-start">
            {video ? (
              <UniversalVideo
                url={video.url}
                ratio={video.ratio || "16:9"}
                muted={video.muted}
                autoplay={video.autoplay}
                loop={video.loop}
                preview_image_url={video.preview_image_url}
                withShadowBorder={video.with_shadow_border}
                className="w-[280px] md:w-full md:max-w-[400px]"
              />
            ) : image ? (
              <img
                src={image.src}
                alt={image.alt}
                className="w-full max-w-[500px] rounded-card shadow-card"
                data-testid="img-hero-product"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
