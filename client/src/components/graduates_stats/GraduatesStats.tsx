import type { GraduatesStatsSection } from "@shared/schema";
import { GraduatesStatsStandard } from "./GraduatesStatsStandard";
import { GraduatesStatsFullBleed } from "./GraduatesStatsFullBleed";

interface GraduatesStatsProps {
  data: GraduatesStatsSection;
}

export function GraduatesStats({ data }: GraduatesStatsProps) {
  const variant = 'variant' in data ? data.variant : 'standard';

  switch (variant) {
    case "fullBleed":
      return <GraduatesStatsFullBleed data={data} />;
    case "standard":
    default:
      return <GraduatesStatsStandard data={data} />;
  }
}

export default GraduatesStats;
