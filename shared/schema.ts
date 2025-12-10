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

export const heroImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

// Hero variant schemas - each with required fields for that variant
// Using .strict() to prevent mixing variant-specific fields
export const heroSingleColumnSchema = z.object({
  type: z.literal("hero"),
  version: z.string().optional(),
  variant: z.literal("singleColumn"),
  title: z.string(),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  cta_buttons: z.array(ctaButtonSchema).optional(),
  trust_bar: trustBarSchema.optional(),
  award_badges: z.array(awardBadgeSchema).optional(),
}).strict();

export const heroShowcaseSchema = z.object({
  type: z.literal("hero"),
  version: z.string().optional(),
  variant: z.literal("showcase"),
  title: z.string(),
  subtitle: z.string().optional(),
  trust_bar: trustBarSchema.optional(),
  cta_button: ctaButtonSchema,
  left_images: z.array(heroImageSchema).optional(),
  right_images: z.array(heroImageSchema).optional(),
  show_arrow: z.boolean().optional(),
}).strict();

export const brandMarkSchema = z.object({
  prefix: z.string().optional(),
  highlight: z.string(),
  suffix: z.string().optional(),
  color: z.enum(["primary", "accent", "destructive", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]).optional(),
});

export const heroProductShowcaseSchema = z.object({
  type: z.literal("hero"),
  version: z.string().optional(),
  variant: z.literal("productShowcase"),
  title: z.string(),
  subtitle: z.string().optional(),
  welcome_text: z.string().optional(),
  brand_mark: brandMarkSchema.optional(),
  description: z.string().optional(),
  video_id: z.string(),
  video_title: z.string().optional(),
  video_ratio: z.string().optional(),
}).strict();

export const heroSimpleTwoColumnSchema = z.object({
  type: z.literal("hero"),
  version: z.string().optional(),
  variant: z.literal("simpleTwoColumn"),
  title: z.string(),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  cta_buttons: z.array(ctaButtonSchema).optional(),
  background: z.string().optional(),
}).strict();

// Combined hero section schema - union of all variants
export const heroSectionSchema = z.union([
  heroSingleColumnSchema,
  heroShowcaseSchema,
  heroProductShowcaseSchema,
  heroSimpleTwoColumnSchema,
]);

export const cardItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
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

export const whyLearnAISectionSchema = z.object({
  type: z.literal("why_learn_ai"),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  cta: ctaButtonSchema.optional(),
});

// Pricing Section Types
export const pricingFeatureSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
  use_rigobot_icon: z.boolean().optional(),
});

export const pricingPlanSchema = z.object({
  discount_badge: z.string(),
  price: z.string(),
  period: z.string(),
  original_price: z.string().optional(),
  savings_badge: z.string().optional(),
});

export const pricingSectionSchema = z.object({
  type: z.literal("pricing"),
  title: z.string(),
  subtitle: z.string().optional(),
  monthly: pricingPlanSchema,
  yearly: pricingPlanSchema,
  tech_icons: z.array(z.string()).optional(),
  features_title: z.string().optional(),
  features: z.array(pricingFeatureSchema),
  cta: ctaButtonSchema,
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
  version: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  rating_summary: z.object({
    average: z.string(),
    count: z.string(),
  }).optional(),
  items: z.array(testimonialItemSchema).optional(),
  filter_by_location: z.string().optional(),
});

export const logoItemSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export const whosHiringSectionSchema = z.object({
  type: z.literal("whos_hiring"),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  logos: z.array(logoItemSchema),
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

// TwoColumn Section Types
export const twoColumnBulletSchema = z.object({
  text: z.string(),
  icon: z.string().optional(),
  heading: z.string().optional(),
});

export const bulletGroupSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  bullets: z.array(z.object({ text: z.string() })).optional(),
});

