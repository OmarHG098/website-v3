import type { HeroProductShowcase as HeroProductShowcaseType } from "@shared/schema";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { IconStarFilled, IconArrowRight } from "@tabler/icons-react";
import { LeadForm, type LeadFormData } from "@/components/LeadForm";

interface HeroProductShowcaseProps {
  data: HeroProductShowcaseType;
}

export function HeroProductShowcase({ data }: HeroProductShowcaseProps) {
  const colorMap: Record<string, string> = {
    "primary": "hsl(var(--primary))",
    "accent": "hsl(var(--accent))",
    "destructive": "hsl(var(--destructive))",
    "chart-1": "hsl(var(--chart-1))",
    "chart-2": "hsl(var(--chart-2))",
    "chart-3": "hsl(var(--chart-3))",
    "chart-4": "hsl(var(--chart-4))",
    "chart-5": "hsl(var(--chart-5))",
  };

  return (
    <section 
      className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden"
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-3 flex flex-col items-center md:items-start justify-start">
            <div className="text-center md:text-left relative w-full">
              {data.welcome_text && (
                <p className="text-4xl lg:text-5xl font-medium text-foreground">
                  {data.welcome_text}
                </p>
              )}
              
              {data.brand_mark && (
                <p className="text-5xl lg:text-6xl tracking-tight mb-2 font-[1000]">
                  {data.brand_mark.prefix && (
                    <span className="text-foreground">{data.brand_mark.prefix}</span>
                  )}
                  <span style={{ color: colorMap[data.brand_mark.color || "primary"] }}>
                    {data.brand_mark.highlight}
                  </span>
                  {data.brand_mark.suffix && (
                    <span className="text-foreground">{data.brand_mark.suffix}</span>
                  )}
                </p>
              )}
              
              <h1 
                className="text-4xl lg:text-5xl font-medium mb-2 text-foreground"
                data-testid="text-hero-title"
              >
                {data.title}
              </h1>
              
              {data.subtitle && (
                <p 
                  className="text-xl lg:text-2xl text-muted-foreground mb-6 max-w-xl"
                  data-testid="text-hero-subtitle"
                >
                  {data.subtitle}
                </p>
              )}
              
              {data.description && (
                <div className="relative">
                  <p className="text-xl text-foreground mb-8 max-w-xl font-semibold">
                    {data.description}
                  </p>
                </div>
              )}

              {data.form && (
                <LeadForm 
                  data={{
                    ...data.form,
                    variant: data.form.variant || "inline",
                    show_consent: data.form.show_consent ?? false,
                    show_terms: data.form.show_terms ?? false,
                    className: "w-full max-w-md mb-6",
                  } as LeadFormData}
                />
              )}

              {data.cta_button && !data.form && (
                <div className="mb-6">
                  <Button 
                    variant={data.cta_button.variant === "outline" ? "outline" : "default"}
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
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {data.trust_bar.rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <IconStarFilled 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= Math.floor(parseFloat(data.trust_bar!.rating || "0"))
                                ? "text-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{data.trust_bar.rating}</span>
                    </div>
                  )}
                  {data.trust_bar.review_count && (
                    <span>{data.trust_bar.review_count}</span>
                  )}
                  {data.trust_bar.review_logos && data.trust_bar.review_logos.length > 0 && (
                    <div className="flex items-center gap-3">
                      {data.trust_bar.review_logos.map((logo, index) => (
                        logo.logo ? (
                          <img 
                            key={index}
                            src={logo.logo} 
                            alt={logo.name}
                            className="h-5 object-contain"
                            data-testid={`img-review-logo-${index}`}
                          />
                        ) : (
                          <span key={index} className="font-medium text-foreground" data-testid={`text-review-logo-${index}`}>
                            {logo.name}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 w-full md:w-auto flex justify-center md:justify-start">
            {data.video_id ? (
              <VideoPlayer 
                videoId={data.video_id} 
                title={data.video_title || data.title}
                className="w-[280px] md:w-full md:max-w-[400px]"
                ratio={data.video_ratio || "9:12"}
              />
            ) : data.image ? (
              <img
                src={data.image.src}
                alt={data.image.alt}
                className="w-full max-w-[500px] rounded-lg shadow-lg"
                data-testid="img-hero-product"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
