import type { CTABannerSection as CTABannerSectionType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "wouter";
import { useSession } from "@/contexts/SessionContext";

interface CTABannerSectionProps {
  data: CTABannerSectionType;
}

export function CTABannerSection({ data }: CTABannerSectionProps) {
  const { session } = useSession();
  
  const isUS = session.geo?.country_code === 'US' || session.location?.country_code === 'US';
  
  const filteredButtons = data.buttons?.filter(button => {
    if (button.us_only && !isUS) {
      return false;
    }
    return true;
  });
  
  const hasMultipleButtons = filteredButtons && filteredButtons.length > 0;
  
  return (
    <section 
      className="py-16 px-4 bg-primary text-primary-foreground"
      data-testid="section-cta-banner"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          data-testid="text-cta-banner-title"
        >
          {data.title}
        </h2>
        {data.subtitle && (
          <p 
            className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
            data-testid="text-cta-banner-subtitle"
          >
            {data.subtitle}
          </p>
        )}
        
        {hasMultipleButtons ? (
          <div className="flex flex-wrap justify-center gap-4">
            {filteredButtons!.map((button, index) => {
              const variant = button.variant === "primary" ? "default" : button.variant === "secondary" ? "secondary" : "outline";
              const outlineStyles = button.variant === "outline" ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" : "";
              return (
                <Button
                  key={index}
                  variant={variant}
                  size="lg"
                  asChild
                  className={outlineStyles}
                  data-testid={`button-cta-banner-${index}`}
                >
                  <a href={button.url}>{button.text}</a>
                </Button>
              );
            })}
          </div>
        ) : (
          <Link href={data.cta_url || "#"}>
            <Button 
              size="lg" 
              variant="secondary"
              className="font-semibold"
              data-testid="button-cta-banner-action"
            >
              {data.cta_text}
              <IconArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
