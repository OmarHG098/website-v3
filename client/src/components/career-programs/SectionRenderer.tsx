import type { Section } from "@shared/schema";
import { HeroSection } from "./HeroSection";
import { ProgramOverviewSection } from "./ProgramOverviewSection";
import { SyllabusSection } from "./SyllabusSection";
import { AILearningSection } from "./AILearningSection";
import { MentorshipSection } from "./MentorshipSection";
import { FeaturesChecklistSection } from "./FeaturesChecklistSection";
import { CertificateSection } from "./CertificateSection";
import { FAQSection } from "./FAQSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FooterCTASection } from "./FooterCTASection";
import { FooterSection } from "./FooterSection";

interface SectionRendererProps {
  sections: Section[];
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={index} data={section} />;
          case "program_overview":
            return <ProgramOverviewSection key={index} data={section} />;
          case "syllabus":
            return <SyllabusSection key={index} data={section} />;
          case "ai_learning":
            return <AILearningSection key={index} data={section} />;
          case "mentorship":
            return <MentorshipSection key={index} data={section} />;
          case "features_checklist":
            return <FeaturesChecklistSection key={index} data={section} />;
          case "certificate":
            return <CertificateSection key={index} data={section} />;
          case "faq":
            return <FAQSection key={index} data={section} />;
          case "testimonials":
            return <TestimonialsSection key={index} data={section} />;
          case "footer_cta":
            return <FooterCTASection key={index} data={section} />;
          case "footer":
            return <FooterSection key={index} data={section} />;
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
