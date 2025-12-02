import { IconCheck } from "@tabler/icons-react";
import type { FeaturesChecklistSection as FeaturesChecklistSectionType } from "@shared/schema";

interface FeaturesChecklistSectionProps {
  data: FeaturesChecklistSectionType;
}

export function FeaturesChecklistSection({ data }: FeaturesChecklistSectionProps) {
  return (
    <section 
      className="py-16 bg-muted/30"
      data-testid="section-features-checklist"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-10 text-center text-foreground"
          data-testid="text-features-title"
        >
          {data.title}
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 rounded-lg bg-background border"
              data-testid={`item-feature-${index}`}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <IconCheck size={16} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
