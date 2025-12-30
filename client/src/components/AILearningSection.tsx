import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import type { AILearningSection as AILearningSectionType } from "@shared/schema";
import type { ComponentType } from "react";
import rigobotLogo from "@assets/rigobot-logo_1764707022198.webp";
import { cn } from "@/lib/utils";
import { UniversalImage } from "@/components/UniversalImage";
import { UniversalVideo } from "@/components/UniversalVideo";

interface AILearningSectionProps {
  data: AILearningSectionType;
}

interface FeatureBullet {
  text: string;
  icon?: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  show_rigobot_logo?: boolean;
  bullets?: FeatureBullet[];
  video_url?: string;
  image_id?: string;
  cta?: {
    text: string;
    url: string;
    variant?: string;
  };
}

interface HoverFeatureCardProps {
  feature: Feature;
  index: number;
  isSelected: boolean;
  isHovering: boolean;
  onHover: () => void;
  onLeave: () => void;
  showRigobotLogo: boolean;
  getIcon: (iconName: string, isRigobot?: boolean) => JSX.Element | null;
}

function HoverFeatureCard({ feature, index, isSelected, isHovering, onHover, onLeave, showRigobotLogo, getIcon }: HoverFeatureCardProps) {
  const isActive = isSelected || isHovering;
  
  return (
    <Card 
      className={cn(
        "border-0 shadow-none cursor-pointer transition-all duration-300 ease-out",
        isSelected
          ? "bg-primary/5 scale-[1.08]"
          : "bg-[#f0f0f04d] dark:bg-[#ffffff0d] scale-100"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      data-testid={`feature-ai-${index}`}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-colors",
            isActive ? "bg-primary/20" : "bg-primary/10"
          )}>
            {getIcon(feature.icon, false)}
          </div>
          <h3 className="font-semibold text-foreground flex-1">
            {feature.title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const features = data.features || [];
  const displayedFeature = features[selectedIndex];

  const getIcon = (iconName: string, isRigobot: boolean = false, isLarge: boolean = false) => {
    if (isRigobot) {
      return (
        <img 
          src={rigobotLogo} 
          alt="Rigobot" 
          className={isLarge ? "w-full h-full object-cover" : "w-7 h-7 object-contain"}
        />
      );
    }
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number; className?: string }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={isLarge ? 32 : 24} className="text-primary" /> : null;
  };

  const videoId = data.video_url ? extractYouTubeId(data.video_url) : null;

  return (
    <section 
      className=""
      data-testid="section-ai-learning"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="text-h2 mb-4 text-foreground"
            data-testid="text-ai-title"
          >
            {data.title}
          </h2>
          
          <p 
            className="text-body text-muted-foreground max-w-3xl mx-auto"
            data-testid="text-ai-description"
          >
            {data.description}
          </p>
        </div>

        {/* Hover Feature Cards */}
        <div className="grid md:grid-cols-3 gap-3 md:gap-6 mb-8">
          {features.slice(0, 3).map((feature, index) => {
            const showRigobotLogo = feature.show_rigobot_logo ?? feature.title?.toLowerCase().includes('rigobot') ?? false;
            return (
              <HoverFeatureCard
                key={index}
                feature={feature}
                index={index}
                isSelected={selectedIndex === index}
                isHovering={hoverIndex === index}
                onHover={() => {
                  setHoverIndex(index);
                  setSelectedIndex(index);
                }}
                onLeave={() => {
                  setHoverIndex(null);
                }}
                showRigobotLogo={showRigobotLogo}
                getIcon={getIcon}
              />
            );
          })}
        </div>

        {/* Displayed Feature Content */}
        {displayedFeature && (
          <Card 
            className="border-0 shadow-card mb-16 transition-all duration-300"
            data-testid="selected-feature-content"
          >
            <CardContent className="p-6 md:p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                      {getIcon(displayedFeature.icon, displayedFeature.show_rigobot_logo ?? displayedFeature.title?.toLowerCase().includes('rigobot'), true)}
                    </div>
                    <h3 className="text-h2 text-foreground">
                      {displayedFeature.title}
                    </h3>
                  </div>
                  
                  {displayedFeature.description && (
                    <p className="text-muted-foreground text-body leading-relaxed mb-4">
                      {displayedFeature.description}
                    </p>
                  )}
                  
                  {displayedFeature.bullets && displayedFeature.bullets.length > 0 && (
                    <ul className="space-y-3 mb-6" data-testid="feature-bullets">
                      {displayedFeature.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-primary flex-shrink-0 mt-0.5">
                            {bullet.icon ? getIcon(bullet.icon) : <TablerIcons.IconCheck size={20} />}
                          </span>
                          <span className="text-muted-foreground">{bullet.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {displayedFeature.cta && (
                    <Button
                      variant={displayedFeature.cta.variant === "primary" ? "default" : displayedFeature.cta.variant === "outline" ? "outline" : "secondary"}
                      asChild
                      data-testid="button-feature-cta"
                    >
                      <a href={displayedFeature.cta.url}>{displayedFeature.cta.text}</a>
                    </Button>
                  )}
                </div>
                
                {/* Feature-specific media: image_id, video_url (MP4/YouTube), or fallback */}
                {displayedFeature.image_id ? (
                  <div data-testid="image-container-feature">
                    <UniversalImage
                      id={displayedFeature.image_id}
                      preset="card-wide"
                      className="aspect-video"
                      bordered={true}
                    />
                  </div>
                ) : displayedFeature.video_url ? (
                  <div data-testid="video-container-feature">
                    <UniversalVideo
                      url={displayedFeature.video_url}
                      autoplay={displayedFeature.video_url.includes('.mp4')}
                      loop={displayedFeature.video_url.includes('.mp4')}
                      muted={displayedFeature.video_url.includes('.mp4')}
                      bordered={true}
                    />
                  </div>
                ) : videoId ? (
                  <div data-testid="video-container-ai">
                    <UniversalVideo
                      url={data.video_url!}
                      bordered={true}
                    />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Highlight Section (separate from hover cards) */}
        {data.highlight && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-testid="highlight-block" className={data.video_position === "left" ? "lg:order-2" : ""}>
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
                    className="text-h2 text-foreground mb-2"
                    data-testid="text-highlight-title"
                  >
                    {data.highlight.title}
                  </h3>
                </div>
              </div>
              
              <p 
                className="mb-6 text-muted-foreground text-body"
                data-testid="text-highlight-description"
              >
                {data.highlight.description}
              </p>

              {data.highlight.bullets && data.highlight.bullets.length > 0 && (
                <div className="flex flex-col justify-center gap-3 mb-6" data-testid="highlight-bullets">
                  {data.highlight.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-3 ">
                      <div className="flex items-center gap-2">
                        <span className="text-primary flex-shrink-0">
                          {bullet.icon ? getIcon(bullet.icon) : <TablerIcons.IconCheck size={20} />}
                        </span>
                        <span className="text-muted-foreground">{bullet.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
            
            {!videoId && data.video_url && (
              <div 
                className={`relative aspect-video rounded-card overflow-hidden shadow-card ${data.video_position === "left" ? "lg:order-1" : ""}`}
                data-testid="video-container-highlight"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(data.video_url)}`}
                  title="Learn with 4Geeks"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  data-testid="iframe-youtube-highlight"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
