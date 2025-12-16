/**
 * Apply Form Component Schemas - v1.0
 * Zod schemas for apply form section validation
 */
import { z } from "zod";

export const applyFormHeroSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  note: z.string().optional(),
}).strict();

export const applyFormFieldsSchema = z.object({
  program_label: z.string(),
  program_placeholder: z.string(),
  location_label: z.string(),
  location_placeholder: z.string(),
  first_name_label: z.string(),
  first_name_placeholder: z.string(),
  last_name_label: z.string(),
  last_name_placeholder: z.string(),
  email_label: z.string(),
  email_placeholder: z.string(),
  phone_label: z.string(),
  phone_placeholder: z.string(),
  consent_marketing: z.string(),
  consent_sms: z.string(),
  submit_text: z.string(),
  terms_text: z.string(),
  terms_link_text: z.string(),
  terms_link_url: z.string(),
  privacy_text: z.string(),
  privacy_link_text: z.string(),
  privacy_link_url: z.string(),
}).strict();

export const applyFormNextStepItemSchema = z.object({
  title: z.string(),
  description: z.string(),
}).strict();

export const applyFormNextStepsSchema = z.object({
  title: z.string(),
  items: z.array(applyFormNextStepItemSchema),
  closing: z.string(),
}).strict();

export const applyFormSectionSchema = z.object({
  type: z.literal("apply_form"),
  version: z.string().optional(),
  hero: applyFormHeroSchema,
  form: applyFormFieldsSchema,
  next_steps: applyFormNextStepsSchema,
}).strict();

export type ApplyFormHero = z.infer<typeof applyFormHeroSchema>;
export type ApplyFormFields = z.infer<typeof applyFormFieldsSchema>;
export type ApplyFormNextStepItem = z.infer<typeof applyFormNextStepItemSchema>;
export type ApplyFormNextSteps = z.infer<typeof applyFormNextStepsSchema>;
export type ApplyFormSection = z.infer<typeof applyFormSectionSchema>;
