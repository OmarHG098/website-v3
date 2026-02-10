import { useMemo } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import {
  AVAILABLE_RELATED_FEATURES,
  MAX_RELATED_FEATURES,
  filterTestimonialsByRelatedFeatures,
  type RelatedFeature,
  type TestimonialItem,
} from "@/lib/testimonialConstants";

interface TestimonialRelatedFeaturesPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  locale?: string;
}

export function TestimonialRelatedFeaturesPicker({ value, onChange, locale = "en" }: TestimonialRelatedFeaturesPickerProps) {
  const selectedFeatures = value || [];
  
  const { data: testimonialsData } = useQuery<{ testimonials: TestimonialItem[] }>({
    queryKey: ["/api/testimonials", locale],
    staleTime: 5 * 60 * 1000,
  });
  
  const testimonials = testimonialsData?.testimonials ?? [];
  
  const testimonialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    for (const feature of AVAILABLE_RELATED_FEATURES) {
      const filtered = filterTestimonialsByRelatedFeatures(testimonials, {
        relatedFeatures: [feature],
      });
      counts[feature] = filtered.length;
    }
    
    return counts;
  }, [testimonials]);
  
  const totalTestimonialsForSelection = useMemo(() => {
    if (selectedFeatures.length === 0) return 0;
    return filterTestimonialsByRelatedFeatures(testimonials, {
      relatedFeatures: selectedFeatures,
    }).length;
  }, [selectedFeatures, testimonials]);

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
        <Label className="text-sm font-medium">Testimonial Topics</Label>
        <span className="text-xs text-muted-foreground">
          {selectedFeatures.length}/{MAX_RELATED_FEATURES} selected
          {totalTestimonialsForSelection > 0 && (
            <span className="ml-1 text-primary">({totalTestimonialsForSelection} testimonials)</span>
          )}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {AVAILABLE_RELATED_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature);
          const isDisabled = !isSelected && selectedFeatures.length >= MAX_RELATED_FEATURES;
          const count = testimonialCounts[feature] || 0;
          
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
              data-testid={`props-testimonial-feature-${feature}`}
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
