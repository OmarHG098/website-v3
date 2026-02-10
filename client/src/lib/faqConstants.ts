export type RelatedFeature =
  | "online-platform"
  | "mentors-and-teachers"
  | "price"
  | "career-support"
  | "content-and-syllabus"
  | "job-guarantee"
  | "full-stack"
  | "cybersecurity"
  | "data-science"
  | "applied-ai"
  | "ai-engineering"
  | "outcomes"
  | "scholarships"
  | "rigobot"
  | "learnpack"
  | "certification";

export const AVAILABLE_RELATED_FEATURES: RelatedFeature[] = [
  "online-platform",
  "mentors-and-teachers",
  "price",
  "career-support",
  "content-and-syllabus",
  "job-guarantee",
  "full-stack",
  "cybersecurity",
  "data-science",
  "applied-ai",
  "ai-engineering",
  "outcomes",
  "scholarships",
  "rigobot",
  "learnpack",
  "certification",
];

export const MAX_RELATED_FEATURES = 3;

export interface FaqItem {
  question: string;
  answer: string;
  locations?: string[];
  related_features?: string[];
  last_updated?: string;
  priority?: number;
}

export interface SimpleFaq {
  question: string;
  answer: string;
}

export function filterFaqsByRelatedFeatures(
  faqs: FaqItem[],
  options: {
    relatedFeatures?: string[];
    location?: string;
    limit?: number;
  } = {}
): SimpleFaq[] {
  const { relatedFeatures, location, limit } = options;
  let filtered = [...faqs];

  if (location) {
    filtered = filtered.filter((faq) => {
      const locations = faq.locations || ["all"];
      return locations.includes("all") || locations.includes(location);
    });
  }

  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.filter((faq) => {
      const faqFeatures = faq.related_features || [];
      return relatedFeatures.some((feature) => faqFeatures.includes(feature));
    });
  }

  // 1 = highest priority
  if (relatedFeatures && relatedFeatures.length > 0) {
    filtered = filtered.sort((a, b) => {
      const aFeatures = a.related_features || [];
      const bFeatures = b.related_features || [];
      const aMatchCount = relatedFeatures.filter((f) => aFeatures.includes(f)).length;
      const bMatchCount = relatedFeatures.filter((f) => bFeatures.includes(f)).length;

      if (bMatchCount !== aMatchCount) {
        return bMatchCount - aMatchCount;
      }
      return (a.priority ?? Infinity) - (b.priority ?? Infinity);
    });
  } else {
    filtered = filtered.sort((a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity));
  }

  if (limit !== undefined && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  return filtered.map(({ question, answer }) => ({ question, answer }));
}
