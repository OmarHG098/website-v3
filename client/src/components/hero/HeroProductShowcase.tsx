import type { HeroProductShowcase as HeroProductShowcaseType } from "@shared/schema";
import VideoPlayer from "@/components/VideoPlayer";

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
          <div className="md:col-span-3 flex flex-col items-center justify-start">
            <div className="text-center md:text-left relative">
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
                  className="text-3xl lg:text-4xl font-medium mb-6"
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
            </div>
          </div>
          
          <div className="md:col-span-2 w-full md:w-auto flex justify-center md:justify-start">
            <VideoPlayer 
              videoId={data.video_id} 
              title={data.video_title || data.title}
              className="w-[280px] md:w-full md:max-w-[400px]"
              ratio={data.video_ratio || "9:12"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
