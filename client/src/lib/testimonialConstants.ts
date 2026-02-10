import {
  AVAILABLE_RELATED_FEATURES,
  MAX_RELATED_FEATURES,
  type RelatedFeature,
} from "./faqConstants";

export { AVAILABLE_RELATED_FEATURES, MAX_RELATED_FEATURES, type RelatedFeature };

export interface TestimonialItem {
  student_name: string;
  priority?: number;
  linkedin_url?: string;
  related_features?: string[];
  excerpt?: string;
  full_text?: string;
  content?: string;
  student_thumb?: string;
  student_video?: string;
  rating?: number;
  locations?: string[];
  outcome?: string;
  role?: string;
  company?: string;
}

export interface SimpleTestimonial {
  student_name: string;
  content: string;
  rating?: number;
  student_thumb?: string;
  student_video?: string;
  linkedin_url?: string;
  priority?: number;
  related_features?: string[];
  outcome?: string;
  role?: string;
  company?: string;
}

export type TestimonialComponentType = "testimonials" | "testimonials_grid" | "testimonials_slide";

const COMPONENT_LIMITS: Record<TestimonialComponentType, number> = {
  testimonials: 30,
  testimonials_grid: 6,
  testimonials_slide: 9,
};

export function filterTestimonialsByRelatedFeatures(
  testimonials: TestimonialItem[],
  options: {
    relatedFeatures?: string[];
    location?: string;
    limit?: number;
    componentType?: TestimonialComponentType;
  } = {}
): SimpleTestimonial[] {
  const { relatedFeatures, location, limit, componentType } = options;
  let filtered = [...testimonials];

  // Filter by location if provided
  if (location) {
    filtered = filtered.filter((testimonial) => {
      const locations = testimonial.locations || ["all"];
      return locations.includes("all") || locations.includes(location);
    });
  }

  // Filter by related_features if provided
  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.filter((testimonial) => {
      const testimonialFeatures = testimonial.related_features || [];
      return relatedFeatures.some((feature) => testimonialFeatures.includes(feature));
    });
  }

  // Sort by match count, then by priority
  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aFeatures = a.related_features || [];
      const bFeatures = b.related_features || [];
      const aMatchCount = relatedFeatures.filter((f) => aFeatures.includes(f)).length;
      const bMatchCount = relatedFeatures.filter((f) => bFeatures.includes(f)).length;

      if (bMatchCount !== aMatchCount) {
        return bMatchCount - aMatchCount;
      }
      return (b.priority ?? 0) - (a.priority ?? 0);
    });
  } else {
    filtered = filtered.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  }

  // Determine limit: use explicit limit, component-specific limit, or default
  let finalLimit = limit;
  if (finalLimit === undefined && componentType) {
    finalLimit = COMPONENT_LIMITS[componentType];
  }

  if (finalLimit !== undefined && finalLimit > 0) {
    filtered = filtered.slice(0, finalLimit);
  }

  // Map to SimpleTestimonial format
  return filtered.map((testimonial) => {
    // Use content, full_text, or excerpt (in that order of preference)
    const textContent =
      testimonial.content || testimonial.full_text || testimonial.excerpt || "";

    return {
      student_name: testimonial.student_name,
      content: textContent,
      rating: testimonial.rating,
      student_thumb: testimonial.student_thumb,
      student_video: testimonial.student_video,
      linkedin_url: testimonial.linkedin_url,
      priority: testimonial.priority,
      related_features: testimonial.related_features,
      outcome: testimonial.outcome,
      role: testimonial.role,
      company: testimonial.company,
    };
  });
}

export function getTestimonialLimit(componentType: TestimonialComponentType): number {
  return COMPONENT_LIMITS[componentType];
}
