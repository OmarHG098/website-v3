import type { TestimonialsSection } from "@shared/schema";
import { TestimonialsGrid } from "./TestimonialsGrid";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

interface TestimonialsProps {
  data: TestimonialsSection;
}

export function Testimonials({ data }: TestimonialsProps) {
  const variant = data.variant || "grid";
  
  switch (variant) {
    case "grid":
      return <TestimonialsGrid data={data} />;
    case "carousel":
      return <TestimonialsCarousel data={data} />;
    default:
      return <TestimonialsGrid data={data} />;
  }
}

export { TestimonialsGrid, TestimonialsCarousel };
