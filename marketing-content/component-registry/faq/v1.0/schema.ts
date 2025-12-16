/**
 * FAQ Component Schemas - v1.0
 */
import { z } from "zod";

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
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

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqSection = z.infer<typeof faqSectionSchema>;
