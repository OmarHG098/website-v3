import { z } from "zod";

export const testimonialsGridItemSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string().optional(),
  comment: z.string(),
  rating: z.number().optional(),
  avatar: z.string().optional(),
  linkedin_url: z.string().optional(),
  box_color: z.string().optional(),
  media: z.object({
    url: z.string(),
    type: z.enum(["image", "video"]).optional(),
    ratio: z.string().optional(),
  }).optional(),
});

export const testimonialsGridSectionSchema = z.object({
  type: z.literal("testimonials_grid"),
  version: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  default_box_color: z.string().optional(),
  columns: z.number().optional(),
  items: z.array(testimonialsGridItemSchema).optional(),
  background: z.string().optional(),
});

export type TestimonialsGridItem = z.infer<typeof testimonialsGridItemSchema>;
export type TestimonialsGridSection = z.infer<typeof testimonialsGridSectionSchema>;
