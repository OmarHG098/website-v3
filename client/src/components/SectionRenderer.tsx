import type { CSSProperties } from "react";
import { useCallback, useMemo } from "react";
import type { Section, EditOperation, SectionLayout } from "@shared/schema";
import { Hero } from "@/components/hero/Hero";

// Spacing presets in pixels (top, bottom)
const SPACING_PRESETS: Record<string, { top: string; bottom: string }> = {
  none: { top: "0px", bottom: "0px" },
  sm: { top: "16px", bottom: "16px" },
  md: { top: "32px", bottom: "32px" },
  lg: { top: "64px", bottom: "64px" },
  xl: { top: "96px", bottom: "96px" },
};

// Resolve a single spacing value (preset name or custom CSS)
function resolveSpacingValue(val: string): string {
  const preset = SPACING_PRESETS[val];
  if (preset) return preset.top; // All presets have equal top/bottom
  return val; // Return as-is (custom CSS value like "20px")
}

// Parse spacing value - supports presets or custom CSS values
// Returns null if no value provided (component handles its own spacing)
function parseSpacing(value: string | undefined): { top: string; bottom: string } | null {
  if (!value) return null;
  
  // Check if it's a single preset
  if (SPACING_PRESETS[value]) {
    return SPACING_PRESETS[value];
  }
  
  // Parse two-value format (e.g., "lg xl" or "20px 32px")
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    const resolved = resolveSpacingValue(parts[0]);
    return { top: resolved, bottom: resolved };
  }
  return { 
    top: resolveSpacingValue(parts[0]), 
    bottom: resolveSpacingValue(parts[1] || parts[0]) 
  };
}

// Default spacing when YAML doesn't specify values
// Using padding: none (components apply their own internal padding)
// Using margin: lg for vertical spacing between sections
const DEFAULT_PADDING = SPACING_PRESETS.none; // Components handle their own internal padding
const DEFAULT_MARGIN = { top: "0px", bottom: "0px" }; // No margin by default (sections stack)

// Semantic background tokens mapped to CSS variables
const BACKGROUND_TOKENS: Record<string, string> = {
  background: "hsl(var(--background))",
  muted: "hsl(var(--muted))",
  card: "hsl(var(--card))",
  accent: "hsl(var(--accent))",
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  sidebar: "hsl(var(--sidebar-background))",
  destructive: "hsl(var(--destructive))",
};

// Parse background value - supports semantic tokens or custom CSS
function parseBackground(value: string | undefined): string | undefined {
  if (!value || value === "inherit" || value === "none") return undefined;
  
  // Check if it's a semantic token
  if (BACKGROUND_TOKENS[value]) {
    return BACKGROUND_TOKENS[value];
  }
  
  // Return as-is for custom values (gradients, colors, etc.)
  return value;
}

// Get section layout styles - applies spacing from YAML or defaults
// paddingY: Applied to wrapper (for sections that DON'T have internal content padding)
// marginY: Applied to wrapper (for spacing between sections)
// background: Applied to wrapper (semantic token or custom CSS)
function getSectionLayoutStyles(section: Section): CSSProperties {
  const layoutSection = section as SectionLayout;
  
  const padding = parseSpacing(layoutSection.paddingY) || DEFAULT_PADDING;
  const margin = parseSpacing(layoutSection.marginY) || DEFAULT_MARGIN;
  const background = parseBackground(layoutSection.background);
  
  return {
    paddingTop: padding.top,
    paddingBottom: padding.bottom,
    marginTop: margin.top,
    marginBottom: margin.bottom,
    ...(background ? { background } : {}),
  };
}
import { SyllabusSection } from "./SyllabusSection";
import { ProjectsSection } from "./ProjectsSection";
import { AILearningSection } from "./AILearningSection";
import { CertificateSection } from "./CertificateSection";
import { WhyLearnAISection } from "./WhyLearnAISection";
import { PricingSection } from "./PricingSection";
import { FAQSection } from "./FAQSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { WhosHiring } from "@/components/whos-hiring/WhosHiring";
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
import AwardsRow from "@/components/AwardsRow";
import { HorizontalBars } from "@/components/HorizontalBars";
import { VerticalBarsCards } from "@/components/VerticalBarsCards";
import { PieCharts } from "@/components/PieCharts";
import { LeadForm } from "@/components/LeadForm";
import { AwardBadges } from "@/components/AwardBadges";
import { AwardsMarquee } from "@/components/AwardsMarquee";
import { ApplyFormSection } from "@/components/ApplyFormSection";
import { HumanAndAIDuo } from "@/components/HumanAndAIDuo";
import { CommunitySupport } from "@/components/CommunitySupport";
import { TwoColumnAccordionCard } from "@/components/TwoColumnAccordionCard";
import { BulletTabsShowcase } from "@/components/BulletTabsShowcase";
import { GraduatesStats } from "@/components/graduates_stats";
import { EditableSection } from "@/components/editing/EditableSection";
import { AddSectionButton } from "@/components/editing/AddSectionButton";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { emitContentUpdated } from "@/lib/contentEvents";

