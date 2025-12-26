import { useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconFlame,
  IconApi,
  IconSettings,
  IconCertificate,
  IconCloud,
  IconRobot,
  IconSchool,
  type Icon,
} from "@tabler/icons-react";
import {
  SiGit,
  SiPython,
  SiReact,
  SiNodedotjs,
  SiOpenai,
  SiFlask,
  SiBootstrap,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiGithub,
} from "react-icons/si";
import type { PricingSection as PricingSectionType } from "@shared/schema";
import RigobotIconTiny from "@/components/custom-icons/RigobotIconTiny";

interface PricingSectionProps {
  data: PricingSectionType;
}

const techIconMap: Record<string, ComponentType<{ className?: string }>> = {
  git: SiGit,
  python: SiPython,
  react: SiReact,
  nodejs: SiNodedotjs,
  openai: SiOpenai,
  flask: SiFlask,
  bootstrap: SiBootstrap,
  javascript: SiJavascript,
  html5: SiHtml5,
  html: SiHtml5,
  css3: SiCss3,
  css: SiCss3,
  github: SiGithub,
};

const featureIconMap: Record<string, Icon> = {
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
  
  const isProductVariant = data.variant === "product";
  
  if (!isProductVariant && (!data.monthly || !data.yearly)) {
    return (
      <section className="bg-muted/30" data-testid="section-pricing">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          Pricing section requires monthly and yearly pricing data
        </div>
      </section>
    );
  }
  
  const currentPlan = isProductVariant ? null : (isYearly ? data.yearly : data.monthly);
  
  const yearlyLabel = isSpanish ? "Anual" : "Annual";
  const monthlyLabel = isSpanish ? "Mensual" : "Monthly";
  const learnAtPaceText = isSpanish ? "Aprende a tu ritmo" : "Learn at your own pace";

  if (isProductVariant) {
    return (
      <section
        className=""
        data-testid="section-pricing"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2
              className="text-h2 text-primary mb-2"
              data-testid="text-pricing-title"
            >
              {data.title}
            </h2>
            {data.subtitle && (
              <p
                className="text-foreground font-medium"
                data-testid="text-pricing-subtitle"
              >
                {data.subtitle}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-12 gap-0 items-stretch relative">
            <div
              className="relative rounded-t-2xl lg:rounded-tl-2xl lg:rounded-bl-2xl lg:rounded-tr-none lg:rounded-br-none overflow-hidden lg:col-span-4"
              style={{
                background: "linear-gradient(135deg, #0042FF 0%, #3399FF 100%)",
              }}
              data-testid="card-pricing"
            >
              <div className="flex flex-col items-center justify-between h-full px-4 py-6">
                <div className="flex flex-col items-center justify-center flex-1 py-6 space-y-4">
                  {data.discount_text && (
                    <div className="text-center">
                      {data.discount_text.includes(":") ? (
                        <div data-testid="text-discount">
                          <p className="text-white/90 text-sm">
                            {data.discount_text.split(":")[0]}:
                          </p>
                          <p className="text-white text-sm font-bold mt-1">
                            {data.discount_text.split(":")[1]?.trim()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-white text-sm font-medium" data-testid="text-discount">
                          {data.discount_text}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {data.financing_text && (
                    <div className="text-center">
                      <p className="text-white/90 text-sm" data-testid="text-financing-label">
                        {data.financing_text}
                      </p>
                      {data.financing_amount && (
                        <div className="mt-2">
                          <span
                            className="text-6xl font-bold text-white"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            data-testid="text-financing-amount"
                          >
                            {data.financing_amount}
                          </span>
                          <span className="text-white text-sm font-normal">/mo</span>
                        </div>
                      )}
                    </div>
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

            <div className="bg-background border border-t-0 lg:border-t lg:border-l-0 border-border rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl p-4 space-y-4 lg:col-span-8">
              {data.features_title && (
                <p
                  className="text-[#3A3A3A] font-normal text-body"
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
                    const IconComponent = techIconMap[iconName.toLowerCase()];
                    return IconComponent ? (
                      <div
                        key={index}
                        className="flex items-center justify-center p-2 text-muted-foreground"
                        data-testid={`icon-tech-${index}`}
                      >
                        <IconComponent className="w-5 h-5" />
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
                          const IconComponent = featureIconMap[feature.icon.toLowerCase()];
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

  return (
    <section
      className="bg-gradient-to-r from-[#e8f4fc] to-white dark:from-muted/30 dark:to-background"
      data-testid="section-pricing"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <h2
            className="text-h2 text-primary"
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
                {currentPlan?.discount_badge}
              </span>
            </div>
          </div>

          <div
            className="relative rounded-t-2xl lg:rounded-t-none lg:rounded-l-2xl overflow-hidden lg:col-span-4"
            style={{
              background: "linear-gradient(135deg, #66B8FF 0%, #3399FF 100%)",
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
                    className="text-h1 text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    data-testid="text-price"
                  >
                    ${currentPlan?.price}
                  </span>
                  <span className="text-white text-xs font-normal">/{currentPlan?.period}</span>
                </div>

                {currentPlan?.original_price && (
                  <div
                    className="text-white/60 line-through text-body mt-1"
                    data-testid="text-original-price"
                  >
                    ${currentPlan.original_price}
                  </div>
                )}

                {currentPlan?.savings_badge && (
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

          <div className="bg-background border border-t-0 lg:border-t lg:border-l-0 border-border rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl p-4 space-y-4 lg:col-span-8">
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
                  const IconComponent = techIconMap[iconName.toLowerCase()];
                  return IconComponent ? (
                    <div
                      key={index}
                      className="flex items-center justify-center p-2 text-muted-foreground"
                      data-testid={`icon-tech-${index}`}
                    >
                      <IconComponent className="w-5 h-5" />
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
                        const IconComponent = featureIconMap[feature.icon.toLowerCase()];
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
