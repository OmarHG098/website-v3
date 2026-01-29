/**
 * Why Learn AI Component Schemas - v1.0
 */
import { z } from "zod";
import { ctaButtonSchema } from "../../_common/schema";

export const whyLearnAISectionSchema = z.object({
  type: z.literal("why_learn_ai"),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  cta: ctaButtonSchema.optional(),
});

export type WhyLearnAISection = z.infer<typeof whyLearnAISectionSchema>;
