import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { FeatureQuadSection } from "@shared/schema";
import { UniversalImage } from "@/components/UniversalImage";
import { Button } from "@/components/ui/button";

interface FeaturesQuadDefaultProps {
  data: FeatureQuadSection;
}

function CompactCard({ card, index }: { card: { icon: string; title?: string; description?: string }; index: number }) {
  const IconComponent = (TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number }>>)[`Icon${card.icon}`];
  const hasTitle = !!card.title;
  const hasDescription = !!card.description;
  const hasOnlyOne = (hasTitle && !hasDescription) || (!hasTitle && hasDescription);
  
  return (
    <div 
      className={`flex items-center gap-3 p-3 bg-card rounded-lg shadow-sm ${hasOnlyOne ? "justify-center" : ""}`}
      data-testid={`features-quad-card-compact-${index}`}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {IconComponent && <IconComponent className="text-primary" size={16} />}
      </div>
      {hasTitle && <span className="text-sm font-medium text-foreground">{card.title}</span>}
      {!hasTitle && hasDescription && <span className="text-sm text-muted-foreground">{card.description}</span>}
    </div>
  );
}

function FullCard({ card, index }: { card: { icon: string; title?: string; description?: string }; index: number }) {
  const IconComponent = (TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number }>>)[`Icon${card.icon}`];
  const hasTitle = !!card.title;
  const hasDescription = !!card.description;
  const hasOnlyOne = (hasTitle && !hasDescription) || (!hasTitle && hasDescription);
  
  return (
    <div 
      className={`flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm ${hasOnlyOne ? "items-center" : ""}`}
      data-testid={`features-quad-card-${index}`}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {IconComponent && <IconComponent className="text-primary" size={24} />}
      </div>
      <div className={`flex flex-col ${hasOnlyOne ? "justify-center" : ""}`}>
        {hasTitle && <h3 className={`font-semibold text-foreground ${hasDescription ? "mb-1" : ""}`}>{card.title}</h3>}
        {hasDescription && <p className="text-sm text-muted-foreground">{card.description}</p>}
      </div>
    </div>
  );
}

export function FeaturesQuadDefault({ data }: FeaturesQuadDefaultProps) {
  const backgroundClass = data.background || "bg-background";
  const images = data.images || [];
  const isCompact = data.compact === true;
  const CardComponent = isCompact ? CompactCard : FullCard;
  const hasHeading = !!data.heading;
  const hasDescription = !!data.description;
  const hasOnlyOne = (hasHeading && !hasDescription) || (!hasHeading && hasDescription);
  const textAlign = hasOnlyOne ? "text-center" : "text-left";

  const getButtonVariant = (variant?: string) => {
    if (variant === "primary") return "default";
    if (variant === "outline") return "outline";
    return "secondary";
  };

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-features-quad"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* ===== MOBILE LAYOUT ===== */}
        <div className="md:hidden space-y-4">
          {/* Images above title - centered when only one text element */}
          {images.length > 0 && (
            <div className={`flex ${hasOnlyOne ? "justify-center" : ""}`}>
              <div className="flex items-stretch gap-2 bg-primary/5 p-2 rounded-card h-20 w-fit" data-testid="img-features-quad-mobile">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="w-10">
                    <UniversalImage
                      id={image.image_id}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Title and description */}
          {(hasHeading || hasDescription) && (
            <div className={textAlign}>
              {hasHeading && (
                <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-features-quad-heading">
                  {data.heading}
                </h2>
              )}
              {hasDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.description}
                </p>
              )}
              {data.cta && (
                <Button
                  variant={getButtonVariant(data.cta.variant)}
                  asChild
                  className="mt-4"
                  data-testid="button-features-quad-cta-mobile"
                >
                  <a href={data.cta.url}>{data.cta.text}</a>
                </Button>
              )}
            </div>
          )}
          {/* Cards stacked vertically - always compact on mobile */}
          <div className="grid grid-cols-1 gap-2" data-testid="cards-features-quad-mobile">
            {data.cards.map((card, index) => (
              <CompactCard key={index} card={card} index={index} />
            ))}
          </div>
          {data.footer_description && (
            <p className="text-xs text-muted-foreground leading-relaxed italic text-center">{data.footer_description}</p>
          )}
        </div>

        {/* ===== TABLET LAYOUT ===== */}
        <div className="hidden md:block lg:hidden space-y-8">
          <div className={`flex gap-6 items-stretch ${hasOnlyOne && images.length === 0 ? "justify-center" : ""}`}>
            <div className={`flex-1 ${textAlign} ${hasOnlyOne && images.length === 0 ? "flex-initial" : ""}`}>
              {hasHeading && (
                <h2 className="text-3xl font-bold text-foreground mb-3" data-testid="text-features-quad-heading-tablet">
                  {data.heading}
                </h2>
              )}
              {hasDescription && (
                <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
              )}
              {data.cta && (
                <Button
                  variant={getButtonVariant(data.cta.variant)}
                  asChild
                  className="mt-4"
                  data-testid="button-features-quad-cta-tablet"
                >
                  <a href={data.cta.url}>{data.cta.text}</a>
                </Button>
              )}
            </div>
            {images.length > 0 && (
              <div className="flex items-stretch gap-3 bg-primary/5 p-3 rounded-card w-[300px] h-32" data-testid="img-features-quad-tablet">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="flex-1">
                    <UniversalImage
                      id={image.image_id}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4" data-testid="cards-features-quad-tablet">
            {data.cards.map((card, index) => (
              <CardComponent key={index} card={card} index={index} />
            ))}
          </div>
          {data.footer_description && (
            <p className="text-sm text-muted-foreground leading-relaxed italic text-left">{data.footer_description}</p>
          )}
        </div>

        {/* ===== DESKTOP LAYOUT ===== */}
        <div className="hidden lg:block space-y-8">
          <div className={`flex gap-8 items-stretch ${hasOnlyOne && images.length === 0 ? "justify-center" : ""}`}>
            <div className={`flex-1 ${textAlign} ${hasOnlyOne && images.length === 0 ? "flex-initial" : ""}`}>
              {hasHeading && (
                <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-features-quad-heading-desktop">
                  {data.heading}
                </h2>
              )}
              {hasDescription && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{data.description}</p>
              )}
              {data.cta && (
                <Button
                  variant={getButtonVariant(data.cta.variant)}
                  asChild
                  className="mt-4"
                  data-testid="button-features-quad-cta-desktop"
                >
                  <a href={data.cta.url}>{data.cta.text}</a>
                </Button>
              )}
            </div>
            {images.length > 0 && (
              <div className="flex items-stretch gap-4 bg-primary/5 p-4 rounded-card w-[370px] h-36" data-testid="img-features-quad-desktop">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="flex-1">
                    <UniversalImage
                      id={image.image_id}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6" data-testid="cards-features-quad-desktop">
            {data.cards.map((card, index) => (
              <CardComponent key={index} card={card} index={index} />
            ))}
          </div>
          {data.footer_description && (
            <p className="text-base text-muted-foreground leading-relaxed italic">{data.footer_description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
