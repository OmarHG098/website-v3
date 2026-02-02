/**
 * ImageRow Component Schemas - v1.0
 * 
 * A flexible row of images with an optional highlight content box.
 * Useful for showcasing students, team members, or any visual gallery with messaging.
 */
import { z } from "zod";

export const imageRowImageSchema = z.object({
  src: z.string().describe("Image URL or path"),
  alt: z.string().describe("Alt text for accessibility"),
  object_fit: z.enum(["cover", "contain", "fill", "none", "scale-down"]).optional().describe("CSS object-fit property"),
  object_position: z.string().optional().describe("CSS object-position property (e.g., 'center top', '20% 50%')"),
});

export const imageRowHighlightSchema = z.object({
  heading: z.string().describe("Small heading text above main message"),
  text: z.string().describe("Main message text"),
  background: z.enum(["primary", "accent", "muted", "card"]).optional().describe("Background color theme"),
  width: z.number().optional().describe("Relative width compared to images (default: 2)"),
});

export const imageRowSectionSchema = z.object({
  type: z.literal("image_row"),
  images: z.array(imageRowImageSchema).min(1).describe("Array of images to display"),
  highlight: imageRowHighlightSchema.optional().describe("Optional highlight content box"),
  height: z.string().optional().describe("Row height (e.g., '31rem', 'auto')"),
  mobile_height: z.string().optional().describe("Height on mobile devices"),
  gap: z.enum(["sm", "md", "lg"]).optional().describe("Gap between images"),
  rounded: z.boolean().optional().describe("Apply rounded corners to images"),
  background: z.string().optional().describe("Section background color"),
});

export type ImageRowImage = z.infer<typeof imageRowImageSchema>;
export type ImageRowHighlight = z.infer<typeof imageRowHighlightSchema>;
export type ImageRowSection = z.infer<typeof imageRowSectionSchema>;
