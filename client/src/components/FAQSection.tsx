import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconMessageCircle } from "@tabler/icons-react";
import type { FAQSection as FAQSectionType } from "@shared/schema";
import { useLocation } from "@/contexts/SessionContext";

interface FAQSectionProps {
  data: FAQSectionType;
}

const CALENDLY_URL = "https://calendly.com/epilowsky-4geeksacademy/30min?month=2025-12";

export function FAQSection({ data }: FAQSectionProps) {
  const location = useLocation();
  
  const isUsOrCanada = location?.country_code === 'US' || location?.country_code === 'CA';
  
  return (
    <section 
      data-testid="section-faq"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-h2 mb-8 text-center text-foreground"
          data-testid="text-faq-title"
        >
          {data.title}
        </h2>
        
        <div className="bg-background rounded-card border overflow-hidden">
          <Accordion type="single" collapsible>
            {(data.items || []).map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-0 border-b last:border-b-0 px-6"
                data-testid={`accordion-faq-${index}`}
              >
                <AccordionTrigger 
                  className="text-left font-medium text-foreground hover:no-underline py-4 text-base"
                  data-testid={`button-faq-${index}`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground pb-4 leading-relaxed"
                  data-testid={`text-faq-answer-${index}`}
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {data.cta && isUsOrCanada && (
          <div 
            className="mt-12 text-center p-8 rounded-lg bg-muted/30 border"
            data-testid="faq-cta"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IconMessageCircle size={24} className="text-primary" />
              </div>
            </div>
            <p className="text-lg text-foreground mb-4">{data.cta.text}</p>
            <Button asChild data-testid="button-faq-cta">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                {data.cta.button_text}
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
