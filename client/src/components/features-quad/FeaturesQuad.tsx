import type { FeatureQuadSection } from "@shared/schema";
import { FeaturesQuadDefault } from "./FeaturesQuadDefault";
import { FeaturesQuadLaptopEdge } from "./FeaturesQuadLaptopEdge";

interface FeaturesQuadProps {
  data: FeatureQuadSection;
}

export function FeaturesQuad({ data }: FeaturesQuadProps) {
  const variant = data.variant || "default";

  switch (variant) {
    case "laptopEdge":
      return <FeaturesQuadLaptopEdge data={data} />;
    case "default":
    default:
      return <FeaturesQuadDefault data={data} />;
  }
}
