import type { CSSProperties } from "react";
import { useCallback, useMemo, lazy, Suspense } from "react";
import type { Section, EditOperation, SectionLayout } from "@shared/schema";

// ============================================
// Component Load Strategy Registry
// ============================================
// Eager: Above-the-fold, critical for first paint
// Lazy: Below-the-fold, can load after initial render

// EAGER components (imported directly)
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
// EAGER components - commonly above the fold
import { FeaturesGrid } from "@/components/features-grid/FeaturesGrid";
import { AwardBadges } from "@/components/AwardBadges";
import { AwardsMarquee } from "@/components/AwardsMarquee";
import StatsSection from "@/components/StatsSection";

// LAZY components - typically below the fold, loaded on demand
const SyllabusSection = lazy(() => import("./SyllabusSection").then(m => ({ default: m.SyllabusSection })));
const ProjectsSection = lazy(() => import("./ProjectsSection").then(m => ({ default: m.ProjectsSection })));
const AILearningSection = lazy(() => import("./AILearningSection").then(m => ({ default: m.AILearningSection })));
const CertificateSection = lazy(() => import("./CertificateSection").then(m => ({ default: m.CertificateSection })));
const WhyLearnAISection = lazy(() => import("./WhyLearnAISection").then(m => ({ default: m.WhyLearnAISection })));
const PricingSection = lazy(() => import("./PricingSection").then(m => ({ default: m.PricingSection })));
const FAQSection = lazy(() => import("./FAQSection").then(m => ({ default: m.FAQSection })));
const TestimonialsSection = lazy(() => import("./TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const WhosHiring = lazy(() => import("@/components/whos-hiring/WhosHiring").then(m => ({ default: m.WhosHiring })));
const FooterSection = lazy(() => import("./FooterSection").then(m => ({ default: m.FooterSection })));
const TwoColumn = lazy(() => import("@/components/TwoColumn").then(m => ({ default: m.TwoColumn })));
const NumberedSteps = lazy(() => import("@/components/NumberedSteps"));
const TestimonialsSlide = lazy(() => import("@/components/TestimonialsSlide"));
const ProgramsListSection = lazy(() => import("./ProgramsListSection").then(m => ({ default: m.ProgramsListSection })));
const CTABannerSection = lazy(() => import("./CTABannerSection").then(m => ({ default: m.CTABannerSection })));
const ProjectShowcase = lazy(() => import("@/components/ProjectShowcase").then(m => ({ default: m.ProjectShowcase })));
const About = lazy(() => import("@/components/About").then(m => ({ default: m.About })));
const ComparisonTable = lazy(() => import("@/components/ComparisonTable").then(m => ({ default: m.ComparisonTable })));
const AwardsRow = lazy(() => import("@/components/AwardsRow"));
const HorizontalBars = lazy(() => import("@/components/HorizontalBars").then(m => ({ default: m.HorizontalBars })));
const VerticalBarsCards = lazy(() => import("@/components/VerticalBarsCards").then(m => ({ default: m.VerticalBarsCards })));
const PieCharts = lazy(() => import("@/components/PieCharts").then(m => ({ default: m.PieCharts })));
const LeadForm = lazy(() => import("@/components/LeadForm").then(m => ({ default: m.LeadForm })));
const ApplyFormSection = lazy(() => import("@/components/ApplyFormSection").then(m => ({ default: m.ApplyFormSection })));
const HumanAndAIDuo = lazy(() => import("@/components/HumanAndAIDuo").then(m => ({ default: m.HumanAndAIDuo })));
const CommunitySupport = lazy(() => import("@/components/CommunitySupport").then(m => ({ default: m.CommunitySupport })));
const TwoColumnAccordionCard = lazy(() => import("@/components/TwoColumnAccordionCard").then(m => ({ default: m.TwoColumnAccordionCard })));
const BulletTabsShowcase = lazy(() => import("@/components/BulletTabsShowcase").then(m => ({ default: m.BulletTabsShowcase })));
const GraduatesStats = lazy(() => import("@/components/graduates_stats").then(m => ({ default: m.GraduatesStats })));

import { EditableSection } from "@/components/editing/EditableSection";
import { AddSectionButton } from "@/components/editing/AddSectionButton";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { emitContentUpdated } from "@/lib/contentEvents";

// Loading fallback for lazy sections
function SectionSkeleton() {
  return (
    <div className="w-full py-16 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
        <div className="h-4 w-80 bg-muted rounded" />
      </div>
    </div>
  );
}

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

// Wrapper for lazy-loaded sections
function LazySection({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<SectionSkeleton />}>{children}</Suspense>;
}

export function renderSection(section: Section, index: number): React.ReactNode {
  const sectionType = (section as { type: string }).type;
  
  switch (sectionType) {
    // EAGER components - no Suspense needed
    case "hero":
      return <Hero key={index} data={section as Parameters<typeof Hero>[0]["data"]} />;
    case "features_grid":
      return <FeaturesGrid key={index} data={section as Parameters<typeof FeaturesGrid>[0]["data"]} />;
    case "stats":
      return <StatsSection key={index} data={section as Parameters<typeof StatsSection>[0]["data"]} />;
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
    
    // LAZY components - wrapped in Suspense
    case "syllabus":
      return <LazySection key={index}><SyllabusSection data={section as Parameters<typeof SyllabusSection>[0]["data"]} /></LazySection>;
    case "projects":
      return <LazySection key={index}><ProjectsSection data={section as Parameters<typeof ProjectsSection>[0]["data"]} /></LazySection>;
    case "ai_learning":
      return <LazySection key={index}><AILearningSection data={section as Parameters<typeof AILearningSection>[0]["data"]} /></LazySection>;
    case "certificate":
      return <LazySection key={index}><CertificateSection data={section as Parameters<typeof CertificateSection>[0]["data"]} /></LazySection>;
    case "why_learn_ai":
      return <LazySection key={index}><WhyLearnAISection data={section as Parameters<typeof WhyLearnAISection>[0]["data"]} /></LazySection>;
    case "pricing":
      return <LazySection key={index}><PricingSection data={section as Parameters<typeof PricingSection>[0]["data"]} /></LazySection>;
    case "faq":
      return <LazySection key={index}><FAQSection data={section as Parameters<typeof FAQSection>[0]["data"]} /></LazySection>;
    case "testimonials":
      return <LazySection key={index}><TestimonialsSection data={section as Parameters<typeof TestimonialsSection>[0]["data"]} /></LazySection>;
    case "whos_hiring":
      return <LazySection key={index}><WhosHiring data={section as Parameters<typeof WhosHiring>[0]["data"]} /></LazySection>;
    case "footer":
      return <LazySection key={index}><FooterSection data={section as Parameters<typeof FooterSection>[0]["data"]} /></LazySection>;
    case "two_column":
      return <LazySection key={index}><TwoColumn data={section as Parameters<typeof TwoColumn>[0]["data"]} /></LazySection>;
    case "human_and_ai_duo":
      return <LazySection key={index}><HumanAndAIDuo data={section as Parameters<typeof HumanAndAIDuo>[0]["data"]} /></LazySection>;
    case "community_support":
      return <LazySection key={index}><CommunitySupport data={section as Parameters<typeof CommunitySupport>[0]["data"]} /></LazySection>;
    case "numbered_steps":
      return <LazySection key={index}><NumberedSteps data={section as Parameters<typeof NumberedSteps>[0]["data"]} /></LazySection>;
    case "testimonials_slide":
      return <LazySection key={index}><TestimonialsSlide data={section as Parameters<typeof TestimonialsSlide>[0]["data"]} /></LazySection>;
    case "programs_list":
      return <LazySection key={index}><ProgramsListSection data={section as Parameters<typeof ProgramsListSection>[0]["data"]} /></LazySection>;
    case "cta_banner":
      return <LazySection key={index}><CTABannerSection data={section as Parameters<typeof CTABannerSection>[0]["data"]} /></LazySection>;
    case "project_showcase":
    case "projects_showcase":
      return <LazySection key={index}><ProjectShowcase data={section as Parameters<typeof ProjectShowcase>[0]["data"]} /></LazySection>;
    case "about":
      return <LazySection key={index}><About data={section as Parameters<typeof About>[0]["data"]} /></LazySection>;
    case "comparison_table":
      return <LazySection key={index}><ComparisonTable data={section as Parameters<typeof ComparisonTable>[0]["data"]} /></LazySection>;
    case "awards_row":
      return <LazySection key={index}><AwardsRow data={section as Parameters<typeof AwardsRow>[0]["data"]} /></LazySection>;
    case "horizontal_bars":
      return <LazySection key={index}><HorizontalBars data={section as Parameters<typeof HorizontalBars>[0]["data"]} /></LazySection>;
    case "vertical_bars_cards":
      return <LazySection key={index}><VerticalBarsCards data={section as Parameters<typeof VerticalBarsCards>[0]["data"]} /></LazySection>;
    case "pie_charts":
      return <LazySection key={index}><PieCharts data={section as Parameters<typeof PieCharts>[0]["data"]} /></LazySection>;
    case "lead_form":
      return <LazySection key={index}><LeadForm data={section as Parameters<typeof LeadForm>[0]["data"]} /></LazySection>;
    case "two_column_accordion_card":
      return <LazySection key={index}><TwoColumnAccordionCard data={section as Parameters<typeof TwoColumnAccordionCard>[0]["data"]} /></LazySection>;
    case "bullet_tabs_showcase":
      return <LazySection key={index}><BulletTabsShowcase data={section as Parameters<typeof BulletTabsShowcase>[0]["data"]} /></LazySection>;
    case "graduates_stats":
      return <LazySection key={index}><GraduatesStats data={section as Parameters<typeof GraduatesStats>[0]["data"]} /></LazySection>;
    case "apply_form":
      return <LazySection key={index}><ApplyFormSection data={section as Parameters<typeof ApplyFormSection>[0]["data"]} /></LazySection>;
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
