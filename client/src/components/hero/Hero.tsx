import type { HeroSection } from "@shared/schema";
import { HeroSingleColumn } from "./HeroSingleColumn";
import { HeroShowcase } from "./HeroShowcase";
import { HeroProductShowcase } from "./HeroProductShowcase";
import { HeroSimpleTwoColumn } from "./HeroSimpleTwoColumn";
import { HeroSimpleStacked } from "./HeroSimpleStacked";

interface HeroProps {
  data: HeroSection;
}

export function Hero({ data }: HeroProps) {
  switch (data.variant) {
    case "singleColumn":
      return <HeroSingleColumn data={data} />;
    case "showcase":
      return <HeroShowcase data={data} />;
    case "productShowcase":
      return <HeroProductShowcase data={data} />;
    case "simpleTwoColumn":
      return <HeroSimpleTwoColumn data={data} />;
    case "simpleStacked":
      return <HeroSimpleStacked data={data} />;
    default:
      return null;
  }
}

export { HeroSingleColumn, HeroShowcase, HeroProductShowcase, HeroSimpleTwoColumn, HeroSimpleStacked };
