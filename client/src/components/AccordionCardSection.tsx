import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccordionItem {
  heading: string;
  text: string;
}

interface AccordionCardData {
  title?: string;
  description?: string;
  bullets?: AccordionItem[];
  footer?: string;
  image?: string;
  image_alt?: string;
  reverse?: boolean;
}

interface AccordionCardSectionProps {
  data: AccordionCardData;
}

export default function AccordionCardSection({ data }: AccordionCardSectionProps) {
  const { title, description, bullets, footer, image, image_alt, reverse } = data;

  return (
    <section className="py-14" data-testid="section-accordion-card">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`grid grid-cols-1 md:grid-cols-12 md:min-h-[580px] ${reverse ? "md:flex-row-reverse" : ""}`}>
              <div className={`col-span-1 md:col-span-7 p-6 md:p-10 flex flex-col justify-center ${reverse ? "md:order-2" : "md:order-1"}`}>
                {title && (
                  <h2 
                    className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                    data-testid="text-accordion-card-title"
                  >
                    {title}
                  </h2>
                )}
                
                {description && (
                  <p 
                    className="text-muted-foreground mb-6"
                    data-testid="text-accordion-card-description"
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
                    data-testid="text-accordion-card-footer"
                  >
                    {footer}
                  </p>
                )}
              </div>

              {image && (
                <div className={`col-span-1 md:col-span-5 flex items-center justify-center p-6 md:p-8 bg-muted/30 ${reverse ? "md:order-1" : "md:order-2"}`}>
                  <img
                    src={image}
                    alt={image_alt || ""}
                    className="w-full max-w-[300px] md:max-w-full object-contain rounded-lg"
                    data-testid="img-accordion-card"
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
