import type { FeaturesGridSection, FeaturesGridHighlightSection, FeaturesGridDetailedSection } from "@shared/schema";
import { FeaturesGridHighlight } from "./FeaturesGridHighlight";
import { FeaturesGridDetailed } from "./FeaturesGridDetailed";

interface FeaturesGridProps {
  data: FeaturesGridSection;
}

export function FeaturesGrid({ data }: FeaturesGridProps) {
  const variant = data.variant || "highlight";
  
  switch (variant) {
    case "detailed":
      return <FeaturesGridDetailed data={data as FeaturesGridDetailedSection} />;
    case "highlight":
    default:
      return <FeaturesGridHighlight data={data as FeaturesGridHighlightSection} />;
  }
}

export { FeaturesGridHighlight, FeaturesGridDetailed };
export type { FeaturesGridProps };
