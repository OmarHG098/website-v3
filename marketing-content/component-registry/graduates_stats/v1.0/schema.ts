/**
 * GraduatesStats Component Schemas - v1.0
 */
import { z } from "zod";

export const graduatesStatItemSchema = z.object({
  value: z.string(),
  unit: z.string().optional(),
  label: z.string(),
});

export const graduatesCollageImageSchema = z.object({
  image_id: z.string(),
  col_span: z.number().optional(),
  row_span: z.number().optional(),
});

export const graduatesStatsSectionSchema = z.object({
  type: z.literal("graduates_stats"),
  version: z.string().optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  stats: z.array(graduatesStatItemSchema),
  collage_images: z.array(graduatesCollageImageSchema),
  background: z.string().optional(),
});

export type GraduatesStatItem = z.infer<typeof graduatesStatItemSchema>;
export type GraduatesCollageImage = z.infer<typeof graduatesCollageImageSchema>;
export type GraduatesStatsSection = z.infer<typeof graduatesStatsSectionSchema>;
