import type { HeroTwoColumn } from "@shared/schema";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

interface HeroTwoColumnProps {
  data: HeroTwoColumn;
}

function VideoPlayer({ 
  videoId, 
  title, 
  className = "",
  ratio = "16:9"
}: { 
  videoId: string; 
  title: string;
  className?: string;
  ratio?: string;
}) {
  const aspectRatio = ratio === "9:12" ? "aspect-[9/12]" : "aspect-video";
  
  return (
    <div className={`${aspectRatio} rounded-lg overflow-hidden ${className}`}>
      <LiteYouTubeEmbed
        id={videoId}
        title={title}
        poster="maxresdefault"
        webp
      />
    </div>
  );
}

export function HeroTwoColumn({ data }: HeroTwoColumnProps) {
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
