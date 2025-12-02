import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    return IconComponent ? <IconComponent size={28} className="text-primary" /> : null;
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

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {data.features.map((feature, index) => {
              const isRigobot = feature.title.toLowerCase().includes('rigobot');
              return (
                <Card 
                  key={index} 
                  className="bg-background border"
                  data-testid={`feature-ai-${index}`}
                >
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {getIcon(feature.icon, isRigobot)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
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

          {!videoId && data.chat_example && (
            <Card 
              className="bg-background border shadow-lg"
              data-testid="card-chat-example"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                    <img 
                      src={rigobotLogo} 
                      alt="Rigobot" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {data.chat_example.bot_name}
                    </p>
                    <p className="text-xs text-green-500">
                      {data.chat_example.bot_status}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                      <p className="text-sm">{data.chat_example.user_message}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-foreground">{data.chat_example.bot_response}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
