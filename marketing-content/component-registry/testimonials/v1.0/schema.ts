/**
 * Testimonials Component Schemas - v1.0
 */
import { z } from "zod";

export const testimonialItemSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string().optional(),
  rating: z.number(),
  comment: z.string(),
  outcome: z.string().optional(),
  avatar: z.string().optional(),
});

export const ratingSummarySchema = z.object({
  average: z.string(),
  count: z.string(),
});

// Grid variant - 3-column static grid layout
export const testimonialsGridSchema = z.object({
  type: z.literal("testimonials"),
  version: z.string().optional(),
  variant: z.literal("grid"),
  title: z.string(),
  subtitle: z.string().optional(),
  rating_summary: ratingSummarySchema.optional(),
  items: z.array(testimonialItemSchema).optional(),
  filter_by_location: z.string().optional(),
});

// Carousel variant - draggable carousel with scaling effects
export const testimonialsCarouselSchema = z.object({
  type: z.literal("testimonials"),
  version: z.string().optional(),
  variant: z.literal("carousel"),
  title: z.string(),
  subtitle: z.string().optional(),
  rating_summary: ratingSummarySchema.optional(),
  items: z.array(testimonialItemSchema).optional(),
  filter_by_location: z.string().optional(),
});

// Combined testimonials section schema
export const testimonialsSectionSchema = z.union([
  testimonialsGridSchema,
  testimonialsCarouselSchema,
]);

export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type RatingSummary = z.infer<typeof ratingSummarySchema>;
export type TestimonialsGrid = z.infer<typeof testimonialsGridSchema>;
export type TestimonialsCarousel = z.infer<typeof testimonialsCarouselSchema>;
export type TestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
