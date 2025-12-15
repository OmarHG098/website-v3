/**
 * Comparison Table Component Schemas - v1.0
 */
import { z } from "zod";

export const comparisonTableColumnSchema = z.object({
  name: z.string(),
  highlight: z.boolean().optional(),
});

export const comparisonTableRowSchema = z.object({
  feature: z.string(),
  values: z.array(z.string()),
  feature_description: z.string().optional(),
});

export const comparisonTableSectionSchema = z.object({
  type: z.literal("comparison_table"),
  version: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  columns: z.array(comparisonTableColumnSchema),
  rows: z.array(comparisonTableRowSchema),
  footnote: z.string().optional(),
});

export type ComparisonTableColumn = z.infer<typeof comparisonTableColumnSchema>;
export type ComparisonTableRow = z.infer<typeof comparisonTableRowSchema>;
export type ComparisonTableSection = z.infer<typeof comparisonTableSectionSchema>;
