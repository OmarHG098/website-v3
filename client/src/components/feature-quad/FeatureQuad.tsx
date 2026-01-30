import type { FeatureQuadSection } from "@shared/schema";
import { FeatureQuadDefault } from "./FeatureQuadDefault";
import { FeatureQuadLaptopEdge } from "./FeatureQuadLaptopEdge";

interface FeatureQuadProps {
  data: FeatureQuadSection;
}

export function FeatureQuad({ data }: FeatureQuadProps) {
  const variant = data.variant || "default";

  switch (variant) {
    case "laptopEdge":
      return <FeatureQuadLaptopEdge data={data} />;
    case "default":
    default:
      return <FeatureQuadDefault data={data} />;
  }
}
