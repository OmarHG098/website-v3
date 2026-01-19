import { useMemo } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import {
  centralizedFaqs,
  filterFaqsByRelatedFeatures,
  AVAILABLE_RELATED_FEATURES,
  MAX_RELATED_FEATURES,
  type RelatedFeature,
} from "@/data/faqs";

interface RelatedFeaturesPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  locale?: string;
}

export function RelatedFeaturesPicker({ value, onChange, locale = "en" }: RelatedFeaturesPickerProps) {
  const selectedFeatures = value || [];
  
  const faqCounts = useMemo(() => {
    const faqData = centralizedFaqs[locale as "en" | "es"] || centralizedFaqs.en;
    const counts: Record<string, number> = {};
    
    for (const feature of AVAILABLE_RELATED_FEATURES) {
      const filtered = filterFaqsByRelatedFeatures(faqData.faqs, {
        relatedFeatures: [feature],
      });
      counts[feature] = filtered.length;
    }
    
    return counts;
  }, [locale]);
  
  const totalFaqsForSelection = useMemo(() => {
    if (selectedFeatures.length === 0) return 0;
    const faqData = centralizedFaqs[locale as "en" | "es"] || centralizedFaqs.en;
    return filterFaqsByRelatedFeatures(faqData.faqs, {
      relatedFeatures: selectedFeatures,
    }).length;
  }, [selectedFeatures, locale]);

  const toggleFeature = (feature: RelatedFeature) => {
    if (selectedFeatures.includes(feature)) {
      onChange(selectedFeatures.filter(f => f !== feature));
    } else if (selectedFeatures.length < MAX_RELATED_FEATURES) {
      onChange([...selectedFeatures, feature]);
    }
  };

  const formatLabel = (feature: string) => {
    return feature
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">FAQ Topics</Label>
        <span className="text-xs text-muted-foreground">
          {selectedFeatures.length}/{MAX_RELATED_FEATURES} selected
          {totalFaqsForSelection > 0 && (
            <span className="ml-1 text-primary">({totalFaqsForSelection} FAQs)</span>
          )}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {AVAILABLE_RELATED_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature);
          const isDisabled = !isSelected && selectedFeatures.length >= MAX_RELATED_FEATURES;
          const count = faqCounts[feature] || 0;
          
          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isDisabled
                  ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              data-testid={`props-feature-${feature}`}
            >
              {isSelected && <IconCheck className="h-3 w-3" />}
              <span>{formatLabel(feature)}</span>
              <span className={`text-[10px] ${isSelected ? "opacity-75" : "opacity-50"}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
