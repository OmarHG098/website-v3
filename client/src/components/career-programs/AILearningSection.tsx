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

  const getCardBackgroundClass = (index: number) => {
    const backgroundClasses = [
      "bg-blue-50 dark:bg-blue-950/20",
      "bg-muted/40",
      "bg-blue-50 dark:bg-blue-950/20",
    ];
    return backgroundClasses[index] || "bg-background";
  };

  const videoId = data.video_url ? extractYouTubeId(data.video_url) : null;

  return (
    <section 
      className="py-16 bg-muted/30"
      data-testid="section-ai-learning"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          {data.badge && (
            <Badge 
              variant="secondary" 
              className="mb-4"
              data-testid="badge-ai-learning"
            >
              {data.badge}
            </Badge>
          )}
          
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
          {data.features.slice(0, 3).map((feature, index) => {
            const isRigobot = feature.title.toLowerCase().includes('rigobot');
            return (
              <Card 
                key={index} 
                className={`${getCardBackgroundClass(index)} border text-center`}
                data-testid={`feature-ai-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    {getIcon(feature.icon, isRigobot)}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
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
                  className="mb-6 text-[#666666] text-[18px]"
                  data-testid="text-highlight-description"
                >
                  {data.highlight.description}
                </p>
                
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
