/**
 * FAQ Component Schemas - v1.0
 */
import { z } from "zod";

export const relatedFeaturesEnum = z.enum([
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
  "outcomes",
  "scholarships",
  "rigobot",
  "learnpack",
  "certification",
]);

export type RelatedFeature = z.infer<typeof relatedFeaturesEnum>;

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  locations: z.array(z.string()).optional().default(["all"]),
  related_features: z.array(relatedFeaturesEnum).optional().default([]),
  priority: z.number().int().optional().default(0),
});

export const faqSectionSchema = z.object({
  type: z.literal("faq"),
  title: z.string(),
  items: z.array(faqItemSchema),
  cta: z.object({
    text: z.string(),
    button_text: z.string(),
    button_url: z.string(),
  }).optional(),
});

export const centralizedFaqsSchema = z.object({
  faqs: z.array(faqItemSchema),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqSection = z.infer<typeof faqSectionSchema>;
export type CentralizedFaqs = z.infer<typeof centralizedFaqsSchema>;
