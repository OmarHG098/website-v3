/**
 * Pricing Component Schemas - v1.0
 */
import { z } from "zod";
import { ctaButtonSchema } from "../../common/schema";

export const pricingFeatureSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
  use_rigobot_icon: z.boolean().optional(),
});

export const pricingPlanSchema = z.object({
  discount_badge: z.string(),
  price: z.string(),
  period: z.string(),
  original_price: z.string().optional(),
  savings_badge: z.string().optional(),
});

export const pricingSectionSchema = z.object({
  type: z.literal("pricing"),
  title: z.string(),
  subtitle: z.string().optional(),
  monthly: pricingPlanSchema,
  yearly: pricingPlanSchema,
  tech_icons: z.array(z.string()).optional(),
  features_title: z.string().optional(),
  features: z.array(pricingFeatureSchema),
  cta: ctaButtonSchema,
});

export type PricingFeature = z.infer<typeof pricingFeatureSchema>;
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
export type PricingSection = z.infer<typeof pricingSectionSchema>;
