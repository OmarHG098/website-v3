/**
 * Syllabus Component Schemas - v1.0
 */
import { z } from "zod";

export const syllabusModuleSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Focus area for landing-syllabus variant
export const focusAreaSchema = z.object({
  title: z.string(),
  icon: z.string().optional(),
});

// Default accordion variant
export const syllabusDefaultSchema = z.object({
  type: z.literal("syllabus"),
  variant: z.literal("default").optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  modules: z.array(syllabusModuleSchema),
});

// Landing syllabus variant with focus areas grid
export const syllabusLandingSchema = z.object({
  type: z.literal("syllabus"),
  variant: z.literal("landing-syllabus"),
  title: z.string(),
  description: z.string().optional(),
  emphasis: z.string().optional(),
  focus_areas: z.array(focusAreaSchema),
});

export const syllabusSectionSchema = z.union([
  syllabusDefaultSchema,
  syllabusLandingSchema,
]);

export type SyllabusModule = z.infer<typeof syllabusModuleSchema>;
export type FocusArea = z.infer<typeof focusAreaSchema>;
export type SyllabusDefault = z.infer<typeof syllabusDefaultSchema>;
export type SyllabusLanding = z.infer<typeof syllabusLandingSchema>;
export type SyllabusSection = z.infer<typeof syllabusSectionSchema>;
