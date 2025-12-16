import { Card, CardContent } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";

interface CardGridSectionData {
  type: "card_grid";
  version?: string;
  background?: string;
  heading: string;
  description?: string;
  image?: string;
  image_alt?: string;
  cards: Array<{
    text: string;
    icon?: string;
  }>;
}

interface CardGridSectionProps {
  data: CardGridSectionData;
}

export function CardGridSection({ data }: CardGridSectionProps) {
  const backgroundClass = data.background || "bg-background";

  return (
    <section 
      className={`py-14 ${backgroundClass}`}
      data-testid="section-card-grid"
    >
      <div className="max-w-6xl mx-auto px-4">
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-12 gap-0">
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center">
                <h2 
                  className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                  data-testid="text-card-grid-heading"
                >
                  {data.heading}
                </h2>
                {data.description && (
                  <p 
                    className="text-muted-foreground text-base md:text-lg"
                    data-testid="text-card-grid-description"
                  >
                    {data.description}
                  </p>
                )}
              </div>
              {data.image && (
                <div className="md:col-span-5 flex items-center justify-center p-6 md:p-8">
                  <img
                    src={data.image}
                    alt={data.image_alt || ""}
                    className="w-full max-w-[220px] md:max-w-[280px] object-contain"
                    data-testid="img-card-grid-main"
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
                className="h-full"
                data-testid={`card-bullet-${index}`}
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

export default CardGridSection;
