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

const techIconColors: Record<string, string> = {
  html: "#0084FF",
  css: "#25BF6C",
  javascript: "#FFB718",
  react: "#0084FF",
  python: "#FFB718",
  nodejs: "#FFB718",
  git: "#EB5757",
  bootstrap: "#9747FF",
  api: "#061258",
  settings: "#061258",
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

        <div className="grid lg:grid-cols-12 gap-0 items-stretch relative">
          <div
            className="flex items-center absolute -top-4 left-0 z-10"
            data-testid="badge-discount"
          >
            <div className="flex items-center justify-center p-1.5 bg-[#BE0000] border-2 border-[#EB5757] rounded-full z-10">
              <IconFlame size={28} className="text-[#FFB718]" style={{ filter: 'drop-shadow(0 0 4px rgba(255, 183, 24, 0.5))' }} />
            </div>
            <div className="flex items-center justify-center bg-[#EB5757] rounded-full px-3 py-1 -ml-2">
              <span className="text-[#FFBEBE] text-sm font-normal">
                {currentPlan.discount_badge}
              </span>
            </div>
          </div>

          <div
            className="relative rounded-l-2xl overflow-hidden lg:col-span-4"
            style={{
              background: "linear-gradient(135deg, #EB5757 0%, #0084FF 100%)",
            }}
            data-testid="card-pricing"
          >
            <div className="flex flex-col items-center justify-between h-full px-4 py-6 pt-12">
              <div className="flex items-center gap-2 w-full">
                <span className="text-white text-sm flex-1">{learnAtPaceText}</span>
                <Badge
                  className="bg-[#0062BD] border border-[#FAFDFF] text-[#FAFDFF] text-xs font-bold px-2.5 py-1 rounded-full"
                  data-testid="badge-period"
                >
                  {isYearly ? yearlyLabel : monthlyLabel}
                </Badge>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 py-6">
                <div className="text-center">
                  <span
                    className="text-5xl md:text-[55px] font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    data-testid="text-price"
                  >
                    ${currentPlan.price}
                  </span>
                  <span className="text-white text-xs font-normal">/{currentPlan.period}</span>
                </div>

                {currentPlan.original_price && (
                  <div
                    className="text-white/60 line-through text-lg mt-1"
                    data-testid="text-original-price"
                  >
                    ${currentPlan.original_price}
                  </div>
                )}

                {currentPlan.savings_badge && (
                  <Badge
                    className="bg-[#061258] text-white border-0 mt-2 text-xs"
                    data-testid="badge-savings"
                  >
                    {currentPlan.savings_badge}
                  </Badge>
                )}
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full bg-white text-[#061258] border-0 hover:bg-white/90 font-bold h-10 text-[17px] tracking-wide rounded"
                data-testid="button-get-plan"
              >
                <a href={data.cta.url} className="flex items-center justify-center gap-2">
                  <IconSchool size={24} className="text-[#061258]" />
                  {data.cta.text}
                </a>
              </Button>
            </div>
          </div>

          <div className="bg-background border border-l-0 border-border rounded-r-2xl p-4 space-y-4 lg:col-span-8">
            {data.features_title && (
              <p
                className="text-[#3A3A3A] font-normal text-lg"
                data-testid="text-features-title"
              >
                {data.features_title}
              </p>
            )}

            {data.tech_icons && data.tech_icons.length > 0 && (
              <div
                className="flex flex-wrap gap-4"
                data-testid="tech-icons"
              >
                {data.tech_icons.map((iconName, index) => {
                  const IconComponent = iconMap[iconName.toLowerCase()];
                  const color = techIconColors[iconName.toLowerCase()] || "#061258";
                  return IconComponent ? (
                    <div
                      key={index}
                      className="flex items-center justify-center p-2"
                      data-testid={`icon-tech-${index}`}
                    >
                      <IconComponent size={20} style={{ color }} />
                    </div>
                  ) : null;
                })}
              </div>
            )}

            <div className="border-t border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2"
                  data-testid={`feature-${index}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.use_rigobot_icon ? (
                      <RigobotIconTiny width="27px" height="17px" />
                    ) : feature.icon ? (
                      (() => {
                        const IconComponent = iconMap[feature.icon.toLowerCase()];
                        return IconComponent ? (
                          <IconComponent size={22} className="text-primary" />
                        ) : (
                          <IconRobot size={22} className="text-primary" />
                        );
                      })()
                    ) : (
                      <IconCertificate size={22} className="text-primary" />
                    )}
                  </div>
                  <span className="text-[#061258] text-xs leading-relaxed">
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
