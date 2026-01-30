import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { FeatureQuadSection } from "@shared/schema";
import { UniversalImage } from "@/components/UniversalImage";

interface FeaturesQuadDefaultProps {
  data: FeatureQuadSection;
}

function CompactCard({ card, index }: { card: { icon: string; title: string; description: string }; index: number }) {
  const IconComponent = (TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number }>>)[`Icon${card.icon}`];
  return (
    <div 
      className="flex items-center gap-3 p-3 bg-card rounded-lg shadow-sm"
      data-testid={`features-quad-card-compact-${index}`}
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {IconComponent && <IconComponent className="text-primary" size={16} />}
      </div>
      <span className="text-sm font-medium text-foreground">{card.title}</span>
    </div>
  );
}

function FullCard({ card, index }: { card: { icon: string; title: string; description: string }; index: number }) {
  const IconComponent = (TablerIcons as unknown as Record<string, ComponentType<{ className?: string; size?: number }>>)[`Icon${card.icon}`];
  return (
    <div 
      className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm"
      data-testid={`features-quad-card-${index}`}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {IconComponent && <IconComponent className="text-primary" size={24} />}
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
        <p className="text-sm text-muted-foreground">{card.description}</p>
      </div>
    </div>
  );
}

export function FeaturesQuadDefault({ data }: FeaturesQuadDefaultProps) {
  const backgroundClass = data.background || "bg-background";
  const images = data.images || [];
  const isCompact = data.compact === true;
  const CardComponent = isCompact ? CompactCard : FullCard;

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-features-quad"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* ===== MOBILE LAYOUT ===== */}
        <div className="md:hidden space-y-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-foreground mb-3" data-testid="text-features-quad-heading">
              {data.heading}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>
          {images.length > 0 && (
            <div className="flex justify-center gap-3 w-full" data-testid="img-features-quad-mobile">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="flex-1 h-36">
                  <UniversalImage
                    id={image.image_id}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover object-top rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
          <div className={`grid ${isCompact ? "grid-cols-2 gap-3" : "grid-cols-1 gap-6"}`} data-testid="cards-features-quad-mobile">
            {data.cards.map((card, index) => (
              <CardComponent key={index} card={card} index={index} />
            ))}
          </div>
          {data.footer_description && (
            <p className="text-sm text-muted-foreground leading-relaxed italic text-center">{data.footer_description}</p>
          )}
        </div>

        {/* ===== TABLET LAYOUT ===== */}
        <div className="hidden md:block lg:hidden space-y-8">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-7 text-left">
              <h2 className="text-3xl font-bold text-foreground mb-3" data-testid="text-features-quad-heading-tablet">
                {data.heading}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
            </div>
            {images.length > 0 && (
              <div className="col-span-5 flex gap-3" data-testid="img-features-quad-tablet">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="flex-1 h-40">
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
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-7 text-left">
              <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-features-quad-heading-desktop">
                {data.heading}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{data.description}</p>
            </div>
            {images.length > 0 && (
              <div className="col-span-5 flex items-start gap-4 bg-primary/5 p-4 rounded-card" data-testid="img-features-quad-desktop">
                {images.slice(0, 4).map((image, index) => (
                  <div key={index} className="flex-1 h-44">
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
