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
import { FooterSection } from "./FooterSection";
import { TwoColumn } from "@/components/TwoColumn";
import NumberedSteps from "@/components/NumberedSteps";
import TestimonialsSlide from "@/components/TestimonialsSlide";
import { FeaturesGrid } from "@/components/features-grid/FeaturesGrid";
import { ProgramsListSection } from "./ProgramsListSection";
import { CTABannerSection } from "./CTABannerSection";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { About } from "@/components/About";
import { ComparisonTable } from "@/components/ComparisonTable";
import StatsSection from "@/components/StatsSection";
import { HorizontalBars } from "@/components/HorizontalBars";
import { VerticalBarsCards } from "@/components/VerticalBarsCards";
import { PieCharts } from "@/components/PieCharts";
import { EditableSection } from "@/components/editing/EditableSection";
import { AddSectionButton } from "@/components/editing/AddSectionButton";

interface SectionRendererProps {
  sections: Section[];
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  onSectionAdded?: () => void;
}

interface EditableSectionWrapperProps {
  section: Section;
  index: number;
  sectionType: string;
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  children: React.ReactNode;
}

function renderSection(section: Section, index: number): React.ReactNode {
  const sectionType = (section as { type: string }).type;
  
  switch (sectionType) {
    case "hero":
      return <Hero key={index} data={section as Parameters<typeof Hero>[0]["data"]} />;
    case "syllabus":
      return <SyllabusSection key={index} data={section as Parameters<typeof SyllabusSection>[0]["data"]} />;
    case "projects":
      return <ProjectsSection key={index} data={section as Parameters<typeof ProjectsSection>[0]["data"]} />;
    case "ai_learning":
      return <AILearningSection key={index} data={section as Parameters<typeof AILearningSection>[0]["data"]} />;
    case "certificate":
      return <CertificateSection key={index} data={section as Parameters<typeof CertificateSection>[0]["data"]} />;
    case "why_learn_ai":
      return <WhyLearnAISection key={index} data={section as Parameters<typeof WhyLearnAISection>[0]["data"]} />;
    case "pricing":
      return <PricingSection key={index} data={section as Parameters<typeof PricingSection>[0]["data"]} />;
    case "faq":
      return <FAQSection key={index} data={section as Parameters<typeof FAQSection>[0]["data"]} />;
    case "testimonials":
      return <TestimonialsSection key={index} data={section as Parameters<typeof TestimonialsSection>[0]["data"]} />;
    case "whos_hiring":
      return <WhosHiringSection key={index} data={section as Parameters<typeof WhosHiringSection>[0]["data"]} />;
    case "footer":
      return <FooterSection key={index} data={section as Parameters<typeof FooterSection>[0]["data"]} />;
    case "two_column":
      return <TwoColumn key={index} data={section as Parameters<typeof TwoColumn>[0]["data"]} />;
    case "numbered_steps":
      return <NumberedSteps key={index} data={section as Parameters<typeof NumberedSteps>[0]["data"]} />;
    case "testimonials_slide":
      return <TestimonialsSlide key={index} data={section as Parameters<typeof TestimonialsSlide>[0]["data"]} />;
    case "features_grid":
      return <FeaturesGrid key={index} data={section as Parameters<typeof FeaturesGrid>[0]["data"]} />;
    case "programs_list":
      return <ProgramsListSection key={index} data={section as Parameters<typeof ProgramsListSection>[0]["data"]} />;
    case "cta_banner":
      return <CTABannerSection key={index} data={section as Parameters<typeof CTABannerSection>[0]["data"]} />;
    case "project_showcase":
    case "projects_showcase":
      return <ProjectShowcase key={index} data={section as Parameters<typeof ProjectShowcase>[0]["data"]} />;
    case "about":
      return <About key={index} data={section as Parameters<typeof About>[0]["data"]} />;
    case "comparison_table":
      return <ComparisonTable key={index} data={section as Parameters<typeof ComparisonTable>[0]["data"]} />;
    case "stats":
      return <StatsSection key={index} data={section as Parameters<typeof StatsSection>[0]["data"]} />;
    case "horizontal_bars":
      return <HorizontalBars key={index} data={section as Parameters<typeof HorizontalBars>[0]["data"]} />;
    case "vertical_bars_cards":
      return <VerticalBarsCards key={index} data={section as Parameters<typeof VerticalBarsCards>[0]["data"]} />;
    case "pie_charts":
      return <PieCharts key={index} data={section as Parameters<typeof PieCharts>[0]["data"]} />;
    default: {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Unknown section type: ${sectionType}`);
      }
      return null;
    }
  }
}

export function SectionRenderer({ sections, contentType, slug, locale, onSectionAdded }: SectionRendererProps) {
  return (
    <>
      <AddSectionButton
        insertIndex={0}
        contentType={contentType}
        slug={slug}
        locale={locale}
        onSectionAdded={onSectionAdded}
      />
      {sections.map((section, index) => {
        const sectionType = (section as { type: string }).type;
        const renderedSection = renderSection(section, index);
        
        if (!renderedSection) return null;
        
        return (
          <div key={index}>
            <EditableSection
              section={section}
              index={index}
              sectionType={sectionType}
              contentType={contentType}
              slug={slug}
              locale={locale}
            >
              {renderedSection}
            </EditableSection>
            <AddSectionButton
              insertIndex={index + 1}
              contentType={contentType}
              slug={slug}
              locale={locale}
              onSectionAdded={onSectionAdded}
            />
          </div>
        );
      })}
    </>
  );
}
