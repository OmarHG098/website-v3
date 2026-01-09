import type { CTABannerSection as CTABannerSectionType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "wouter";
import { useSession } from "@/contexts/SessionContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { LeadForm } from "@/components/LeadForm";

interface CTABannerSectionProps {
  data: CTABannerSectionType;
}

export function CTABannerSection({ data }: CTABannerSectionProps) {
  const sessionContext = useSession();
  const session = sessionContext?.session;
  const isMobile = useIsMobile();
  
  const isUS = session?.geo?.country_code === 'US' || session?.location?.country_code === 'US';
  
  const filteredButtons = data.buttons?.filter(button => {
    if (button.us_only && !isUS) {
      return false;
    }
    return true;
  });
  
  const hasMultipleButtons = filteredButtons && filteredButtons.length > 0;
  const hasMobileForm = data.mobile_form && isMobile;
  
  return (
    <section 
      className="px-4 text-primary-foreground"
      data-testid="section-cta-banner"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 
          className="text-primary-foreground mb-4"
          data-testid="text-cta-banner-title"
        >
          {data.title}
        </h2>
        {data.subtitle && (
          <p 
            className="text-body opacity-90 mb-6 max-w-2xl mx-auto" style={{ fontSize: '16px' }}
            data-testid="text-cta-banner-subtitle"
          >
            {data.subtitle}
          </p>
        )}
        
        {hasMobileForm ? (
          <div 
            className="max-w-md mx-auto"
            data-testid="cta-banner-mobile-form"
          >
            <LeadForm data={data.mobile_form!} />
          </div>
        ) : hasMultipleButtons ? (
          <div className="flex flex-wrap justify-center gap-4 pb-2">
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
        ) : data.cta_text && data.cta_url ? (
          <Link href={data.cta_url}>
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
        ) : null}
      </div>
    </section>
  );
}
