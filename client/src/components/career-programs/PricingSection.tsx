import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconFlame,
  IconBrandHtml5,
  IconBrandCss3,
  IconBrandJavascript,
  IconBrandReact,
  IconBrandPython,
  IconBrandNodejs,
  IconBrandGit,
  IconBrandBootstrap,
  IconApi,
  IconSettings,
  IconCertificate,
  IconCloud,
  IconRobot,
  IconSchool,
  type Icon,
} from "@tabler/icons-react";
import type { PricingSection as PricingSectionType } from "@shared/schema";
import RigobotIconTiny from "@/components/custom-icons/RigobotIconTiny";

interface PricingSectionProps {
  data: PricingSectionType;
}

const iconMap: Record<string, Icon> = {
  html: IconBrandHtml5,
  css: IconBrandCss3,
  javascript: IconBrandJavascript,
  react: IconBrandReact,
  python: IconBrandPython,
  nodejs: IconBrandNodejs,
  git: IconBrandGit,
  bootstrap: IconBrandBootstrap,
  api: IconApi,
  settings: IconSettings,
  certificate: IconCertificate,
  cloud: IconCloud,
  robot: IconRobot,
};

export function PricingSection({ data }: PricingSectionProps) {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith('es');
  const [isYearly, setIsYearly] = useState(true);
  const currentPlan = isYearly ? data.yearly : data.monthly;
  
  const yearlyLabel = isSpanish ? "Anual" : "Annual";
  const monthlyLabel = isSpanish ? "Mensual" : "Monthly";
  const learnAtPaceText = isSpanish ? "Aprende a tu ritmo" : "Learn at your own pace";

  return (
    <section
      className="py-16 bg-gradient-to-r from-[#e8f4fc] to-white dark:from-muted/30 dark:to-background"
      data-testid="section-pricing"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <h2
            className="text-2xl md:text-3xl font-bold text-primary"
            data-testid="text-pricing-title"
          >
            {data.title}
          </h2>
          <div
            className="inline-flex rounded-full border border-primary/20 p-1 bg-background"
            data-testid="toggle-billing-period"
          >
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isYearly
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="button-yearly"
            >
              {yearlyLabel}
            </button>
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !isYearly
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="button-monthly"
            >
              {monthlyLabel}
            </button>
          </div>
        </div>
        {data.subtitle && (
          <p
            className="text-foreground font-medium mb-6"
            data-testid="text-pricing-subtitle"
          >
            {data.subtitle}
          </p>
        )}

        <div className="grid lg:grid-cols-12 gap-0 items-stretch">
          <div
            className="relative rounded-l-2xl overflow-hidden lg:col-span-4"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #0EA5E9 50%, #06B6D4 100%)",
            }}
            data-testid="card-pricing"
          >
            <div
              className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
              data-testid="badge-discount"
            >
              <IconFlame size={16} className="text-orange-400" />
              <span className="text-white text-sm font-semibold">
                {currentPlan.discount_badge}
              </span>
            </div>

            <div className="pt-16 pb-8 px-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-white/90 text-sm">{learnAtPaceText}</span>
                <Badge
                  variant="outline"
                  className="border-white/40 text-white bg-white/10 text-xs"
                  data-testid="badge-period"
                >
                  {isYearly ? yearlyLabel : monthlyLabel}
                </Badge>
              </div>

              <div className="mb-4">
                <span
                  className="text-5xl md:text-6xl font-bold text-white"
                  data-testid="text-price"
                >
                  ${currentPlan.price}
                </span>
                <span className="text-white/70 text-lg ml-1">/{currentPlan.period}</span>
              </div>

              {currentPlan.original_price && (
                <div
                  className="text-white/60 line-through text-lg mb-3"
                  data-testid="text-original-price"
                >
                  ${currentPlan.original_price}
                </div>
              )}

              {currentPlan.savings_badge && (
                <Badge
                  className="bg-white/20 text-white border-0 backdrop-blur-sm mb-6"
                  data-testid="badge-savings"
                >
                  {currentPlan.savings_badge}
                </Badge>
              )}

              <div className="mt-6 pt-6 border-t border-white/20">
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-white text-foreground border-0 hover:bg-white/90 font-semibold py-6 text-base"
                  data-testid="button-get-plan"
                >
                  <a href={data.cta.url} className="flex items-center justify-center gap-2">
                    <IconSchool size={22} />
                    {data.cta.text}
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background border border-l-0 border-border rounded-r-2xl pt-16 pb-8 px-6 space-y-6 lg:col-span-8">
            {data.features_title && (
              <p
                className="text-foreground font-semibold text-lg"
                data-testid="text-features-title"
              >
                {data.features_title}
              </p>
            )}

            {data.tech_icons && data.tech_icons.length > 0 && (
              <div
                className="flex flex-wrap gap-3"
                data-testid="tech-icons"
              >
                {data.tech_icons.map((iconName, index) => {
                  const IconComponent = iconMap[iconName.toLowerCase()];
                  return IconComponent ? (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
                      data-testid={`icon-tech-${index}`}
                    >
                      <IconComponent size={24} className="text-muted-foreground" />
                    </div>
                  ) : null;
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2"
                  data-testid={`feature-${index}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.use_rigobot_icon ? (
                      <RigobotIconTiny width="24px" height="14px" />
                    ) : feature.icon ? (
                      (() => {
                        const IconComponent = iconMap[feature.icon.toLowerCase()];
                        return IconComponent ? (
                          <IconComponent size={20} className="text-primary" />
                        ) : (
                          <IconRobot size={20} className="text-primary" />
                        );
                      })()
                    ) : (
                      <IconCertificate size={20} className="text-primary" />
                    )}
                  </div>
                  <span className="text-foreground text-sm leading-relaxed">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
