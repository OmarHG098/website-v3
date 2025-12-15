/**
 * Numbered Steps Component Schemas - v1.0
 */
import { z } from "zod";

export const numberedStepsStepSchema = z.object({
  icon: z.string(),
  text: z.string().optional(),
  title: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  bullet_icon: z.string().optional(),
  bullet_icon_color: z.string().optional(),
  bullet_char: z.string().optional(),
});

export const numberedStepsSectionSchema = z.object({
  type: z.literal("numbered_steps"),
  version: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  description_link: z.object({
    text: z.string(),
    url: z.string(),
  }).optional(),
  steps: z.array(numberedStepsStepSchema),
  background: z.string().optional(),
  bullet_icon: z.string().optional(),
  bullet_icon_color: z.string().optional(),
  bullet_char: z.string().optional(),
});

export type NumberedStepsStep = z.infer<typeof numberedStepsStepSchema>;
export type NumberedStepsSection = z.infer<typeof numberedStepsSectionSchema>;
