import type { FeaturesGridHighlightSection, FeaturesGridHighlightItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";
import type { ComponentType } from "react";

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

function HighlightCard({ item, iconColor }: { item: FeaturesGridHighlightItem; iconColor?: string }) {
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  const hasValue = Boolean(item.value);
  const hasDescription = Boolean(item.description);
  
  const hasDescriptionNoValue = hasDescription && !hasValue;
  
  if (hasDescriptionNoValue) {
    return (
      <Card 
        className="p-3 md:p-5"
        data-testid={`card-feature-${itemId}`}
      >
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex-shrink-0 w-10 h-10">
            {getIcon(item.icon, "w-full h-full", iconColor)}
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">
              {item.title}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {item.description}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="w-14 h-14 mb-3">
            {getIcon(item.icon, "w-full h-full", iconColor)}
          </div>
          <div className="font-semibold text-foreground text-lg">
            {item.title}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {item.description}
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card 
      className="p-3 md:p-5 flex items-center gap-3 md:gap-5"
      data-testid={`card-feature-${itemId}`}
    >
      <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16">
        {getIcon(item.icon, "w-full h-full", iconColor)}
      </div>
      <div>
        {item.value && (
          <div className="text-xl md:text-4xl font-semibold text-foreground">
            {item.value}
          </div>
        )}
        <div className={`font-semibold text-foreground ${item.value ? 'text-sm md:text-base mt-0.5 md:mt-1' : 'text-lg'}`}>
          {item.title}
        </div>
        {item.description && (
          <div className="text-sm text-muted-foreground mt-0.5">
            {item.description}
          </div>
        )}
      </div>
    </Card>
  );
}

interface FeaturesGridHighlightProps {
  data: FeaturesGridHighlightSection;
}

export function FeaturesGridHighlight({ data }: FeaturesGridHighlightProps) {
  const columns = data.columns || 3;
  
  const gridColsClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns] || "md:grid-cols-3";

  return (
    <section 
      className={`py-14 ${data.background || ''}`}
      data-testid="section-features-grid"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            data-testid="text-features-grid-title"
          >
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
          {data.items.map((item, index) => (
            <HighlightCard key={item.id || index} item={item} iconColor={item.icon_color || data.icon_color} />
          ))}
        </div>
      </div>
    </section>
  );
}