interface SectionRendererProps {
  sections: Section[];
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
}

async function sendEditOperation(
  contentType: string,
  slug: string,
  locale: string,
  operations: EditOperation[]
): Promise<{ success: boolean; error?: string }> {
  const token = getDebugToken();
  const response = await fetch("/api/content/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify({ contentType, slug, locale, operations }),
  });
  return response.json();
}

export function renderSection(section: Section, index: number): React.ReactNode {
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
      return <WhosHiring key={index} data={section as Parameters<typeof WhosHiring>[0]["data"]} />;
    case "footer":
      return <FooterSection key={index} data={section as Parameters<typeof FooterSection>[0]["data"]} />;
    case "two_column":
      return <TwoColumn key={index} data={section as Parameters<typeof TwoColumn>[0]["data"]} />;
    case "human_and_ai_duo":
      return <HumanAndAIDuo key={index} data={section as Parameters<typeof HumanAndAIDuo>[0]["data"]} />;
    case "community_support":
      return <CommunitySupport key={index} data={section as Parameters<typeof CommunitySupport>[0]["data"]} />;
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
    case "awards_row":
      return <AwardsRow key={index} data={section as Parameters<typeof AwardsRow>[0]["data"]} />;
    case "horizontal_bars":
      return <HorizontalBars key={index} data={section as Parameters<typeof HorizontalBars>[0]["data"]} />;
    case "vertical_bars_cards":
      return <VerticalBarsCards key={index} data={section as Parameters<typeof VerticalBarsCards>[0]["data"]} />;
    case "pie_charts":
      return <PieCharts key={index} data={section as Parameters<typeof PieCharts>[0]["data"]} />;
    case "lead_form":
      return <LeadForm key={index} data={section as Parameters<typeof LeadForm>[0]["data"]} />;
    case "two_column_accordion_card":
      return <TwoColumnAccordionCard key={index} data={section as Parameters<typeof TwoColumnAccordionCard>[0]["data"]} />;
    case "bullet_tabs_showcase":
      return <BulletTabsShowcase key={index} data={section as Parameters<typeof BulletTabsShowcase>[0]["data"]} />;
    case "graduates_stats":
      return <GraduatesStats key={index} data={section as Parameters<typeof GraduatesStats>[0]["data"]} />;
    case "award_badges": {
      const badgeSection = section as unknown as { items?: unknown[]; variant?: "simple" | "detailed"; showBorder?: boolean };
      if (!Array.isArray(badgeSection.items) || badgeSection.items.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn("award_badges section missing required 'items' array");
        }
        return null;
      }
      const validItems = badgeSection.items.filter((item): item is Parameters<typeof AwardBadges>[0]["items"][number] => 
        typeof item === "object" && item !== null && "id" in item && "alt" in item
      );
      if (validItems.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn("award_badges section has no valid items (each item requires 'id' and 'alt')");
        }
        return null;
      }
      return <AwardBadges key={index} items={validItems} variant={badgeSection.variant} showBorder={badgeSection.showBorder} />;
    }
    case "awards_marquee": {
      const marqueeSection = section as unknown as { items?: unknown[]; speed?: number; gradient?: boolean; gradientWidth?: number };
      if (!Array.isArray(marqueeSection.items) || marqueeSection.items.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn("awards_marquee section missing required 'items' array");
        }
        return null;
      }
      const validItems = marqueeSection.items.filter((item): item is Parameters<typeof AwardsMarquee>[0]["items"][number] => 
        typeof item === "object" && item !== null && "id" in item && "alt" in item
      );
      if (validItems.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.warn("awards_marquee section has no valid items (each item requires 'id' and 'alt')");
        }
        return null;
      }
      return (
        <AwardsMarquee 
          key={index} 
          items={validItems} 
          speed={marqueeSection.speed}
          gradient={marqueeSection.gradient}
          gradientWidth={marqueeSection.gradientWidth}
        />
      );
    }
    case "apply_form":
      return <ApplyFormSection key={index} data={section as Parameters<typeof ApplyFormSection>[0]["data"]} />;
    default: {
      if (process.env.NODE_ENV === "development") {
        console.warn(`Unknown section type: ${sectionType}`);
      }
      return null;
    }
  }
}

