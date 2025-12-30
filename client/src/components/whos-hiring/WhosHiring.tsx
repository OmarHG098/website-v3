import type { WhosHiringSection as WhosHiringSectionType } from "@shared/schema";
import { WhosHiringGrid } from "./WhosHiringGrid";
import { WhosHiringCarousel } from "./WhosHiringCarousel";

interface WhosHiringProps {
  data: WhosHiringSectionType;
}

export function WhosHiring({ data }: WhosHiringProps) {
  const variant = (data as { variant?: string }).variant;
  
  switch (variant) {
    case "carousel":
      return <WhosHiringCarousel data={data} />;
    case "grid":
    default:
      return <WhosHiringGrid data={data} />;
  }
}

export { WhosHiringGrid, WhosHiringCarousel };
