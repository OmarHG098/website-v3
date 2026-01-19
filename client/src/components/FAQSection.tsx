import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconMessageCircle, IconLoader2 } from "@tabler/icons-react";
import type { FAQSection as FAQSectionType, FAQ } from "@shared/schema";
import { useLocation } from "@/contexts/SessionContext";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface FAQSectionProps {
  data: FAQSectionType;
}

const CALENDLY_URL = "https://calendly.com/epilowsky-4geeksacademy/30min?month=2025-12";

export function FAQSection({ data }: FAQSectionProps) {
  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  
  const isUsOrCanada = location?.country_code === 'US' || location?.country_code === 'CA';
  
  const hasInlineItems = data.items && data.items.length > 0;
  const hasRelatedFeatures = data.related_features && data.related_features.length > 0;
  
  const { data: fetchedFaqs, isLoading, isError } = useQuery<{ faqs: FAQ[] }>({
    queryKey: ["/api/faqs", locale, data.related_features],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("locale", locale);
      if (data.related_features?.length) {
        params.set("related_features", data.related_features.join(","));
      }
      const response = await fetch(`/api/faqs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      return response.json();
    },
    enabled: !hasInlineItems && hasRelatedFeatures,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
  
  const faqItems: FAQ[] = hasInlineItems 
    ? data.items! 
    : (fetchedFaqs?.faqs || []);
  
  if (!hasInlineItems && isLoading) {
    return (
      <section data-testid="section-faq">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-h2 mb-8 text-center text-foreground" data-testid="text-faq-title">
            {data.title}
          </h2>
          <div className="flex justify-center py-12">
            <IconLoader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        </div>
      </section>
    );
  }
  
  if (!hasInlineItems && isError) {
    return (
      <section data-testid="section-faq">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-h2 mb-8 text-center text-foreground" data-testid="text-faq-title">
            {data.title}
          </h2>
          {data.cta && (
            <div className="text-center p-8 rounded-lg bg-muted/30 border" data-testid="faq-cta">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconMessageCircle size={24} className="text-primary" />
                </div>
              </div>
              <p className="text-lg text-foreground mb-4">{data.cta.text}</p>
              <Button asChild data-testid="button-faq-cta">
                <a href={data.cta.button_url}>
                  {data.cta.button_text}
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }
  
  if (faqItems.length === 0) {
    return null;
  }
  
  return (
    <section 
      data-testid="section-faq"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="mb-8 text-center text-foreground text-[36px]"
          data-testid="text-faq-title"
        >
          {data.title}
        </h2>
        
        <div className="bg-background rounded-card border overflow-hidden">
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
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