export function SectionRenderer({ sections, contentType, slug, locale }: SectionRendererProps) {
  const { toast } = useToast();
  
  const handleMoveUp = useCallback(async (index: number) => {
    if (!contentType || !slug || !locale || index <= 0) return;
    
    const result = await sendEditOperation(contentType, slug, locale, [
      { action: "reorder_sections", from: index, to: index - 1 }
    ]);
    
    if (result.success) {
      toast({ title: "Section moved up" });
      emitContentUpdated({ contentType, slug, locale });
    } else {
      toast({ title: "Failed to move section", description: result.error, variant: "destructive" });
    }
  }, [contentType, slug, locale, toast]);
  
  const handleMoveDown = useCallback(async (index: number) => {
    if (!contentType || !slug || !locale || index >= sections.length - 1) return;
    
    const result = await sendEditOperation(contentType, slug, locale, [
      { action: "reorder_sections", from: index, to: index + 1 }
    ]);
    
    if (result.success) {
      toast({ title: "Section moved down" });
      emitContentUpdated({ contentType, slug, locale });
    } else {
      toast({ title: "Failed to move section", description: result.error, variant: "destructive" });
    }
  }, [contentType, slug, locale, sections.length, toast]);
  
  const handleDelete = useCallback(async (index: number) => {
    if (!contentType || !slug || !locale) return;
    
    if (!window.confirm("Are you sure you want to delete this section? This cannot be undone.")) {
      return;
    }
    
    const result = await sendEditOperation(contentType, slug, locale, [
      { action: "remove_item", path: "sections", index }
    ]);
    
    if (result.success) {
      toast({ title: "Section deleted" });
      emitContentUpdated({ contentType, slug, locale });
    } else {
      toast({ title: "Failed to delete section", description: result.error, variant: "destructive" });
    }
  }, [contentType, slug, locale, toast]);

  return (
    <>
      <AddSectionButton
        insertIndex={0}
        sections={sections}
        contentType={contentType}
        slug={slug}
        locale={locale}
      />
      {sections.map((section, index) => {
        const sectionType = (section as { type: string }).type;
        const renderedSection = renderSection(section, index);
        const layoutStyles = getSectionLayoutStyles(section);
        
        if (!renderedSection) return null;
        
        return (
          <div key={index} style={layoutStyles}>
            <EditableSection
              section={section}
              index={index}
              sectionType={sectionType}
              contentType={contentType}
              slug={slug}
              locale={locale}
              totalSections={sections.length}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDelete}
            >
              {renderedSection}
            </EditableSection>
            <AddSectionButton
              insertIndex={index + 1}
              sections={sections}
              contentType={contentType}
              slug={slug}
              locale={locale}
            />
          </div>
        );
      })}
    </>
  );
}
