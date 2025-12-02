import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconMessageCircle } from "@tabler/icons-react";
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
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-10 text-center text-foreground"
          data-testid="text-faq-title"
        >
          {data.title}
        </h2>
        
        <Accordion type="single" collapsible className="space-y-3 max-w-3xl mx-auto">
          {data.items.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-card text-[22px]"
              data-testid={`accordion-faq-${index}`}
            >
              <AccordionTrigger 
                className="text-left font-medium text-foreground hover:no-underline py-5"
                data-testid={`button-faq-${index}`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent 
                className="text-muted-foreground pb-5 leading-relaxed"
                data-testid={`text-faq-answer-${index}`}
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {data.cta && (
          <div 
            className="mt-12 text-center p-8 rounded-lg bg-muted/30 border max-w-3xl mx-auto"
            data-testid="faq-cta"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IconMessageCircle size={24} className="text-primary" />
              </div>
            </div>
            <p className="text-lg text-foreground mb-4">{data.cta.text}</p>
            <Button asChild data-testid="button-faq-cta">
              <a href={data.cta.button_url}>{data.cta.button_text}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
