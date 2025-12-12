import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { AILearningSection as AILearningSectionType } from "@shared/schema";
import type { ComponentType } from "react";
import rigobotLogo from "@assets/rigobot-logo_1764707022198.webp";

interface AILearningSectionProps {
  data: AILearningSectionType;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function AILearningSection({ data }: AILearningSectionProps) {
  const getIcon = (iconName: string, isRigobot: boolean = false) => {
    if (isRigobot) {
      return (
        <img 
          src={rigobotLogo} 
          alt="Rigobot" 
          className="w-7 h-7 object-contain"
        />
      );
    }
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={24} className="text-primary" /> : null;
  };

  const videoId = data.video_url ? extractYouTubeId(data.video_url) : null;

  return (
    <section 
      className="py-16"
      data-testid="section-ai-learning"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            data-testid="text-ai-title"
          >
            {data.title}
          </h2>
          
          <p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            data-testid="text-ai-description"
          >
            {data.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {(data.features || []).slice(0, 3).map((feature, index) => {
            const isRigobot = feature.title.toLowerCase().includes('rigobot');
            return (
              <Card 
                key={index} 
                className="bg-[#f0f0f04d] dark:bg-[#ffffff0d] border-0 shadow-none"
                data-testid={`feature-ai-${index}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getIcon(feature.icon, isRigobot)}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(data.highlight || videoId) && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {data.highlight && (
              <div data-testid="highlight-block">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={rigobotLogo} 
                      alt="Rigobot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl md:text-3xl font-bold text-foreground mb-2"
                      data-testid="text-highlight-title"
                    >
                      {data.highlight.title}
                    </h3>
                  </div>
                </div>
                
                <p 
                  className="mb-6 text-muted-foreground text-[18px]"
                  data-testid="text-highlight-description"
                >
                  {data.highlight.description}
                </p>

                {data.highlight.bullets && data.highlight.bullets.length > 0 && (
                  <ul className="space-y-4 mb-6" data-testid="highlight-bullets">
                    {data.highlight.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                        <span className="text-muted-foreground">{bullet.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {data.highlight.cta && (
                  <Button
                    variant={data.highlight.cta.variant === "primary" ? "default" : data.highlight.cta.variant === "outline" ? "outline" : "secondary"}
                    asChild
                    data-testid="button-highlight-cta"
                  >
                    <a href={data.highlight.cta.url}>{data.highlight.cta.text}</a>
                  </Button>
                )}
              </div>
            )}
            
            {videoId && (
              <div 
                className="relative aspect-video rounded-lg overflow-hidden shadow-lg"
                data-testid="video-container-ai"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Learn with 4Geeks"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  data-testid="iframe-youtube-video"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
