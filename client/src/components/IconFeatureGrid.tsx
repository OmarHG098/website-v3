import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";

interface IconFeature {
  icon: string;
  title: string;
  description: string;
  color: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface IconFeatureGridProps {
  title: string;
  features: IconFeature[];
}

export default function IconFeatureGrid({
  title,
  features,
}: IconFeatureGridProps) {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 md:px-12 lg:px-16 py-section">
      <h2 className="text-h2 text-center mb-12">{title}</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group p-4 md:p-6 bg-transparent border-0 shadow-none flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0"
            data-testid={`feature-icon-${index}`}
          >
            <div className="shrink-0 md:mb-4 transition-transform duration-brand ease-brand group-hover:scale-[1.02]">
              <img
                src={feature.icon}
                alt=""
                className="h-14 w-14 md:h-[70px] md:w-[70px]"
              />
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {feature.description}
              </p>
              {(feature.href || feature.onClick) && (
                <a
                  href={feature.href || "#"}
                  onClick={feature.onClick}
                  className="text-sm text-primary hover:underline cursor-pointer"
                  data-testid={`link-feature-${index}`}
                >
                  {t("common.seeMore", "See more")}
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
