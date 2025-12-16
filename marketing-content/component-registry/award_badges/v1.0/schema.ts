/**
 * Award Badges Component Schemas - v1.0
 */
import { z } from "zod";

export const awardBadgeItemSchema = z.object({
  name: z.string(),
  source: z.string(),
  year: z.string().optional(),
  image: z.string().optional(),
});

export const awardBadgesSectionSchema = z.object({
  type: z.literal("award_badges"),
  version: z.string().optional(),
  title: z.string().optional(),
  badges: z.array(awardBadgeItemSchema),
});

export type AwardBadgeItem = z.infer<typeof awardBadgeItemSchema>;
export type AwardBadgesSection = z.infer<typeof awardBadgesSectionSchema>;
