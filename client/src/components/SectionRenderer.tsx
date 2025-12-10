
import type { Section } from "@shared/schema";
import { Hero } from "@/components/hero/Hero";
import { SyllabusSection } from "./SyllabusSection";
import { ProjectsSection } from "./ProjectsSection";
import { AILearningSection } from "./AILearningSection";
import { CertificateSection } from "./CertificateSection";
import { WhyLearnAISection } from "./WhyLearnAISection";
import { PricingSection } from "./PricingSection";
import { FAQSection } from "./FAQSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { WhosHiringSection } from "./WhosHiringSection";
import { FooterCTASection } from "./FooterCTASection";
import { FooterSection } from "./FooterSection";
import { TwoColumn } from "@/components/TwoColumn";
import NumberedSteps from "@/components/NumberedSteps";
import StatsSection from "@/components/StatsSection";
import TestimonialsSlide from "@/components/TestimonialsSlide";
import { FeaturesGridSection } from "./FeaturesGridSection";
import { ProgramsListSection } from "./ProgramsListSection";
import { CTABannerSection } from "./CTABannerSection";
import ItemsShowcase from "@/components/ItemsShowcase";
import { AwardBadges } from "@/components/AwardBadges";

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <Hero key={index} data={section} />;
          case "syllabus":
            return <SyllabusSection key={index} data={section} />;
          case "projects":
            return <ProjectsSection key={index} data={section} />;
          case "ai_learning":
            return <AILearningSection key={index} data={section} />;
          case "certificate":
            return <CertificateSection key={index} data={section} />;
          case "why_learn_ai":
            return <WhyLearnAISection key={index} data={section} />;
          case "pricing":
            return <PricingSection key={index} data={section} />;
          case "faq":
            return <FAQSection key={index} data={section} />;
          case "testimonials":
            return <TestimonialsSection key={index} data={section} />;
          case "whos_hiring":
            return <WhosHiringSection key={index} data={section} />;
          case "footer_cta":
            return <FooterCTASection key={index} data={section} />;
          case "footer":
            return <FooterSection key={index} data={section} />;
          case "two_column":
            return <TwoColumn key={index} data={section} />;
          case "numbered_steps":
            return <NumberedSteps key={index} data={section} />;
          case "stats_section":
            return <StatsSection key={index} data={section} />;
          case "testimonials_slide":
            return <TestimonialsSlide key={index} data={section} />;
          case "features_grid":
            return <FeaturesGridSection key={index} data={section} />;
          case "programs_list":
            return <ProgramsListSection key={index} data={section} />;
          case "cta_banner":
            return <CTABannerSection key={index} data={section} />;
          case "items_showcase":
            return <ItemsShowcase key={index} data={section} />;
          case "award_badges":
            return <AwardBadges key={index} items={section.items} variant={section.variant} showBorder={section.showBorder} className={section.className} />;
          default: {
            if (process.env.NODE_ENV === "development") {
              console.warn(`Unknown section type: ${(section as { type: string }).type}`);
            }
            return null;
          }
        }
      })}
    </>
  );
}
