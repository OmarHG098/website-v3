import { useMemo } from "react";
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
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

interface FaqItem {
  question: string;
  answer: string;
  locations?: string[];
  related_features?: string[];
  last_updated?: string;
  priority?: number;
}

interface SimpleFaq {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  data: FAQSectionType;
}

const CALENDLY_URL = "https://calendly.com/epilowsky-4geeksacademy/30min?month=2025-12";

function filterFaqsByRelatedFeatures(
  faqs: FaqItem[],
  options: {
    relatedFeatures?: string[];
    location?: string;
    limit?: number;
  } = {}
): SimpleFaq[] {
  const { relatedFeatures, location, limit } = options;
  let filtered = [...faqs];

  if (location) {
    filtered = filtered.filter((faq) => {
      const locations = faq.locations || ["all"];
      return locations.includes("all") || locations.includes(location);
    });
  }

  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.filter((faq) => {
      const faqFeatures = faq.related_features || [];
      return relatedFeatures.some((feature) => faqFeatures.includes(feature));
    });
  }

  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aFeatures = a.related_features || [];
      const bFeatures = b.related_features || [];
      const aMatchCount = relatedFeatures.filter((f) => aFeatures.includes(f)).length;
      const bMatchCount = relatedFeatures.filter((f) => bFeatures.includes(f)).length;
      
      if (bMatchCount !== aMatchCount) {
        return bMatchCount - aMatchCount;
      }
      return (b.priority ?? 0) - (a.priority ?? 0);
    });
  } else {
    filtered = filtered.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  if (limit !== undefined && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return filtered.map(({ question, answer }) => ({ question, answer }));
}

export function FAQSection({ data }: FAQSectionProps) {
  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  
  const isUsOrCanada = location?.country_code === 'US' || location?.country_code === 'CA';
  
  const hasInlineItems = data.items && data.items.length > 0;
  const hasRelatedFeatures = data.related_features && data.related_features.length > 0;
  
  const { data: faqsData, isLoading } = useQuery<{ faqs: FaqItem[] }>({
    queryKey: ["/api/faqs", locale],
    enabled: hasRelatedFeatures,
    staleTime: 5 * 60 * 1000,
  });
  
  const faqItems: SimpleFaq[] = useMemo(() => {
    if (hasRelatedFeatures && faqsData?.faqs) {
      return filterFaqsByRelatedFeatures(faqsData.faqs, {
        relatedFeatures: data.related_features!,
        location: location?.country_code,
        limit: 9,
      });
    }
    
    if (hasInlineItems) {
      return data.items!;
    }
    
    return [];
  }, [hasRelatedFeatures, hasInlineItems, data.related_features, data.items, faqsData, location?.country_code]);
  
  if (isLoading && hasRelatedFeatures) {
    return (
      <section data-testid="section-faq">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 w-64 bg-muted rounded mx-auto mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </div>
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
                  className="text-muted-foreground pb-4 leading-relaxed whitespace-pre-line"
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
