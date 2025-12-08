import type { HeroSection } from "@shared/schema";
import { HeroSingleColumn } from "./HeroSingleColumn";
import { HeroShowcase } from "./HeroShowcase";
import { HeroTwoColumn } from "./HeroTwoColumn";

interface HeroProps {
  data: HeroSection;
}

export function Hero({ data }: HeroProps) {
  switch (data.variant) {
    case "singleColumn":
      return <HeroSingleColumn data={data} />;
    case "showcase":
      return <HeroShowcase data={data} />;
    case "twoColumn":
      return <HeroTwoColumn data={data} />;
    default:
      return null;
  }
}

export { HeroSingleColumn, HeroShowcase, HeroTwoColumn };
