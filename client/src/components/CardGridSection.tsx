import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as TablerIcons from "@tabler/icons-react";
import { IconCheck } from "@tabler/icons-react";

interface AccordionCardItem {
  title: string;
  content: string;
  icon?: string;
}

interface CardGridSectionData {
  type: "card_grid";
  version?: string;
  background?: string;
  heading: string;
  description?: string;
  image?: string;
  image_alt?: string;
  cards: AccordionCardItem[];
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
        <Card className="overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-7 flex flex-col justify-start">
                <h2 
                  className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                  data-testid="text-card-grid-heading"
                >
                  {data.heading}
                </h2>
                {data.description && (
                  <p 
                    className="text-muted-foreground text-base md:text-lg mb-6"
                    data-testid="text-card-grid-description"
                  >
                    {data.description}
                  </p>
                )}
                
                <Accordion type="single" collapsible className="w-full">
                  {data.cards.map((card, index) => {
                    const iconName = card.icon ? `Icon${card.icon}` : "IconCheck";
                    const IconComponent = (TablerIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || IconCheck;
                    
                    return (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`}
                        className="border-b border-border"
                        data-testid={`accordion-item-${index}`}
                      >
                        <AccordionTrigger 
                          className="text-left text-base md:text-lg font-medium py-4 hover:no-underline"
                          data-testid={`accordion-trigger-${index}`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>{card.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent 
                          className="text-muted-foreground text-sm md:text-base pb-4 pl-8"
                          data-testid={`accordion-content-${index}`}
                        >
                          {card.content}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
              
              {data.image && (
                <div className="md:col-span-5 flex items-center justify-center">
                  <img
                    src={data.image}
                    alt={data.image_alt || ""}
                    className="w-full max-w-[320px] object-contain"
                    data-testid="img-card-grid-main"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default CardGridSection;
