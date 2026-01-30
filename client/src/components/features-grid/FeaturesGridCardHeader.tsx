import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "../custom-icons";
import type { FeaturesGridCardHeaderSection } from "@shared/schema";

const { IconCheck } = TablerIcons;

interface FeaturesGridCardHeaderProps {
  data: FeaturesGridCardHeaderSection;
}

export function FeaturesGridCardHeader({ data }: FeaturesGridCardHeaderProps) {
  const backgroundClass = data.background || "bg-background";

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-features-grid-card-header"
    >
      <div className="max-w-6xl mx-auto px-4">
        <Card className="mb-8 overflow-hidden border-t-4 border-t-primary/20">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-12 gap-0">
              <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-center">
                <h2 
                  className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                  data-testid="text-features-grid-heading"
                >
                  {data.heading}
                </h2>
                {data.description && (
                  <p 
                    className="text-muted-foreground text-base md:text-lg"
                    data-testid="text-features-grid-description"
                  >
                    {data.description}
                  </p>
                )}
                {data.cta && (
                  <Button 
                    asChild
                    className="mt-4 w-fit"
                    data-testid="button-features-grid-cta"
                  >
                    <a href={data.cta.url}>{data.cta.text}</a>
                  </Button>
                )}
              </div>
              {data.image && (
                <div className="md:col-span-4 flex items-center justify-center p-6 md:p-8">
                  <img
                    src={data.image}
                    alt={data.image_alt || ""}
                    className="w-full max-w-[220px] md:max-w-[280px] object-contain"
                    data-testid="img-features-grid-main"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {data.cards.map((card, index) => {
            const CustomIcon = card.icon ? getCustomIcon(card.icon) : null;
            const iconName = card.icon ? `Icon${card.icon}` : "IconCheck";
            const TablerIcon = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || IconCheck;
            
            return (
              <Card 
                key={index} 
                className="h-full border-b-4 border-b-primary/20"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-5 flex flex-col items-start gap-3">
                  {CustomIcon ? (
                    <CustomIcon width="32" height="32" className="w-8 h-8" />
                  ) : (
                    <TablerIcon className="w-8 h-8 text-primary" />
                  )}
                  <p className="text-foreground text-sm md:text-base">
                    {card.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGridCardHeader;