export const twoColumnColumnSchema = z.object({
  video: z.string().optional(),
  video_height: z.string().optional(),
  video_width: z.string().optional(),
  image: z.string().optional(),
  image_alt: z.string().optional(),
  image_max_width: z.string().optional(),
  image_max_height: z.string().optional(),
  image_mobile_max_width: z.string().optional(),
  image_mobile_max_height: z.string().optional(),
  heading: z.string().optional(),
  sub_heading: z.string().optional(),
  description: z.string().optional(),
  html_content: z.string().optional(),
  button: ctaButtonSchema.optional(),
  bullets: z.array(twoColumnBulletSchema).optional(),
  bullets_visible: z.number().optional(),
  bullet_icon: z.string().optional(),
  bullet_char: z.string().optional(),
  bullet_icon_color: z.string().optional(),
  bullet_groups: z.array(bulletGroupSchema).optional(),
  bullet_groups_collapsible: z.boolean().optional(),
  footer_description: z.string().optional(),
  gap: z.string().optional(),
  justify: z.enum(["start", "center", "end"]).optional(),
  text_align: z.enum(["left", "center", "right"]).optional(),
  font_size: z.enum(["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"]).optional(),
});

export const twoColumnSectionSchema = z.object({
  type: z.literal("two_column"),
  proportions: z.tuple([z.number(), z.number()]).optional(),
  background: z.string().optional(),
  alignment: z.enum(["start", "center", "end"]).optional(),
  container_style: z.record(z.string(), z.string()).optional(),
  left: twoColumnColumnSchema.optional(),
  right: twoColumnColumnSchema.optional(),
  reverse_on_mobile: z.boolean().optional(),
  heading_above_on_md: z.boolean().optional(),
  gap: z.string().optional(),
  padding_left: z.string().optional(),
  padding_right: z.string().optional(),
});

export const numberedStepsStepSchema = z.object({
  icon: z.string(),
  text: z.string().optional(),
  title: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  bullet_icon: z.string().optional(),
  bullet_icon_color: z.string().optional(),
  bullet_char: z.string().optional(),
});

export const numberedStepsSectionSchema = z.object({
  type: z.literal("numbered_steps"),
  version: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  description_link: z.object({
    text: z.string(),
    url: z.string(),
  }).optional(),
  steps: z.array(numberedStepsStepSchema),
  background: z.string().optional(),
  bullet_icon: z.string().optional(),
  bullet_icon_color: z.string().optional(),
  bullet_char: z.string().optional(),
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

export const projectItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  tags: z.array(z.string()).optional(),
  duration: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  date: z.string().optional(),
});

export const projectsSectionSchema = z.object({
  type: z.literal("projects"),
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(projectItemSchema),
});

// FeaturesGrid - unified component for highlight and detailed card grids
export const featuresGridHighlightItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string(),
  icon_color: z.string().optional(),
  value: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
});

export const featuresGridDetailedItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string(),
  icon_color: z.string().optional(),
  category: z.string().optional(),
  title: z.string(),
  description: z.string(),
  link_url: z.string().optional(),
  link_text: z.string().optional(),
});

export const featuresGridHighlightSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("highlight").optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(featuresGridHighlightItemSchema),
  columns: z.number().optional(),
  icon_color: z.string().optional(),
  background: z.string().optional(),
});

export const featuresGridDetailedSectionSchema = z.object({
  type: z.literal("features_grid"),
  version: z.string().optional(),
  variant: z.literal("detailed"),
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(featuresGridDetailedItemSchema),
  columns: z.number().optional(),
  icon_color: z.string().optional(),
  collapsible_mobile: z.boolean().optional(),
  background: z.string().optional(),
});

export const featuresGridSectionSchema = z.union([
  featuresGridHighlightSectionSchema,
  featuresGridDetailedSectionSchema,
]);

