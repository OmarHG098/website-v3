/**
 * Banner Component Schemas - v1.0
 * 
 * A centered banner layout with optional icon, title, description, and CTA button.
 * Supports different background styles including gradient.
 */
import { z } from "zod";
import { ctaButtonSchema } from "../../common/schema";

export const bannerIconSchema = z.object({
  type: z.enum(["tabler", "image"]),
  name: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  background_color: z.string().optional(),
});

export const bannerSectionSchema = z.object({
  type: z.literal("banner"),
  version: z.string().optional(),
  icon: bannerIconSchema.optional(),
  title: z.string(),
  description: z.string().optional(),
  cta: ctaButtonSchema.optional(),
  background: z.enum(["gradient", "muted", "card", "background"]).optional().default("gradient"),
});

export type BannerIcon = z.infer<typeof bannerIconSchema>;
export type BannerSection = z.infer<typeof bannerSectionSchema>;
