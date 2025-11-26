import type { Section } from "@shared/schema";
import { HeroSection } from "./HeroSection";
import { ProgramOverviewSection } from "./ProgramOverviewSection";
import { AILearningSection } from "./AILearningSection";
import { MentorshipSection } from "./MentorshipSection";
import { FeaturesChecklistSection } from "./FeaturesChecklistSection";
import { TechStackSection } from "./TechStackSection";
import { CertificateSection } from "./CertificateSection";
import { FAQSection } from "./FAQSection";
import { CredibilitySection } from "./CredibilitySection";
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
          case "ai_learning":
            return <AILearningSection key={index} data={section} />;
          case "mentorship":
            return <MentorshipSection key={index} data={section} />;
          case "features_checklist":
            return <FeaturesChecklistSection key={index} data={section} />;
          case "tech_stack":
            return <TechStackSection key={index} data={section} />;
          case "certificate":
            return <CertificateSection key={index} data={section} />;
          case "faq":
            return <FAQSection key={index} data={section} />;
          case "credibility":
            return <CredibilitySection key={index} data={section} />;
          case "footer_cta":
            return <FooterCTASection key={index} data={section} />;
          case "footer":
            return <FooterSection key={index} data={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
