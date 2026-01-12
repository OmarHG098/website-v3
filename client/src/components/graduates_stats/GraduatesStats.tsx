import type { GraduatesStatsSection, GraduatesStatsAsymmetric as GraduatesStatsAsymmetricType } from "@shared/schema";
import { GraduatesStatsStandard } from "./GraduatesStatsStandard";
import { GraduatesStatsFullBleed } from "./GraduatesStatsFullBleed";
import { GraduatesStatsAsymmetric } from "./GraduatesStatsAsymmetric";

interface GraduatesStatsProps {
  data: GraduatesStatsSection;
}

function isAsymmetricVariant(data: GraduatesStatsSection): data is GraduatesStatsAsymmetricType {
  return 'variant' in data && data.variant === 'asymmetric';
}

export function GraduatesStats({ data }: GraduatesStatsProps) {
  if (isAsymmetricVariant(data)) {
    return <GraduatesStatsAsymmetric data={data} />;
  }
  
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
