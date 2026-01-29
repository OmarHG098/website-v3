import type { TwoColumnAccordionCardSection } from "@shared/schema";
import { TwoColumnAccordionCardDefault } from "./TwoColumnAccordionCardDefault";
import { TwoColumnAccordionCardImageBackground } from "./TwoColumnAccordionCardImageBackground";

interface TwoColumnAccordionCardProps {
  data: TwoColumnAccordionCardSection;
}

export function TwoColumnAccordionCard({ data }: TwoColumnAccordionCardProps) {
  const variant = data.variant || "default";
  
  switch (variant) {
    case "image_background":
      return <TwoColumnAccordionCardImageBackground data={data} />;
    case "default":
    default:
      return <TwoColumnAccordionCardDefault data={data} />;
  }
}

export { TwoColumnAccordionCardDefault, TwoColumnAccordionCardImageBackground };
export type { TwoColumnAccordionCardProps };
