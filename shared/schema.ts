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

export const trustBarSchema = z.object({
  rating: z.string(),
  rating_count: z.string(),
  trusted_text: z.string(),
});

export const awardBadgeSchema = z.object({
  name: z.string(),
  source: z.string(),
  year: z.string().optional(),
});

export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  badge: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  cta_buttons: z.array(ctaButtonSchema),
  trust_bar: trustBarSchema.optional(),
  award_badges: z.array(awardBadgeSchema).optional(),
});

export const cardItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const programSpecSchema = z.object({
  icon: z.string(),
  label: z.string(),
  value: z.string(),
});

export const programOverviewSectionSchema = z.object({
  type: z.literal("program_overview"),
  title: z.string(),
  subtitle: z.string().optional(),
  specs: z.array(programSpecSchema).optional(),
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
  video_url: z.string().optional(),
  highlight: z.object({
    title: z.string(),
    description: z.string(),
    bullets: z.array(z.object({ text: z.string() })).optional(),
    cta: ctaButtonSchema.optional(),
  }).optional(),
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

export const statItemSchema = z.object({
  value: z.string(),
  label: z.string(),
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
  stats: z.array(statItemSchema).optional(),
});

export const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const faqSectionSchema = z.object({
  type: z.literal("faq"),
  title: z.string(),
  items: z.array(faqItemSchema),
  cta: z.object({
    text: z.string(),
    button_text: z.string(),
    button_url: z.string(),
  }).optional(),
});

export const testimonialItemSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string().optional(),
  rating: z.number(),
  comment: z.string(),
  outcome: z.string().optional(),
  avatar: z.string().optional(),
});

export const testimonialsSectionSchema = z.object({
  type: z.literal("testimonials"),
  title: z.string(),
  subtitle: z.string().optional(),
  rating_summary: z.object({
    average: z.string(),
    count: z.string(),
  }).optional(),
  items: z.array(testimonialItemSchema),
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

export const sectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  programOverviewSectionSchema,
  syllabusSectionSchema,
  aiLearningSectionSchema,
  mentorshipSectionSchema,
  featuresChecklistSectionSchema,
  certificateSectionSchema,
  faqSectionSchema,
  testimonialsSectionSchema,
  footerCtaSectionSchema,
  footerSectionSchema,
]);

export const schemaRefSchema = z.object({
  include: z.array(z.string()).optional(),
  overrides: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export const careerProgramMetaSchema = z.object({
  page_title: z.string(),
  description: z.string(),
  robots: z.string().default("index, follow"),
  og_image: z.string().optional(),
  canonical_url: z.string().optional(),
  expiry_date: z.string().optional(),
  priority: z.number().min(0).max(1).default(0.8),
  change_frequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]).default("weekly"),
  redirects: z.array(z.string()).optional(),
});

export const careerProgramSchema = z.object({
  slug: z.string(),
  title: z.string(),
  meta: careerProgramMetaSchema,
  schema: schemaRefSchema.optional(),
  sections: z.array(sectionSchema),
});

export const landingPageMetaSchema = z.object({
  page_title: z.string(),
  description: z.string(),
  robots: z.string().default("index, follow"),
  og_image: z.string().optional(),
  canonical_url: z.string().optional(),
  expiry_date: z.string().optional(),
  priority: z.number().min(0).max(1).default(0.8),
  change_frequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]).default("weekly"),
  redirects: z.array(z.string()).optional(),
});

export const landingPageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  meta: landingPageMetaSchema,
  schema: schemaRefSchema.optional(),
  sections: z.array(sectionSchema),
});

export type SchemaRef = z.infer<typeof schemaRefSchema>;
export type CareerProgramMeta = z.infer<typeof careerProgramMetaSchema>;
export type CTAButton = z.infer<typeof ctaButtonSchema>;
export type TrustBar = z.infer<typeof trustBarSchema>;
export type AwardBadge = z.infer<typeof awardBadgeSchema>;
export type HeroSection = z.infer<typeof heroSectionSchema>;
export type CardItem = z.infer<typeof cardItemSchema>;
export type ProgramSpec = z.infer<typeof programSpecSchema>;
export type ProgramOverviewSection = z.infer<typeof programOverviewSectionSchema>;
export type AILearningSection = z.infer<typeof aiLearningSectionSchema>;
export type MentorshipSection = z.infer<typeof mentorshipSectionSchema>;
export type FeaturesChecklistSection = z.infer<typeof featuresChecklistSectionSchema>;
export type CertificateSection = z.infer<typeof certificateSectionSchema>;
export type FAQItem = z.infer<typeof faqItemSchema>;
export type FAQSection = z.infer<typeof faqSectionSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
export type StatItem = z.infer<typeof statItemSchema>;
export type FooterCTASection = z.infer<typeof footerCtaSectionSchema>;
export type FooterSection = z.infer<typeof footerSectionSchema>;
export type SyllabusModule = z.infer<typeof syllabusModuleSchema>;
export type SyllabusSection = z.infer<typeof syllabusSectionSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type CareerProgram = z.infer<typeof careerProgramSchema>;
export type LandingPageMeta = z.infer<typeof landingPageMetaSchema>;
export type LandingPage = z.infer<typeof landingPageSchema>;
