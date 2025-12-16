import type { FeaturesGridSection, FeaturesGridHighlightSection, FeaturesGridDetailedSection, FeaturesGridSpotlightSection } from "@shared/schema";
import { FeaturesGridHighlight } from "./FeaturesGridHighlight";
import { FeaturesGridDetailed } from "./FeaturesGridDetailed";
import { FeaturesGridSpotlight } from "./FeaturesGridSpotlight";

interface FeaturesGridProps {
  data: FeaturesGridSection;
}

export function FeaturesGrid({ data }: FeaturesGridProps) {
  const variant = data.variant || "highlight";
  
  switch (variant) {
    case "detailed":
      return <FeaturesGridDetailed data={data as FeaturesGridDetailedSection} />;
    case "spotlight":
      return <FeaturesGridSpotlight data={data as FeaturesGridSpotlightSection} />;
    case "highlight":
    default:
      return <FeaturesGridHighlight data={data as FeaturesGridHighlightSection} />;
  }
}

export { FeaturesGridHighlight, FeaturesGridDetailed, FeaturesGridSpotlight };
export type { FeaturesGridProps };
