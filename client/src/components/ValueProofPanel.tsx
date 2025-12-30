import { memo } from "react";
import type { ValueProofPanelSection, EvidenceItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { UniversalVideo } from "@/components/UniversalVideo";
import {
  IconTrophy,
  IconHeadset,
  IconUsers,
  IconCertificate,
  IconShieldCheck,
  IconBuildingBank,
  IconBriefcase,
  IconAward,
  IconStar,
  IconCheck,
  type Icon as TablerIconType,
} from "@tabler/icons-react";

interface ValueProofPanelProps {
  data: ValueProofPanelSection;
}

const iconMap: Record<string, TablerIconType> = {
  Trophy: IconTrophy,
  Headset: IconHeadset,
  Users: IconUsers,
  Certificate: IconCertificate,
  ShieldCheck: IconShieldCheck,
  BuildingBank: IconBuildingBank,
  Briefcase: IconBriefcase,
  Award: IconAward,
  Star: IconStar,
  Check: IconCheck,
};

function getIcon(iconName?: string): TablerIconType | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

function EvidenceCard({ 
  icon, 
  title, 
  description,
  index 
}: { 
  icon?: string; 
  title: string; 
  description: string;
  index: number;
}) {
  const IconComponent = getIcon(icon);
  
  return (
    <div 
      className="flex gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border transition-colors"
      data-testid={`card-evidence-item-${index}`}
    >
      {IconComponent && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <IconComponent className="text-primary" size={20} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground mb-1" data-testid="text-evidence-title">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-evidence-description">
          {description}
        </p>
      </div>
    </div>
  );
}

function MediaFrame({ 
  media, 
  style = "rounded" 
}: { 
  media: NonNullable<ValueProofPanelSection["media"]>;
  style?: "rounded" | "organic" | "circle";
}) {
  const aspectRatioClasses: Record<string, string> = {
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
    "16:9": "aspect-video",
    "3:4": "aspect-[3/4]",
  };
  
  const styleClasses: Record<string, string> = {
    rounded: "rounded-2xl",
    organic: "rounded-[2rem_0.5rem_2rem_0.5rem]",
    circle: "rounded-full",
  };
  
  const aspectClass = media.aspect_ratio ? aspectRatioClasses[media.aspect_ratio] : "aspect-[4/3]";
  const shapeClass = styleClasses[style];
  
  return (
    <div 
      className={`relative overflow-hidden ${aspectClass} ${shapeClass} bg-muted shadow-sm`}
      data-testid="media-frame"
    >
      {media.type === "video" ? (
        <UniversalVideo
          url={media.src}
          ratio={media.aspect_ratio || "4:3"}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={media.src}
          alt={media.alt || ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
}

export const ValueProofPanel = memo(function ValueProofPanel({ data }: ValueProofPanelProps) {
  const {
    title,
    subtitle,
    evidence_items,
    media,
    cta,
    background,
    reverse_layout = false,
  } = data;

  const backgroundClass = background === "muted" 
    ? "bg-muted" 
    : background === "card" 
      ? "bg-card" 
      : "bg-background";

  const contentOrder = reverse_layout ? "md:order-2" : "md:order-1";
  const mediaOrder = reverse_layout ? "md:order-1" : "md:order-2";

  return (
    <section 
      className={`py-16 md:py-20 ${backgroundClass}`}
      data-testid="section-value-proof-panel"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Content Column */}
          <div className={`col-span-1 ${media ? "md:col-span-7" : "md:col-span-12"} ${contentOrder}`}>
            {/* Header */}
            <div className="mb-8">
              <h2 
                className="text-h2 text-foreground mb-4"
                data-testid="text-value-proof-title"
              >
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-lg text-muted-foreground max-w-xl"
                  data-testid="text-value-proof-subtitle"
                >
                  {subtitle}
                </p>
              )}
            </div>

            {/* Evidence Items */}
            <div className="space-y-3 mb-8">
              {evidence_items.map((item: EvidenceItem, index: number) => (
                <EvidenceCard
                  key={index}
                  index={index}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>

            {/* CTA Button */}
            {cta && (
              <Button
                variant={cta.variant === "primary" ? "default" : cta.variant === "outline" ? "outline" : "secondary"}
                size="lg"
                asChild
                data-testid="button-value-proof-cta"
              >
                <a href={cta.url}>{cta.text}</a>
              </Button>
            )}
          </div>

          {/* Media Column */}
          {media && (
            <div className={`col-span-1 md:col-span-5 ${mediaOrder}`}>
              <div className="sticky top-8 z-50">
                <MediaFrame media={media} style={media.style} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default ValueProofPanel;
