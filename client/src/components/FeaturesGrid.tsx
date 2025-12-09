import { useState } from "react";
import type { FeaturesGridSection, FeaturesGridItem } from "@shared/schema";
import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";
import type { ComponentType } from "react";

interface FeaturesGridProps {
  data: FeaturesGridSection;
}

function getIcon(iconName: string) {
  // Check custom icons first
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    return <CustomIcon width="100%" height="100%" className="text-primary" />;
  }
  
  // Fall back to Tabler icons
  const IconComponent = TablerIcons[`Icon${iconName}` as keyof typeof TablerIcons] as ComponentType<{ className?: string }>;
  if (IconComponent) {
    return <IconComponent className="w-full h-full text-primary" />;
  }
  return <TablerIcons.IconBox className="w-full h-full text-primary" />;
}

function FeatureCard({ 
  item, 
  collapsible 
}: { 
  item: FeaturesGridItem; 
  collapsible: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Card className="p-4 md:p-6 hover-elevate" data-testid={`card-feature-${itemId}`}>
      {/* Header */}
      <div 
        className={`flex justify-between items-start ${collapsible ? 'cursor-pointer md:cursor-default' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
        data-testid={`button-toggle-feature-${itemId}`}
      >
        <div className="flex-1">
          {item.category && (
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {item.category}
            </span>
          )}
          <h3 className={`text-lg md:text-xl font-bold text-foreground ${item.category ? 'mt-1' : ''}`}>
            {item.title}
          </h3>
        </div>
        <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
          {getIcon(item.icon)}
        </div>
        {collapsible && (
          <TablerIcons.IconChevronDown 
            className={`md:hidden w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 self-start mt-1 ml-2 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>
      
      {/* Mobile: Collapsible content */}
      {collapsible && (
        <div className={`md:hidden overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
          <p className="text-muted-foreground mb-4">
            {item.description}
          </p>
          {item.link_url && (
            <a 
              href={item.link_url}
              className="text-primary hover:underline font-medium"
              data-testid={`link-feature-mobile-${itemId}`}
            >
              {item.link_text || "Read More"}
            </a>
          )}
        </div>
      )}
      
      {/* Desktop: Always visible content (or non-collapsible mode) */}
      <div className={collapsible ? "hidden md:block mt-4" : "mt-4"}>
        <p className="text-muted-foreground mb-4">
          {item.description}
        </p>
        {item.link_url && (
          <a 
            href={item.link_url}
            className="text-primary hover:underline font-medium"
            data-testid={`link-feature-${itemId}`}
          >
            {item.link_text || "Read More"}
          </a>
        )}
      </div>
    </Card>
  );
}

export default function FeaturesGrid({ data }: FeaturesGridProps) {
  const columns = data.columns || 3;
  const collapsible = data.collapsible_mobile ?? true;
  
  const gridColsClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns] || "md:grid-cols-3";

  return (
    <section 
      className={`pb-8 pt-10 ${data.background || ''}`}
      data-testid="section-features-grid"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-foreground text-center"
          data-testid="text-features-grid-title"
        >
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-center text-muted-foreground mb-6">
            {data.subtitle}
          </p>
        )}

        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
          {data.items.map((item, index) => (
            <FeatureCard 
              key={item.id || index} 
              item={item} 
              collapsible={collapsible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesGrid };
export type { FeaturesGridProps };
