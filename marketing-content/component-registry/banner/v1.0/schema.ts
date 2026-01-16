/**
 * Banner Component Schemas - v1.0
 * 
 * A centered banner layout with optional avatars on top border, title, description, and CTA button.
 * Supports different background styles including gradient.
 */
import { z } from "zod";
import { ctaButtonSchema } from "../../common/schema";

export const bannerAvatarSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  background_color: z.string().optional(),
});

export const bannerSectionSchema = z.object({
  type: z.literal("banner"),
  version: z.string().optional(),
  avatars: z.array(bannerAvatarSchema).optional(),
  title: z.string(),
  description: z.string().optional(),
  cta: ctaButtonSchema.optional(),
  background: z.enum(["gradient", "muted", "card", "background"]).optional().default("gradient"),
});

export type BannerAvatar = z.infer<typeof bannerAvatarSchema>;
export type BannerSection = z.infer<typeof bannerSectionSchema>;
