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
        <div
          style={{
            marginLeft: "max(1rem, calc(50vw - 576px))",
            marginRight: "-100vw",
            paddingRight: "100vw",
          }}
        >
          {/* Title and description on top */}
          <div className="max-w-2xl mb-10 pl-4">
            {title && (
              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4"
                data-testid="text-bento-cards-title"
              >
                {title}
              </h2>
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

          {/* Bento grid: 3 columns, 2 rows */}
          <div
            className="grid grid-cols-3 auto-rows-[200px] gap-4 pl-4"
            data-testid="bento-cards-grid"
          >
            {items.slice(0, 4).map((item, index) => {
              const itemId =
                item.id || item.title.toLowerCase().replace(/\s+/g, "-");
              const gridConfig = getBentoGridConfig(index);

              return (
                <Card
                  key={itemId}
                  className="p-6 flex flex-col bg-card/80 backdrop-blur-sm border-border/50 hover-elevate transition-all duration-300"
                  style={{
                    gridColumn: gridConfig.colSpan,
                    gridRow: gridConfig.rowSpan,
                  }}
                  data-testid={`card-bento-${itemId}`}
                >
                  <div className="flex-1">
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
                      className="font-semibold text-foreground text-lg mb-2"
                      data-testid={`text-bento-title-${itemId}`}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className="text-sm text-muted-foreground"
                        data-testid={`text-bento-desc-${itemId}`}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            {title && (
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4"
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
                className="text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto"
                data-testid="text-bento-cards-description-mobile"
              >
                {description}
              </p>
            )}
          </div>

          <div
            className="grid grid-cols-2 gap-3"
            data-testid="bento-cards-grid-mobile"
          >
            {items.map((item, index) => {
              const itemId =
                item.id || item.title.toLowerCase().replace(/\s+/g, "-");

              return (
                <Card
                  key={itemId}
                  className="p-4 flex flex-col bg-card/80 backdrop-blur-sm border-border/50"
                  data-testid={`card-bento-mobile-${itemId}`}
                >
                  {item.icon && (
                    <div className="mb-2 w-5 h-5">
                      {getIcon(
                        item.icon,
                        "w-5 h-5",
                        item.icon_color || "hsl(var(--primary))"
                      )}
                    </div>
                  )}
                  <h3
                    className="font-semibold text-foreground text-sm mb-1"
                    data-testid={`text-bento-title-mobile-${itemId}`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="text-xs text-muted-foreground line-clamp-2"
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

function getBentoGridConfig(index: number): { colSpan: string; rowSpan: string } {
  // Layout matching Supabase design:
  // [Card 0] [Card 1] [Card 2 - tall]
  // [Card 3 - wide  ] [Card 2 cont.]
  const configs = [
    { colSpan: "1", rowSpan: "1" },           // Top left
    { colSpan: "1", rowSpan: "1" },           // Top middle
    { colSpan: "1", rowSpan: "span 2" },      // Right tall (spans 2 rows)
    { colSpan: "span 2", rowSpan: "1" },      // Bottom wide (spans 2 columns)
  ];
  return configs[index] || { colSpan: "1", rowSpan: "1" };
}

export default BentoCards;