export type FeaturesGridHighlightItem = z.infer<typeof featuresGridHighlightItemSchema>;
export type FeaturesGridDetailedItem = z.infer<typeof featuresGridDetailedItemSchema>;
export type FeaturesGridHighlightSection = z.infer<typeof featuresGridHighlightSectionSchema>;
export type FeaturesGridDetailedSection = z.infer<typeof featuresGridDetailedSectionSchema>;
export type FeaturesGridSection = z.infer<typeof featuresGridSectionSchema>;

export const testimonialsSlideTestimonialSchema = z.object({
  name: z.string(),
  img: z.string(),
  status: z.string().optional(),
  country: z.object({
    name: z.string(),
    iso: z.string(),
  }),
  contributor: z.string(),
  description: z.string(),
  achievement: z.string().optional(),
});

export const testimonialsSlideSectionSchema = z.object({
  type: z.literal("testimonials_slide"),
  title: z.string(),
  description: z.string(),
  background: z.string().optional(),
});

export const programsListSectionSchema = z.object({
  type: z.literal("programs_list"),
  version: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  filter_by_location: z.string().optional(),
});

export const ctaBannerSectionSchema = z.object({
  type: z.literal("cta_banner"),
  version: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  cta_text: z.string(),
  cta_url: z.string(),
  background: z.string().optional(),
});

// Project Showcase Section - for graduates/projects page
export const projectShowcaseCreatorSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  github_url: z.string().optional(),
  linkedin_url: z.string().optional(),
});

export const projectShowcaseMediaSchema = z.object({
  type: z.enum(["video", "image"]),
  src: z.string(),
  alt: z.string().optional(),
});

export const projectShowcaseItemSchema = z.object({
  project_title: z.string(),
  project_url: z.string().optional(),
  description: z.string(),
  creators: z.array(projectShowcaseCreatorSchema),
  media: z.array(projectShowcaseMediaSchema).optional(),
  image: z.string().optional(),
  video_id: z.string().optional(),
});

export const projectShowcaseSectionSchema = z.object({
  type: z.literal("project_showcase"),
  version: z.string().optional(),
  project_title: z.string(),
  description: z.string(),
  creators: z.array(projectShowcaseCreatorSchema),
  media: z.array(projectShowcaseMediaSchema).optional(),
  image: z.string().optional(),
  video_id: z.string().optional(),
  background: z.string().optional(),
  media_position: z.enum(["left", "right"]).optional(),
});

export const projectsShowcaseSectionSchema = z.object({
  type: z.literal("projects_showcase"),
  version: z.string().optional(),
  items: z.array(projectShowcaseItemSchema),
});

export type ProjectShowcaseCreator = z.infer<typeof projectShowcaseCreatorSchema>;
export type ProjectShowcaseMedia = z.infer<typeof projectShowcaseMediaSchema>;
export type ProjectShowcaseItem = z.infer<typeof projectShowcaseItemSchema>;
export type ProjectShowcaseSection = z.infer<typeof projectShowcaseSectionSchema>;
export type ProjectsShowcaseSection = z.infer<typeof projectsShowcaseSectionSchema>;

// About section schema
export const aboutSectionSchema = z.object({
  type: z.literal("about"),
  version: z.string().optional(),
  height: z.string().optional(),
  title: z.string(),
  description: z.string(),
  link_text: z.string(),
  link_url: z.string(),
  image_src: z.string(),
  image_alt: z.string(),
});

export type AboutSection = z.infer<typeof aboutSectionSchema>;

