import { Button } from "@/components/ui/button";
import type { FooterCTASection as FooterCTASectionType } from "@shared/schema";

interface FooterCTASectionProps {
  data: FooterCTASectionType;
}

export function FooterCTASection({ data }: FooterCTASectionProps) {
  return (
    <section 
      className="py-16 bg-primary"
      data-testid="section-footer-cta"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground"
          data-testid="text-footer-cta-title"
        >
          {data.title}
        </h2>
        
        {data.subtitle && (
          <p 
            className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8"
            data-testid="text-footer-cta-subtitle"
          >
            {data.subtitle}
          </p>
        )}
        
        <div className="flex flex-wrap justify-center gap-4">
          {data.buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant === "secondary" ? "secondary" : "outline"}
              size="lg"
              asChild
              className={button.variant === "outline" ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" : ""}
              data-testid={`button-footer-cta-${index}`}
            >
              <a href={button.url}>{button.text}</a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
