import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Career Program Section Types
export const ctaButtonSchema = z.object({
  text: z.string(),
  url: z.string(),
  variant: z.enum(["primary", "secondary", "outline"]),
  icon: z.string().optional(),
});

export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  badge: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  cta_buttons: z.array(ctaButtonSchema),
});

export const cardItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const programOverviewSectionSchema = z.object({
  type: z.literal("program_overview"),
  title: z.string(),
  subtitle: z.string().optional(),
  cards: z.array(cardItemSchema),
});

export const chatExampleSchema = z.object({
  bot_name: z.string(),
  bot_status: z.string(),
  user_message: z.string(),
  bot_response: z.string(),
});

export const aiLearningSectionSchema = z.object({
  type: z.literal("ai_learning"),
  badge: z.string().optional(),
  title: z.string(),
  description: z.string(),
  features: z.array(cardItemSchema),
  chat_example: chatExampleSchema.optional(),
});

export const mentorshipSectionSchema = z.object({
  type: z.literal("mentorship"),
  title: z.string(),
  subtitle: z.string().optional(),
  cards: z.array(cardItemSchema),
});

export const featuresChecklistSectionSchema = z.object({
  type: z.literal("features_checklist"),
  title: z.string(),
  items: z.array(z.object({ text: z.string() })),
});

export const techStackSectionSchema = z.object({
  type: z.literal("tech_stack"),
  title: z.string(),
  subtitle: z.string().optional(),
  technologies: z.array(z.string()),
  extras_text: z.string().optional(),
});

export const certificateSectionSchema = z.object({
  type: z.literal("certificate"),
  title: z.string(),
  description: z.string(),
  benefits: z.array(z.object({ text: z.string() })),
  card: z.object({
    title: z.string(),
    subtitle: z.string(),
  }).optional(),
});

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const faqSectionSchema = z.object({
  type: z.literal("faq"),
  title: z.string(),
  items: z.array(faqItemSchema),
});

export const statItemSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const credibilitySectionSchema = z.object({
  type: z.literal("credibility"),
  title: z.string(),
  stats: z.array(statItemSchema),
  featured_in: z.object({
    label: z.string(),
    logos: z.array(z.string()),
  }).optional(),
});

export const footerCtaSectionSchema = z.object({
  type: z.literal("footer_cta"),
  title: z.string(),
  subtitle: z.string().optional(),
  buttons: z.array(ctaButtonSchema),
});

export const footerSectionSchema = z.object({
  type: z.literal("footer"),
  copyright_text: z.string(),
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  programOverviewSectionSchema,
  aiLearningSectionSchema,
  mentorshipSectionSchema,
  featuresChecklistSectionSchema,
  techStackSectionSchema,
  certificateSectionSchema,
  faqSectionSchema,
  credibilitySectionSchema,
  footerCtaSectionSchema,
  footerSectionSchema,
]);

export const careerProgramSchema = z.object({
  slug: z.string(),
  title: z.string(),
  meta: z.object({
    page_title: z.string(),
    description: z.string(),
  }),
  sections: z.array(sectionSchema),
});

export type CTAButton = z.infer<typeof ctaButtonSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type CardItem = z.infer<typeof cardItemSchema>;
export type ProgramOverviewSection = z.infer<typeof programOverviewSectionSchema>;
export type AILearningSection = z.infer<typeof aiLearningSectionSchema>;
export type MentorshipSection = z.infer<typeof mentorshipSectionSchema>;
export type FeaturesChecklistSection = z.infer<typeof featuresChecklistSectionSchema>;
export type TechStackSection = z.infer<typeof techStackSectionSchema>;
export type CertificateSection = z.infer<typeof certificateSectionSchema>;
export type FAQItem = z.infer<typeof faqItemSchema>;
export type FAQSection = z.infer<typeof faqSectionSchema>;
export type StatItem = z.infer<typeof statItemSchema>;
export type CredibilitySection = z.infer<typeof credibilitySectionSchema>;
export type FooterCTASection = z.infer<typeof footerCtaSectionSchema>;
export type FooterSection = z.infer<typeof footerSectionSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type CareerProgram = z.infer<typeof careerProgramSchema>;

