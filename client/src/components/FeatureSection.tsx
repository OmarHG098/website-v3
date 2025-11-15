import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureAction {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

interface DecorationAsset {
  src: string;
  alt: string;
}

interface FeatureSectionProps {
  variant?: "detailed" | "notion";
  title?: string;
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaIcon?: React.ReactNode;
  features?: Feature[];
  actions?: FeatureAction[];
  decorations?: DecorationAsset[];
}

export default function FeatureSection({
  variant = "detailed",
  title,
  heading,
  subheading,
  ctaLabel,
  ctaHref,
  ctaIcon,
  features = [],
  actions = [],
  decorations = [],
}: FeatureSectionProps) {
  if (variant === "notion") {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-8 mb-8">
            <div className="flex-1">
              {heading && (
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{heading}</h2>
              )}
              {subheading && (
                <p className="text-muted-foreground text-lg mb-4">{subheading}</p>
              )}
              {ctaLabel && ctaHref && (
                <a 
                  href={ctaHref}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                  data-testid="link-feature-cta"
                >
                  {ctaLabel}
                  {ctaIcon || <ArrowRight className="w-4 h-4" />}
                </a>
              )}
            </div>
            
            {decorations.length > 0 && (
              <div className="hidden md:flex -space-x-2 items-center">
                {decorations.map((decoration, index) => (
                  <Avatar 
                    key={index} 
                    className="h-10 w-10 border-2 border-background"
                    style={{ zIndex: decorations.length - index }}
                    data-testid={`avatar-decoration-${index}`}
                  >
                    <AvatarImage src={decoration.src} alt={decoration.alt} />
                    <AvatarFallback>{decoration.alt.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => {
              const cardContent = (
                <div className="flex items-center gap-3 w-full">
                  {action.icon && (
                    <img src={action.icon} alt="" className="h-5 w-5 flex-shrink-0" />
                  )}
                  <span className="flex-1 text-left text-sm">{action.label}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                </div>
              );

              if (action.href) {
                return (
                  <Card 
                    key={index}
                    className="hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`button-feature-action-${index}`}
                  >
                    <a href={action.href} className="block">
                      <CardContent className="p-4">
                        {cardContent}
                      </CardContent>
                    </a>
                  </Card>
                );
              }

              return (
                <Card 
                  key={index}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={action.onClick}
                  data-testid={`button-feature-action-${index}`}
                >
                  <CardContent className="p-4">
                    {cardContent}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      {title && (
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      )}
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} data-testid={`card-feature-${index}`}>
            <CardHeader>
              {feature.icon && (
                <div className="mb-2">
                  <img src={feature.icon} alt="" className="h-12 w-12" />
                </div>
              )}
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
