import type { FeaturesGridTextOnlySection, FeaturesGridTextOnlyItem } from "@shared/schema";
import { Card } from "@/components/ui/card";

function TextOnlyCard({ item }: { item: FeaturesGridTextOnlyItem }) {
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  
  const renderHighlightedTitle = () => {
    const title = item.title;
    const highlightWords = item.highlight_words;
    
    if (!highlightWords) {
      return <span className="text-foreground">{title}</span>;
    }
    
    const lowerTitle = title.toLowerCase();
    const lowerHighlight = highlightWords.toLowerCase();
    const startIndex = lowerTitle.indexOf(lowerHighlight);
    
    if (startIndex === -1) {
      return <span className="text-foreground">{title}</span>;
    }
    
    const beforeHighlight = title.slice(0, startIndex);
    const highlighted = title.slice(startIndex, startIndex + highlightWords.length);
    const afterHighlight = title.slice(startIndex + highlightWords.length);
    
    return (
      <>
        {beforeHighlight && <span className="text-foreground">{beforeHighlight}</span>}
        <span className="text-primary">{highlighted}</span>
        {afterHighlight && <span className="text-foreground">{afterHighlight}</span>}
      </>
    );
  };

  return (
    <Card 
      className="p-5 md:p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-border transition-all duration-200"
      data-testid={`card-feature-${itemId}`}
    >
      <h3 className="font-semibold text-lg leading-tight mb-2">
        {renderHighlightedTitle()}
      </h3>
      {item.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      )}
    </Card>
  );
}

interface FeaturesGridTextOnlyProps {
  data: FeaturesGridTextOnlySection;
}

export function FeaturesGridTextOnly({ data }: FeaturesGridTextOnlyProps) {
  const columns = data.columns || 4;
  
  const gridColsClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }[columns] || "md:grid-cols-2 lg:grid-cols-4";

  return (
    <section 
      className={`py-14 ${data.background || ''}`}
      data-testid="section-features-grid"
    >
      <div className="max-w-6xl mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className="text-center mb-8">
            {data.title && (
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                data-testid="text-features-grid-title"
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {data.subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridColsClass} gap-5`}>
          {(data.items || []).map((item, index) => (
            <TextOnlyCard key={item.id || index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
