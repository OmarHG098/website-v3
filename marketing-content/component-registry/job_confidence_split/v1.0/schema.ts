/**
 * Job Confidence Split Component Schemas - v1.0
 * 
 * A two-card layout with responsive sizing: 3/4 + 1/4 on desktop, 50/50 on tablet, stacked on mobile.
 * Primary card has dark background with heading, description, and floating tool icons.
 * Secondary card has accent background with a list of benefits.
 */
import { z } from "zod";

export const toolIconSchema = z.object({
  icon: z.string().optional(),
  image_id: z.string().optional(),
  size: z.enum(["sm", "md", "lg"]).optional().default("md"),
  position: z.object({
    bottom: z.string().optional(),
    left: z.string().optional(),
    right: z.string().optional(),
  }).optional(),
});

export const benefitItemSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
});

export const jobConfidenceSplitSectionSchema = z.object({
  type: z.literal("job_confidence_split"),
  primary: z.object({
    heading: z.string(),
    description: z.string().optional(),
    badge: z.string().optional(),
    tool_icons: z.array(toolIconSchema).optional(),
  }),
  secondary: z.object({
    benefits: z.array(benefitItemSchema).min(1).max(5),
  }),
  background: z.string().optional(),
});

export type ToolIcon = z.infer<typeof toolIconSchema>;
export type BenefitItem = z.infer<typeof benefitItemSchema>;
export type JobConfidenceSplitSection = z.infer<typeof jobConfidenceSplitSectionSchema>;
