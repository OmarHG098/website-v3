/**
 * Features Grid Component Schemas - v1.0
 */
import { z } from "zod";

export const featuresGridHighlightItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string(),
  icon_color: z.string().optional(),
  value: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
});

export const featuresGridDetailedItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().optional(),
  icon_color: z.string().optional(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }).optional(),
  category: z.string().optional(),
  title: z.string(),
  description: z.string(),
  link_url: z.string().optional(),
  link_text: z.string().optional(),
});

export const featuresGridCardHeaderCardSchema = z.object({
  icon: z.string(),
  text: z.string(),
});

export const featuresGridHighlightSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("highlight").optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(featuresGridHighlightItemSchema),
  columns: z.number().optional(),
  icon_color: z.string().optional(),
  background: z.string().optional(),
});

export const featuresGridDetailedSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("detailed"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(featuresGridDetailedItemSchema),
  columns: z.number().optional(),
  icon_color: z.string().optional(),
  collapsible_mobile: z.boolean().optional(),
  background: z.string().optional(),
});

export const featuresGridCardHeaderSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("cardHeader"),
  heading: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_alt: z.string().optional(),
  cards: z.array(featuresGridCardHeaderCardSchema),
  background: z.string().optional(),
});

export const featuresGridSectionSchema = z.union([
  featuresGridHighlightSectionSchema,
  featuresGridDetailedSectionSchema,
  featuresGridCardHeaderSectionSchema,
]);

export type FeaturesGridHighlightItem = z.infer<typeof featuresGridHighlightItemSchema>;
export type FeaturesGridDetailedItem = z.infer<typeof featuresGridDetailedItemSchema>;
export type FeaturesGridCardHeaderCard = z.infer<typeof featuresGridCardHeaderCardSchema>;
export type FeaturesGridHighlightSection = z.infer<typeof featuresGridHighlightSectionSchema>;
export type FeaturesGridDetailedSection = z.infer<typeof featuresGridDetailedSectionSchema>;
export type FeaturesGridCardHeaderSection = z.infer<typeof featuresGridCardHeaderSectionSchema>;
export type FeaturesGridSection = z.infer<typeof featuresGridSectionSchema>;
