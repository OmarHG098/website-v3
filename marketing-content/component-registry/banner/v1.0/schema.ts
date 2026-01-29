/**
 * Banner Component Schemas - v1.0
 * 
 * A centered banner layout with optional avatars on top border, title, description, and CTA button.
 * Supports different background styles including gradient.
 */
import { z } from "zod";
import { ctaButtonSchema } from "../../_common/schema";

export const bannerSectionSchema = z.object({
  type: z.literal("banner"),
  version: z.string().optional(),
  logo: z.string().optional(),
  avatars: z.array(z.string()).optional(),
  title: z.string(),
  description: z.string().optional(),
  cta: ctaButtonSchema.optional(),
  background: z.enum(["gradient", "muted", "card", "background"]).optional().default("gradient"),
});

export type BannerSection = z.infer<typeof bannerSectionSchema>;
