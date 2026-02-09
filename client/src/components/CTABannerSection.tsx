import type { CTABannerSection as CTABannerSectionType, CtaBannerDefault, CtaBannerForm, CtaButton } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "wouter";
import { useSession } from "@/contexts/SessionContext";
import { LeadForm } from "@/components/LeadForm";

interface CTABannerSectionProps {
  data: CTABannerSectionType;
  programContext?: string;
}

function isFormVariant(data: CTABannerSectionType): data is CtaBannerForm {
  return data.variant === "form";
}

function isDefaultVariant(data: CTABannerSectionType): data is CtaBannerDefault {
  return !data.variant || data.variant === "default";
}

export function CTABannerSection({ data, programContext }: CTABannerSectionProps) {
  const sessionContext = useSession();
  const session = sessionContext?.session;
  
  const isUS = session?.geo?.country_code === 'US' || session?.location?.country_code === 'US';

  // Form variant: show form on both mobile and desktop
  if (isFormVariant(data)) {
    return (
      <section 
        className="px-4"
        data-testid="section-cta-banner"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            {/* Left side: Message */}
            <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0 text-primary-foreground">
              <h2 
                className="text-primary-foreground mb-4"
                data-testid="text-cta-banner-title"
              >
                {data.title}
              </h2>
              {data.subtitle && (
                <p 
                  className="text-body opacity-90 max-w-xl" style={{ fontSize: '16px' }}
                  data-testid="text-cta-banner-subtitle"
                >
                  {data.subtitle}
                </p>
              )}
            </div>
            
            {/* Right side: Form */}
            <div 
              className="flex-1 max-w-md mx-auto lg:mx-0"
              data-testid="cta-banner-form"
            >
              {data.form ? (
                <LeadForm data={data.form} programContext={programContext} />
              ) : (
                <div className="bg-card/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <p className="text-primary-foreground/70 text-sm">
                    Lead form configuration required
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Default variant: show buttons on both mobile and desktop
  if (isDefaultVariant(data)) {
    const filteredButtons = data.buttons?.filter((button: CtaButton) => {
      if (button.us_only && !isUS) {
        return false;
      }
      return true;
    });
    
    const hasMultipleButtons = filteredButtons && filteredButtons.length > 0;
    
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
          
          {hasMultipleButtons ? (
            <div className="flex flex-wrap justify-center gap-4 pb-2">
              {filteredButtons!.map((button: CtaButton, index: number) => {
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
  
  // Fallback (shouldn't happen with proper typing)
  return null;
}
