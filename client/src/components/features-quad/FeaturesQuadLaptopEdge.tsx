import * as TablerIcons from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { FeatureQuadSection } from "@shared/schema";
import { UniversalImage } from "@/components/UniversalImage";
import laptopCodeEditor from "@assets/243f0f155c3d1683ecfaa1020801b365ad23092d_1769656566581.png";

interface FeaturesQuadLaptopEdgeProps {
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

export function FeaturesQuadLaptopEdge({ data }: FeaturesQuadLaptopEdgeProps) {
  const isCompact = data.compact === true;
  const CardComponent = isCompact ? CompactCard : FullCard;
  const images = data.images || [];

  return (
    <section 
      className="relative overflow-hidden"
      data-testid="section-features-quad-laptop"
    >
      {/* Background split */}
      <div className="hidden lg:block">
        <div 
          className="absolute right-0 top-0 bottom-0 w-[20%] bg-primary/10"
          aria-hidden="true"
        />
        <div 
          className="absolute left-0 top-0 bottom-0 w-[80%] bg-muted"
          aria-hidden="true"
        />
      </div>
      {/* Mobile/tablet full bg */}
      <div className="lg:hidden absolute inset-0 bg-muted" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 py-14">
        {/* ===== MOBILE LAYOUT ===== */}
        <div className="md:hidden space-y-4">
          {/* Images above title */}
          {images.length > 0 && (
            <div className="flex items-stretch gap-2 bg-primary/5 p-2 rounded-card max-h-[50px]" data-testid="img-features-quad-mobile">
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
          {/* Title and description */}
          <div className="text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-features-quad-heading">
              {data.heading}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>
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
          <div className="flex gap-6 items-stretch">
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-bold text-foreground mb-3" data-testid="text-features-quad-heading-tablet">
                {data.heading}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">{data.description}</p>
            </div>
            {images.length > 0 && (
              <div className="flex items-stretch gap-3 bg-primary/5 w-[300px] p-3 rounded-card max-h-[200px] min-h-24" data-testid="img-features-quad-tablet">
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

        {/* ===== DESKTOP LAYOUT with laptop ===== */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-9 space-y-6">
              <div className="flex justify-between items-stretch">
                <div className="text-left me-24">
                  <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-features-quad-heading-desktop">
                    {data.heading}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{data.description}</p>
                </div>
                {images.length > 0 && (
                  <div className="flex items-stretch gap-3 bg-primary/5 p-4 rounded-card max-w-[400px] min-h-28" data-testid="img-features-quad-desktop">
                    {images.slice(0, 4).map((image, index) => (
                      <div key={index} className="flex-1">
                        <UniversalImage
                          id={image.image_id}
                          alt={image.alt || `Image ${index + 1}`}
                          className="w-[35px] h-full object-cover object-top rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
                <div className="grid grid-cols-2 gap-4" data-testid="cards-features-quad-desktop">
                  {data.cards.map((card, index) => (
                    <CardComponent key={index} card={card} index={index} />
                  ))}
                </div>
                {data.footer_description && (
                  <p className="text-base text-muted-foreground leading-relaxed italic">{data.footer_description}</p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Laptop image - desktop only */}
      <div className="hidden lg:flex absolute lg:right-[-400px] xl:right-[-270px] top-0 bottom-0 w-[700px] items-center pointer-events-none">
        <img 
          src={laptopCodeEditor}
          alt="Code editor on laptop"
          className="w-[90%] max-w-none h-auto object-contain object-left"
          loading="lazy"
          data-testid="img-features-quad-laptop"
        />
      </div>
    </section>
  );
}
