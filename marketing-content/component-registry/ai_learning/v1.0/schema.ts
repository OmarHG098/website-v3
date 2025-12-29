/**
 * AI Learning Component Schemas - v1.0
 */
import { z } from "zod";
import { ctaButtonSchema } from "../../common/schema";

export const chatExampleSchema = z.object({
  bot_name: z.string(),
  bot_status: z.string(),
  user_message: z.string(),
  bot_response: z.string(),
});

// Extended card item for AI learning features with optional bullets, video, or image
export const aiLearningFeatureSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  show_rigobot_logo: z.boolean().optional(),
  bullets: z.array(z.object({ text: z.string(), icon: z.string().optional() })).optional(),
  video_url: z.string().optional(),
  image_id: z.string().optional(),
});

export const aiLearningSectionSchema = z.object({
  type: z.literal("ai_learning"),
  badge: z.string().optional(),
  title: z.string(),
  description: z.string(),
  features: z.array(aiLearningFeatureSchema),
  chat_example: chatExampleSchema.optional(),
  video_url: z.string().optional(),
  video_position: z.enum(["left", "right"]).optional(),
  highlight: z.object({
    title: z.string(),
    description: z.string(),
    bullets: z.array(z.object({ text: z.string(), icon: z.string().optional() })).optional(),
    cta: ctaButtonSchema.optional(),
  }).optional(),
});

export type ChatExample = z.infer<typeof chatExampleSchema>;
export type AiLearningSection = z.infer<typeof aiLearningSectionSchema>;
