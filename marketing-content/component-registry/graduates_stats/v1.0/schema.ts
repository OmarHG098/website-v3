/**
 * GraduatesStats Component Schemas - v1.0
 * Supports multiple layout variants via z.union
 */
import { z } from "zod";

// ============================================
// Shared Schemas
// ============================================

export const graduatesStatItemSchema = z.object({
  value: z.string(),
  unit: z.string().optional(),
  label: z.string(),
});

export const graduatesCollageImageSchema = z.object({
  image_id: z.string().optional(),
  src: z.string().optional(),
  col_span: z.number().optional(),
  row_span: z.number().optional(),
  col_start: z.number().optional(),
  row_start: z.number().optional(),
});

export const graduatesFeaturedImageSchema = z.object({
  image_id: z.string().optional(),
  src: z.string().optional(),
  col_span: z.number().optional(),
  row_span: z.number().optional(),
  col_start: z.number().optional(),
  row_start: z.number().optional(),
});

// ============================================
// Variant Schemas
// ============================================

export const graduatesStatsStandardSchema = z.object({
  type: z.literal("graduates_stats"),
  version: z.string().optional(),
  variant: z.literal("standard").optional(),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  stats: z.array(graduatesStatItemSchema),
  collage_images: z.array(graduatesCollageImageSchema),
  background: z.string().optional(),
});

export const graduatesStatsFullBleedSchema = z.object({
  type: z.literal("graduates_stats"),
  version: z.string().optional(),
  variant: z.literal("fullBleed"),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  stats: z.array(graduatesStatItemSchema),
  collage_images: z.array(graduatesCollageImageSchema),
  featured_images: z.array(graduatesFeaturedImageSchema),
  background: z.string().optional(),
});

// ============================================
// Combined Schema (Union of all variants)
// ============================================

export const graduatesStatsSectionSchema = z.union([
  graduatesStatsStandardSchema,
  graduatesStatsFullBleedSchema,
]);

// ============================================
// Types
// ============================================

export type GraduatesStatItem = z.infer<typeof graduatesStatItemSchema>;
export type GraduatesCollageImage = z.infer<typeof graduatesCollageImageSchema>;
export type GraduatesFeaturedImage = z.infer<typeof graduatesFeaturedImageSchema>;
export type GraduatesStatsStandard = z.infer<typeof graduatesStatsStandardSchema>;
export type GraduatesStatsFullBleed = z.infer<typeof graduatesStatsFullBleedSchema>;
export type GraduatesStatsSection = z.infer<typeof graduatesStatsSectionSchema>;