// Section schema using z.union to support hero variants
// Each hero variant has the same type: "hero" but different variant-specific required fields
export const sectionSchema = z.union([
  heroSingleColumnSchema,
  heroShowcaseSchema,
  heroProductShowcaseSchema,
  heroSimpleTwoColumnSchema,
  syllabusSectionSchema,
  projectsSectionSchema,
  aiLearningSectionSchema,
  mentorshipSectionSchema,
  certificateSectionSchema,
  whyLearnAISectionSchema,
  pricingSectionSchema,
  faqSectionSchema,
  testimonialsSectionSchema,
  whosHiringSectionSchema,
  footerCtaSectionSchema,
  footerSectionSchema,
  twoColumnSectionSchema,
  numberedStepsSectionSchema,
  testimonialsSlideSectionSchema,
  featuresGridHighlightSectionSchema,
  featuresGridDetailedSectionSchema,
  programsListSectionSchema,
  ctaBannerSectionSchema,
  projectShowcaseSectionSchema,
  projectsShowcaseSectionSchema,
  aboutSectionSchema,
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
export type HeroSingleColumn = z.infer<typeof heroSingleColumnSchema>;
export type HeroShowcase = z.infer<typeof heroShowcaseSchema>;
export type HeroProductShowcase = z.infer<typeof heroProductShowcaseSchema>;
export type HeroSimpleTwoColumn = z.infer<typeof heroSimpleTwoColumnSchema>;
export type CardItem = z.infer<typeof cardItemSchema>;
export type AILearningSection = z.infer<typeof aiLearningSectionSchema>;
export type MentorshipSection = z.infer<typeof mentorshipSectionSchema>;
export type CertificateSection = z.infer<typeof certificateSectionSchema>;
export type WhyLearnAISection = z.infer<typeof whyLearnAISectionSchema>;
export type PricingFeature = z.infer<typeof pricingFeatureSchema>;
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
export type PricingSection = z.infer<typeof pricingSectionSchema>;
export type FAQItem = z.infer<typeof faqItemSchema>;
export type FAQSection = z.infer<typeof faqSectionSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TestimonialsSection = z.infer<typeof testimonialsSectionSchema>;
export type LogoItem = z.infer<typeof logoItemSchema>;
export type WhosHiringSection = z.infer<typeof whosHiringSectionSchema>;
export type StatItem = z.infer<typeof statItemSchema>;
export type FooterCTASection = z.infer<typeof footerCtaSectionSchema>;
export type FooterSection = z.infer<typeof footerSectionSchema>;
export type SyllabusModule = z.infer<typeof syllabusModuleSchema>;
export type SyllabusSection = z.infer<typeof syllabusSectionSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type ProjectsSection = z.infer<typeof projectsSectionSchema>;
export type TwoColumnBullet = z.infer<typeof twoColumnBulletSchema>;
export type TwoColumnColumn = z.infer<typeof twoColumnColumnSchema>;
export type TwoColumnSection = z.infer<typeof twoColumnSectionSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type CareerProgram = z.infer<typeof careerProgramSchema>;
export type LandingPageMeta = z.infer<typeof landingPageMetaSchema>;
export type LandingPage = z.infer<typeof landingPageSchema>;

// Location Page Schema
export const locationMetaSchema = z.object({
  page_title: z.string(),
  description: z.string(),
  robots: z.string().default("index, follow"),
  og_image: z.string().optional(),
  priority: z.number().min(0).max(1).default(0.8),
  change_frequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]).default("monthly"),
  redirects: z.array(z.string()).optional(),
});

export const admissionAdvisorSchema = z.object({
  name: z.string(),
  email: z.string(),
  calendar_url: z.string().optional(),
  photo: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export const locationCatalogSchema = z.object({
  admission_advisors: z.array(admissionAdvisorSchema).optional(),
});

export const locationPageSchema = z.object({
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  country_code: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  region: z.enum(["usa-canada", "europe", "latam"]),
  default_language: z.string(),
  timezone: z.string(),
  visibility: z.enum(["listed", "unlisted"]),
  phone: z.string().optional(),
  address: z.string().optional(),
  available_programs: z.array(z.string()).optional(),
  catalog: locationCatalogSchema.optional(),
  meta: locationMetaSchema,
  schema: schemaRefSchema.optional(),
  sections: z.array(sectionSchema),
});

export type LocationMeta = z.infer<typeof locationMetaSchema>;
export type LocationPage = z.infer<typeof locationPageSchema>;
