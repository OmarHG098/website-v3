import type { WhyLearnAISection as WhyLearnAISectionType } from "@shared/schema";
import { WhyLearnAIDefault } from "./WhyLearnAIDefault";
import { WhyLearnAILaptopEdge } from "./WhyLearnAILaptopEdge";

interface WhyLearnAISectionProps {
  data: WhyLearnAISectionType;
}

export function WhyLearnAISection({ data }: WhyLearnAISectionProps) {
  const variant = data.variant || "default";
  
  switch (variant) {
    case "laptop-edge":
      return <WhyLearnAILaptopEdge data={data} />;
    case "default":
    default:
      return <WhyLearnAIDefault data={data} />;
  }
}

export { WhyLearnAIDefault, WhyLearnAILaptopEdge };
export type { WhyLearnAISectionProps };
