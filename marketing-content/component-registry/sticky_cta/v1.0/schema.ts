/**
 * Sticky CTA Component Schemas - v1.0
 */
import { z } from "zod";
import { leadFormDataSchema } from "../../common/schema";

export const stickyCtaSectionSchema = z.object({
  type: z.literal("sticky_cta"),
  version: z.string().optional(),
  heading: z.string().describe("Text displayed in the sticky bar"),
  button_label: z.string().optional().describe("Label for the expand button").default("Apply Now"),
  form: leadFormDataSchema.optional().describe("LeadForm configuration shown when expanded"),
});

export type StickyCtaSection = z.infer<typeof stickyCtaSectionSchema>;
