import type { PartnershipCarouselSection } from "@shared/schema";
import { PartnershipCarouselDefault } from "./PartnershipCarouselDefault";
import { PartnershipCarouselSplitCard } from "./PartnershipCarouselSplitCard";

interface PartnershipCarouselProps {
  data: PartnershipCarouselSection;
}

export function PartnershipCarousel({ data }: PartnershipCarouselProps) {
  const variant = data.variant || "default";

  switch (variant) {
    case "split-card":
      return <PartnershipCarouselSplitCard data={data} />;
    case "default":
    default:
      return <PartnershipCarouselDefault data={data} />;
  }
}

export { PartnershipCarouselDefault, PartnershipCarouselSplitCard };
export type { PartnershipCarouselProps };
export default PartnershipCarousel;
