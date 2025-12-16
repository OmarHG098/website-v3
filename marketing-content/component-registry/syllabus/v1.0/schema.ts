/**
 * Syllabus Component Schemas - v1.0
 */
import { z } from "zod";

export const syllabusModuleSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const syllabusSectionSchema = z.object({
  type: z.literal("syllabus"),
  title: z.string(),
  subtitle: z.string().optional(),
  modules: z.array(syllabusModuleSchema),
});

export type SyllabusModule = z.infer<typeof syllabusModuleSchema>;
export type SyllabusSection = z.infer<typeof syllabusSectionSchema>;
