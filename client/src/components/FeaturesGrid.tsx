import { useState } from "react";
import type { 
  FeaturesGridSection, 
  FeaturesGridHighlightSection, 
  FeaturesGridDetailedSection,
  FeaturesGridHighlightItem,
  FeaturesGridDetailedItem 
} from "@shared/schema";
import { Card } from "@/components/ui/card";
import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";
import type { ComponentType } from "react";

interface FeaturesGridProps {
  data: FeaturesGridSection;
}

function getIcon(iconName: string, className?: string) {
  const CustomIcon = getCustomIcon(iconName);
  if (CustomIcon) {
    return <CustomIcon width="100%" height="100%" className={className || "text-primary"} />;
  }
  
  const IconComponent = TablerIcons[`Icon${iconName}` as keyof typeof TablerIcons] as ComponentType<{ className?: string }>;
  if (IconComponent) {
    return <IconComponent className={className || "w-full h-full text-primary"} />;
  }
  return <TablerIcons.IconBox className={className || "w-full h-full text-primary"} />;
}

function HighlightCard({ item }: { item: FeaturesGridHighlightItem }) {
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  const hasValue = Boolean(item.value);
  const hasDescription = Boolean(item.description);
  
  // Use vertical layout when there's description but no value (feature cards)
  // Use horizontal layout when there's a value (stats cards)
  const useVerticalLayout = hasDescription && !hasValue;
  
  if (useVerticalLayout) {
    return (
      <Card 
        className="p-4 md:p-5"
        data-testid={`card-feature-${itemId}`}
      >
        <div className="w-12 h-12 md:w-14 md:h-14 mb-3">
          {getIcon(item.icon, "w-full h-full text-primary")}
        </div>
        <div className="font-semibold text-foreground text-base md:text-lg">
          {item.title}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {item.description}
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
        {getIcon(item.icon, "w-full h-full text-primary")}
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

function DetailedCard({ 
  item, 
  collapsible 
}: { 
  item: FeaturesGridDetailedItem; 
  collapsible: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Card className="p-4 md:p-6 hover-elevate" data-testid={`card-feature-${itemId}`}>
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

function HighlightGrid({ data }: { data: FeaturesGridHighlightSection }) {
  const columns = data.columns || 3;
  
  const gridColsClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns] || "md:grid-cols-3";

  return (
    <section 
      className={`pb-16 ${data.background || ''}`}
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
            <HighlightCard key={item.id || index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailedGrid({ data }: { data: FeaturesGridDetailedSection }) {
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
            <DetailedCard 
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

export default function FeaturesGrid({ data }: FeaturesGridProps) {
  const variant = data.variant || "highlight";
  
  if (variant === "detailed") {
    return <DetailedGrid data={data as FeaturesGridDetailedSection} />;
  }
  
  return <HighlightGrid data={data as FeaturesGridHighlightSection} />;
}

export { FeaturesGrid };
export type { FeaturesGridProps };
