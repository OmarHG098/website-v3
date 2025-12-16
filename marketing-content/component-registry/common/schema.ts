/**
 * Common schemas shared across multiple components
 * These are imported by individual component schemas
 */
import { z } from "zod";

// CTA Button - used in many components
export const ctaButtonSchema = z.object({
  text: z.string(),
  url: z.string(),
  variant: z.enum(["primary", "secondary", "outline"]),
  icon: z.string().optional(),
});

export type CtaButton = z.infer<typeof ctaButtonSchema>;

// Video configuration - used in hero, two_column, etc.
export const videoConfigSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  ratio: z.string().optional(),
  muted: z.boolean().optional(),
  autoplay: z.boolean().optional(),
  loop: z.boolean().optional(),
  preview_image_url: z.string().optional(),
});

export type VideoConfig = z.infer<typeof videoConfigSchema>;

// Image reference - used in hero, features_grid, etc.
export const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export type ImageDef = z.infer<typeof imageSchema>;

// Lead Form field config
export const leadFormFieldConfigSchema = z.object({
  visible: z.boolean().optional(),
  required: z.boolean().optional(),
  default: z.string().optional(),
  helper_text: z.string().optional(),
  placeholder: z.string().optional(),
});

// Turnstile configuration schema
export const turnstileConfigSchema = z.object({
  enabled: z.boolean().optional(),
  theme: z.enum(["light", "dark", "auto"]).optional(),
  size: z.enum(["normal", "compact"]).optional(),
});

export type TurnstileConfig = z.infer<typeof turnstileConfigSchema>;

// Lead Form data schema
export const leadFormDataSchema = z.object({
  variant: z.enum(["stacked", "inline"]).optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  submit_label: z.string().optional(),
  tags: z.string().optional(),
  automations: z.string().optional(),
  fields: z.object({
    email: leadFormFieldConfigSchema.optional(),
    first_name: leadFormFieldConfigSchema.optional(),
    last_name: leadFormFieldConfigSchema.optional(),
    phone: leadFormFieldConfigSchema.optional(),
    program: leadFormFieldConfigSchema.optional(),
    region: leadFormFieldConfigSchema.optional(),
    location: leadFormFieldConfigSchema.optional(),
    coupon: leadFormFieldConfigSchema.optional(),
    comment: leadFormFieldConfigSchema.optional(),
  }).optional(),
  success: z.object({
    url: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
  terms_url: z.string().optional(),
  privacy_url: z.string().optional(),
  consent: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    whatsapp: z.boolean().optional(),
  }).optional(),
  show_terms: z.boolean().optional(),
  className: z.string().optional(),
  turnstile: turnstileConfigSchema.optional(),
});

export type LeadFormData = z.infer<typeof leadFormDataSchema>;

// Card item - used in ai_learning, mentorship
export const cardItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export type CardItem = z.infer<typeof cardItemSchema>;

// Stat item - used in certificate, etc.
export const statItemSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export type StatItem = z.infer<typeof statItemSchema>;

// Logo item - used in whos_hiring
export const logoItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export type LogoItem = z.infer<typeof logoItemSchema>;
