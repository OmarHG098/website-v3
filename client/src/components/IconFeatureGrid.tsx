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
    <section className="container mx-auto px-4 md:px-12 lg:px-16 pb-16 pt-10">
      <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group p-4 md:p-6"
            data-testid={`feature-icon-${index}`}
          >
            <div className="mb-4 transition-transform duration-200 group-hover:scale-110">
              <img src={feature.icon} alt="" className="h-[70px] w-[70px]" />
            </div>
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
          </Card>
        ))}
      </div>
    </section>
  );
}
