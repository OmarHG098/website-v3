import { z } from "zod";

export const pressGridItemSchema = z.object({
  logo: z.string().optional(),
  title: z.string(),
  excerpt: z.string(),
  link_text: z.string().optional(),
  link_url: z.string().optional(),
  box_color: z.string().optional(),
  title_color: z.string().optional(),
  excerpt_color: z.string().optional(),
  link_color: z.string().optional(),
});

export const pressGridSectionSchema = z.object({
  type: z.literal("press_grid"),
  version: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  title_color: z.string().optional(),
  subtitle_color: z.string().optional(),
  default_box_color: z.string().optional(),
  default_title_color: z.string().optional(),
  default_excerpt_color: z.string().optional(),
  default_link_color: z.string().optional(),
  columns: z.number().optional(),
  items: z.array(pressGridItemSchema).optional(),
  background: z.string().optional(),
});

export type PressGridItem = z.infer<typeof pressGridItemSchema>;
export type PressGridSection = z.infer<typeof pressGridSectionSchema>;
