import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as TablerIcons from "@tabler/icons-react";
import { IconStarFilled, IconStar } from "@tabler/icons-react";
import type { HeroSingleColumn } from "@shared/schema";
import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import avatar1 from "@assets/generated_images/Woman_profile_headshot_1_608aff01.webp";
import avatar2 from "@assets/generated_images/Man_profile_headshot_1_0850c276.webp";
import avatar3 from "@assets/generated_images/Woman_profile_headshot_2_a0ea2c29.webp";
import avatar4 from "@assets/generated_images/Man_profile_headshot_2_516b72e4.webp";
import forbesLogo from "@assets/forbes-logo-award_1764709625651.webp";
import fortuneLogo from "@assets/fortune-logo_1764709618095.webp";
import newsweekLogoEn from "@assets/newsweek_1764709608255.webp";
import newsweekLogoEs from "@assets/newsweek-es_1764709602003.webp";
import courseReportLogo from "@assets/Course-Report-Badge-2025_1764709632231.webp";
import { AwardBadges, type AwardBadgeItem } from "@/components/AwardBadges";

interface HeroSingleColumnProps {
  data: HeroSingleColumn;
}

export function HeroSingleColumn({ data }: HeroSingleColumnProps) {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith('es');

  const getIcon = (iconName: string) => {
    const icons = TablerIcons as unknown as Record<string, ComponentType<{ size?: number }>>;
    const IconComponent = icons[`Icon${iconName}`];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const avatars = [avatar1, avatar2, avatar3, avatar4];

  const awardLogos: Record<string, string> = {
    "Forbes": forbesLogo,
    "Fortune": fortuneLogo,
    "Newsweek": isSpanish ? newsweekLogoEs : newsweekLogoEn,
    "Course Report": courseReportLogo,
  };

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background"
      data-testid="section-hero"
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        {data.badge && (
          <Badge 
            variant="secondary" 
            className="mb-6"
            data-testid="badge-hero"
          >
            {data.badge}
          </Badge>
        )}
        
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight"
          data-testid="text-hero-title"
        >
          {data.title}
        </h1>
        
        {data.subtitle && (
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            {data.subtitle}
          </p>
        )}

        {data.trust_bar && (
          <div 
            className="flex items-center justify-center gap-3 mb-8"
            data-testid="trust-bar"
          >
            <div className="flex -space-x-2">
              {avatars.map((avatar, index) => (
                <Avatar 
                  key={index} 
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage src={avatar} alt={`Student ${index + 1}`} />
                  <AvatarFallback className="bg-primary/20 text-xs">
                    {String.fromCharCode(65 + index)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

            <div className="flex flex-col items-start gap-0.5">
              {data.trust_bar.rating && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{data.trust_bar.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4].map((i) => (
                      <IconStarFilled
                        key={i}
                        className="text-yellow-500 w-4 h-4"
                      />
                    ))}
                    <IconStar className="text-yellow-500 w-4 h-4" />
                  </div>
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {data.trust_bar.trusted_text}
              </span>
            </div>
          </div>
        )}
        
        {data.cta_buttons && data.cta_buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {data.cta_buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant === "primary" ? "default" : button.variant}
                size="lg"
                asChild
                data-testid={`button-hero-cta-${index}`}
              >
                <a href={button.url} className="flex items-center gap-2">
                  {button.icon && getIcon(button.icon)}
                  {button.text}
                </a>
              </Button>
            ))}
          </div>
        )}

        {data.award_badges && data.award_badges.length > 0 && (
          <AwardBadges 
            items={data.award_badges.map((award, index) => {
              const logoSrc = awardLogos[award.source];
              return {
                id: `${award.source}-${index}`,
                logo: logoSrc,
                alt: `${award.source} - ${award.name}`,
                logoHeight: "h-12 md:h-16",
                source: award.source,
                name: award.name,
                year: award.year,
              };
            })}
            variant="simple"
            showBorder
          />
        )}
      </div>
    </section>
  );
}
