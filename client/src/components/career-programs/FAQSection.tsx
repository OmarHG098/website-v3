import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQSection as FAQSectionType } from "@shared/schema";

interface FAQSectionProps {
  data: FAQSectionType;
}

export function FAQSection({ data }: FAQSectionProps) {
  return (
    <section 
      className="py-16 bg-background"
      data-testid="section-faq"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-10 text-center text-foreground"
          data-testid="text-faq-title"
        >
          {data.title}
        </h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          {data.items.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-4"
              data-testid={`accordion-faq-${index}`}
            >
              <AccordionTrigger 
                className="text-left font-medium text-foreground hover:no-underline"
                data-testid={`button-faq-${index}`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent 
                className="text-muted-foreground"
                data-testid={`text-faq-answer-${index}`}
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
