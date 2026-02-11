/**
 * Career Support Explain Component Schemas - v1.0
 * Tabbed section explaining career support features with multiple layout options per tab
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

export const careerSupportStatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const careerSupportLogoSchema = z.object({
  image_id: z.string(),
  alt: z.string().optional(),
  logo_height: z.string().optional(),
});

export const careerSupportTabSchema = z.object({
  tab_label: z.string(),
  layout: z.string().optional(),

  col1_subtitle: z.string().optional(),
  col1_description: z.string().optional(),
  col1_boxes: z.array(careerSupportBoxSchema).optional(),

  col2_heading: z.string().optional(),
  col2_bullets: z.array(careerSupportBulletSchema).optional(),

  col3_image_id: z.string().optional(),
  col3_object_fit: z.enum(["cover", "contain", "fill", "none", "scale-down"]).optional(),
  col3_object_position: z.string().optional(),

  title: z.string().optional(),
  left_text: z.string().optional(),
  left_image_id: z.string().optional(),
  left_image_object_fit: z.enum(["cover", "contain", "fill", "none", "scale-down"]).optional(),
  left_image_object_position: z.string().optional(),
  left_stat: careerSupportStatSchema.optional(),
  right_bullets: z.array(careerSupportBulletSchema).optional(),
  right_logos: z.array(careerSupportLogoSchema).optional(),
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
export type CareerSupportStat = z.infer<typeof careerSupportStatSchema>;
export type CareerSupportLogo = z.infer<typeof careerSupportLogoSchema>;
export type CareerSupportTab = z.infer<typeof careerSupportTabSchema>;
export type CareerSupportExplainSection = z.infer<typeof careerSupportExplainSectionSchema>;
