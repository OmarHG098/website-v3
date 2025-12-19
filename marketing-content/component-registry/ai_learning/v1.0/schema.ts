/**
 * AI Learning Component Schemas - v1.0
 */
import { z } from "zod";
import { ctaButtonSchema, cardItemSchema } from "../../common/schema";

export const chatExampleSchema = z.object({
  bot_name: z.string(),
  bot_status: z.string(),
  user_message: z.string(),
  bot_response: z.string(),
});

export const aiLearningSectionSchema = z.object({
  type: z.literal("ai_learning"),
  badge: z.string().optional(),
  title: z.string(),
  description: z.string(),
  features: z.array(cardItemSchema),
  chat_example: chatExampleSchema.optional(),
  video_url: z.string().optional(),
  highlight: z.object({
    title: z.string(),
    description: z.string(),
    bullets: z.array(z.object({ text: z.string(), icon: z.string().optional() })).optional(),
    cta: ctaButtonSchema.optional(),
  }).optional(),
});

export type ChatExample = z.infer<typeof chatExampleSchema>;
export type AiLearningSection = z.infer<typeof aiLearningSectionSchema>;
