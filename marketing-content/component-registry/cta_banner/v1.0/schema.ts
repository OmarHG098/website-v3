/**
 * CTA Banner Component Schemas - v1.0
 */
import { z } from "zod";
import { ctaButtonSchema, leadFormDataSchema } from "../../common/schema";

export const ctaBannerSectionSchema = z.object({
  type: z.literal("cta_banner"),
  version: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_url: z.string().optional(),
  buttons: z.array(ctaButtonSchema).optional(),
  background: z.string().optional(),
  mobile_form: leadFormDataSchema.optional(),
  mobile_button: ctaButtonSchema.optional(),
}).refine(
  (data) => (data.cta_text && data.cta_url) || (data.buttons && data.buttons.length > 0),
  { message: "Either cta_text/cta_url or buttons array must be provided" }
);

export type CtaBannerSection = z.infer<typeof ctaBannerSectionSchema>;
