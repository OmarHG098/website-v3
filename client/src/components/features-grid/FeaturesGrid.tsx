import type { FeaturesGridSection, FeaturesGridHighlightSection, FeaturesGridDetailedSection, FeaturesGridCardHeaderSection } from "@shared/schema";
import { FeaturesGridHighlight } from "./FeaturesGridHighlight";
import { FeaturesGridDetailed } from "./FeaturesGridDetailed";
import { FeaturesGridCardHeader } from "./FeaturesGridCardHeader";

interface FeaturesGridProps {
  data: FeaturesGridSection;
}

export function FeaturesGrid({ data }: FeaturesGridProps) {
  const variant = data.variant || "highlight";
  
  switch (variant) {
    case "detailed":
      return <FeaturesGridDetailed data={data as FeaturesGridDetailedSection} />;
    case "cardHeader":
      return <FeaturesGridCardHeader data={data as FeaturesGridCardHeaderSection} />;
    case "highlight":
    default:
      return <FeaturesGridHighlight data={data as FeaturesGridHighlightSection} />;
  }
}

export { FeaturesGridHighlight, FeaturesGridDetailed, FeaturesGridCardHeader };
export type { FeaturesGridProps };
