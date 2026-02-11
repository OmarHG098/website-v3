/**
 * Career Support Explain Component Schemas - v1.0
 * Tabbed section explaining career support features with a 3-column layout per tab
 */
import { z } from "zod";

export const careerSupportBoxSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
});

export const careerSupportBulletSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
});

export const careerSupportTabSchema = z.object({
  tab_label: z.string(),
  col1_subtitle: z.string().optional(),
  col1_description: z.string().optional(),
  col1_boxes: z.array(careerSupportBoxSchema).optional(),
  col2_heading: z.string().optional(),
  col2_bullets: z.array(careerSupportBulletSchema).optional(),
  col3_image_id: z.string().optional(),
  col3_object_fit: z.enum(["cover", "contain", "fill", "none", "scale-down"]).optional(),
  col3_object_position: z.string().optional(),
});

export const careerSupportExplainSectionSchema = z.object({
  type: z.literal("career_support_explain"),
  version: z.string().optional(),
  heading: z.string().optional(),
  description: z.string().optional(),
  background: z.string().optional(),
  tabs: z.array(careerSupportTabSchema).min(1),
});

export type CareerSupportBox = z.infer<typeof careerSupportBoxSchema>;
export type CareerSupportBullet = z.infer<typeof careerSupportBulletSchema>;
export type CareerSupportTab = z.infer<typeof careerSupportTabSchema>;
export type CareerSupportExplainSection = z.infer<typeof careerSupportExplainSectionSchema>;
