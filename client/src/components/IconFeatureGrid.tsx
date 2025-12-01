import { useTranslation } from "react-i18next";

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

export default function IconFeatureGrid({ title, features }: IconFeatureGridProps) {
  const { t } = useTranslation();
  
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="group" data-testid={`feature-icon-${index}`}>
            <div 
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-4 transition-transform duration-200 group-hover:scale-110`}
            >
              <img src={feature.icon} alt="" className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
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
        ))}
      </div>
    </section>
  );
}
