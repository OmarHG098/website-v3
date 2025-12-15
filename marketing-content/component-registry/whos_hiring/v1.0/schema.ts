/**
 * Who's Hiring Component Schemas - v1.0
 */
import { z } from "zod";
import { logoItemSchema } from "../../common/schema";

export const whosHiringSectionSchema = z.object({
  type: z.literal("whos_hiring"),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  logos: z.array(logoItemSchema),
});

export type WhosHiringSection = z.infer<typeof whosHiringSectionSchema>;
