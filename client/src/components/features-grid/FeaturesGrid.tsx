import type { FeaturesGridSection, FeaturesGridHighlightSection, FeaturesGridDetailedSection, FeaturesGridSpotlightSection, FeaturesGridStatsCardsSection, FeaturesGridStatsTextCardSection, FeaturesGridStatsTextSection } from "@shared/schema";
import { FeaturesGridHighlight } from "./FeaturesGridHighlight";
import { FeaturesGridDetailed } from "./FeaturesGridDetailed";
import { FeaturesGridSpotlight } from "./FeaturesGridSpotlight";
import { FeaturesGridStatsCards } from "./FeaturesGridStatsCards";
import { FeaturesGridStatsTextCard } from "./FeaturesGridStatsTextCard";
import { FeaturesGridStatsText } from "./FeaturesGridStatsText";

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
    case "stats-cards":
      return <FeaturesGridStatsCards data={data as FeaturesGridStatsCardsSection} />;
    case "stats-text-card":
      return <FeaturesGridStatsTextCard data={data as FeaturesGridStatsTextCardSection} />;
    case "stats-text":
      return <FeaturesGridStatsText data={data as FeaturesGridStatsTextSection} />;
    case "highlight":
    default:
      return <FeaturesGridHighlight data={data as FeaturesGridHighlightSection} />;
  }
}

export { FeaturesGridHighlight, FeaturesGridDetailed, FeaturesGridSpotlight, FeaturesGridStatsCards, FeaturesGridStatsTextCard, FeaturesGridStatsText };
export type { FeaturesGridProps };
