import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";
import type { ComponentType } from "react";
import type { BentoCardsSection } from "@shared/schema";

function getIcon(iconName: string, className?: string, color?: string) {
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    return <CustomIcon width="100%" height="100%" color={color} className={className} />;
  }
  
  const IconComponent = TablerIcons[`Icon${iconName}` as keyof typeof TablerIcons] as ComponentType<{ className?: string; style?: React.CSSProperties }>;
  if (IconComponent) {
    const style = color ? { color } : undefined;
    return <IconComponent className={className || "w-full h-full text-primary"} style={style} />;
  }
  const style = color ? { color } : undefined;
  return <TablerIcons.IconBox className={className || "w-full h-full text-primary"} style={style} />;
}

interface BentoCardsProps {
  data: BentoCardsSection;
}

export function BentoCards({ data }: BentoCardsProps) {
  const { title, subtitle, description, items, background } = data;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section
      className={`py-16 md:py-24 overflow-hidden ${background || ""}`}
      data-testid="section-bento-cards"
    >
      <div className="hidden lg:block">
        <div className="flex items-start">
          <div
            className="flex-shrink-0 pl-4"
            style={{
              width: "calc(50vw - 576px + 280px)",
              minWidth: "280px",
              maxWidth: "360px",
              marginLeft: "max(1rem, calc(50vw - 576px))",
            }}
          >
            <div className="flex flex-col justify-start pt-4 pr-8">
              {title && (
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-3"
                  data-testid="text-bento-cards-title"
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className="text-lg font-semibold text-primary mb-3"
                  data-testid="text-bento-cards-subtitle"
                >
                  {subtitle}
                </p>
              )}
              {description && (
                <p
                  className="text-muted-foreground text-base leading-relaxed"
                  data-testid="text-bento-cards-description"
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <div
            className="flex-1"
            style={{
              marginRight: "-100vw",
              paddingRight: "100vw",
            }}
          >
            <div
              className="grid grid-cols-3 xl:grid-cols-4 auto-rows-[180px] gap-5"
              data-testid="bento-cards-grid"
            >
              {items.map((item, index) => {
                const itemId =
                  item.id || item.title.toLowerCase().replace(/\s+/g, "-");
                const gridConfig = getGridConfig(index, items.length);

                return (
                  <Card
                    key={itemId}
                    className="p-6 flex flex-col bg-card border-border/50 hover-elevate transition-all duration-300"
                    style={{
                      gridColumn: gridConfig.colSpan,
                      gridRow: gridConfig.rowSpan,
                    }}
                    data-testid={`card-bento-${itemId}`}
                  >
                    {item.icon && (
                      <div className="mb-4 w-8 h-8">
                        {getIcon(
                          item.icon,
                          "w-8 h-8",
                          item.icon_color || "hsl(var(--primary))"
                        )}
                      </div>
                    )}
                    <h3
                      className="font-semibold text-foreground text-base mb-3"
                      data-testid={`text-bento-title-${itemId}`}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="text-sm text-muted-foreground leading-relaxed"
                        data-testid={`text-bento-desc-${itemId}`}
                      >
                        {item.description}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            {title && (
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3"
                data-testid="text-bento-cards-title-mobile"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-lg font-semibold text-primary mb-3"
                data-testid="text-bento-cards-subtitle-mobile"
              >
                {subtitle}
              </p>
            )}
            {description && (
              <p
                className="text-muted-foreground text-base leading-relaxed"
                data-testid="text-bento-cards-description-mobile"
              >
                {description}
              </p>
            )}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-testid="bento-cards-grid-mobile"
          >
            {items.map((item) => {
              const itemId =
                item.id || item.title.toLowerCase().replace(/\s+/g, "-");

              return (
                <Card
                  key={itemId}
                  className="p-5 flex flex-col bg-card border-border/50"
                  data-testid={`card-bento-mobile-${itemId}`}
                >
                  {item.icon && (
                    <div className="mb-3 w-6 h-6">
                      {getIcon(
                        item.icon,
                        "w-6 h-6",
                        item.icon_color || "hsl(var(--primary))"
                      )}
                    </div>
                  )}
                  <h3
                    className="font-semibold text-foreground text-sm mb-2"
                    data-testid={`text-bento-title-mobile-${itemId}`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="text-xs text-muted-foreground line-clamp-3"
                      data-testid={`text-bento-desc-mobile-${itemId}`}
                    >
                      {item.description}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function getGridConfig(
  index: number,
  totalItems: number
): { colSpan: string; rowSpan: string } {
  if (totalItems >= 7) {
    const configs = [
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 2", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
    ];
    return configs[index] || { colSpan: "span 1", rowSpan: "span 1" };
  }

  if (totalItems >= 4) {
    const configs = [
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 2", rowSpan: "span 1" },
    ];
    if (index < 4) {
      return configs[index];
    }
    return { colSpan: "span 1", rowSpan: "span 1" };
  }

  if (totalItems === 3) {
    const configs = [
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 1", rowSpan: "span 1" },
      { colSpan: "span 2", rowSpan: "span 1" },
    ];
    return configs[index];
  }

  return { colSpan: "span 1", rowSpan: "span 1" };
}

export default BentoCards;
