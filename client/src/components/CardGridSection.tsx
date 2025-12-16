import { Card, CardContent } from "@/components/ui/card";
import { IconCheck } from "@tabler/icons-react";

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
                    className="w-full max-w-[280px] md:max-w-full object-contain"
                    data-testid="img-card-grid-main"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {data.cards.map((card, index) => (
            <Card 
              key={index} 
              className="h-full"
              data-testid={`card-bullet-${index}`}
            >
              <CardContent className="p-5 flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconCheck className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-foreground text-sm md:text-base">
                  {card.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CardGridSection;
