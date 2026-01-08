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

export const spotlightConfigSchema = z.object({
  initial_index: z.number().optional(),
  auto_rotate_ms: z.number().optional(),
  pause_on_hover: z.boolean().optional(),
}).strict();

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

export const featuresGridSpotlightSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("spotlight"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  items: z.array(featuresGridHighlightItemSchema),
  columns: z.number().optional(),
  icon_color: z.string().optional(),
  background: z.string().optional(),
  spotlight_config: spotlightConfigSchema.optional(),
});

export const featuresGridStatsCardsItemSchema = z.object({
  id: z.string().optional(),
  value: z.string(),
  title: z.string(),
});

export const featuresGridStatsCardsSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("stats-cards"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  card_color: z.string().optional(),
  use_card: z.boolean().optional(),
  background: z.string().optional(),
  items: z.array(featuresGridStatsCardsItemSchema),
});

export const featuresGridStatsTextCardSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("stats-text-card"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  card_color: z.string().optional(),
  background: z.string().optional(),
  items: z.array(featuresGridStatsCardsItemSchema),
});

export const featuresGridStatsTextSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("stats-text"),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  background: z.string().optional(),
  items: z.array(featuresGridStatsCardsItemSchema),
});

export const featuresGridSectionSchema = z.union([
  featuresGridHighlightSectionSchema,
  featuresGridDetailedSectionSchema,
  featuresGridSpotlightSectionSchema,
  featuresGridStatsCardsSectionSchema,
  featuresGridStatsTextCardSectionSchema,
  featuresGridStatsTextSectionSchema,
]);

export type FeaturesGridHighlightItem = z.infer<typeof featuresGridHighlightItemSchema>;
export type FeaturesGridDetailedItem = z.infer<typeof featuresGridDetailedItemSchema>;
export type FeaturesGridStatsCardsItem = z.infer<typeof featuresGridStatsCardsItemSchema>;
export type FeaturesGridHighlightSection = z.infer<typeof featuresGridHighlightSectionSchema>;
export type FeaturesGridDetailedSection = z.infer<typeof featuresGridDetailedSectionSchema>;
export type FeaturesGridSpotlightSection = z.infer<typeof featuresGridSpotlightSectionSchema>;
export type FeaturesGridStatsCardsSection = z.infer<typeof featuresGridStatsCardsSectionSchema>;
export type FeaturesGridStatsTextCardSection = z.infer<typeof featuresGridStatsTextCardSectionSchema>;
export type FeaturesGridStatsTextSection = z.infer<typeof featuresGridStatsTextSectionSchema>;
export type SpotlightConfig = z.infer<typeof spotlightConfigSchema>;
export type FeaturesGridSection = z.infer<typeof featuresGridSectionSchema>;
