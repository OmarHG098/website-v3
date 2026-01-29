import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionBullet {
  heading: string;
  text: string;
}

interface TwoColumnAccordionCardImageBackgroundData {
  title?: string;
  description?: string;
  bullets?: AccordionBullet[];
  footer?: string;
  image?: string;
  image_alt?: string;
  reverse?: boolean;
}

interface TwoColumnAccordionCardImageBackgroundProps {
  data: TwoColumnAccordionCardImageBackgroundData;
}

export function TwoColumnAccordionCardImageBackground({ data }: TwoColumnAccordionCardImageBackgroundProps) {
  const { title, description, bullets, footer, image, image_alt, reverse } = data;

  return (
    <section className="" data-testid="section-two-column-accordion-card">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className={`grid grid-cols-1 md:grid-cols-12 md:min-h-[580px] ${reverse ? "md:flex-row-reverse" : ""}`}>
              <div className={`col-span-1 md:col-span-7 p-6 md:p-10 flex flex-col justify-center ${reverse ? "md:order-2" : "md:order-1"}`}>
                {title && (
                  <h2 
                    className="text-h2 text-foreground mb-4"
                    data-testid="text-two-column-accordion-title"
                  >
                    {title}
                  </h2>
                )}
                
                {description && (
                  <p 
                    className="text-muted-foreground mb-6"
                    data-testid="text-two-column-accordion-description"
                  >
                    {description}
                  </p>
                )}

                {bullets && bullets.length > 0 && (
                  <Accordion type="single" collapsible defaultValue="item-0" className="w-full" data-testid="accordion-bullets">
                    {bullets.map((bullet, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                          {bullet.heading}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {bullet.text}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}

                {footer && (
                  <p 
                    className="text-muted-foreground mt-6 text-sm italic"
                    data-testid="text-two-column-accordion-footer"
                  >
                    {footer}
                  </p>
                )}
              </div>

              {image && (
                <div className={`col-span-1 md:col-span-5 flex items-center ${reverse ? "md:order-1 justify-start" : "md:order-2 justify-end"}`}>
                  <div 
                    className={`relative bg-primary/30 rounded-2xl py-14 ${reverse ? "pr-4 pl-0" : "pl-4 pr-0"} flex ${reverse ? "justify-start" : "justify-end"} min-h-[300px] md:min-h-[400px] w-full`}
                    data-testid="img-two-column-accordion-background"
                  >
                    <div className="w-[90%]">
                      <img
                        src={image}
                        alt={image_alt || ""}
                        className={`w-full h-auto ${reverse ? "rounded-r-lg" : "rounded-l-lg"} shadow-lg object-contain`}
                        data-testid="img-two-column-accordion"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
