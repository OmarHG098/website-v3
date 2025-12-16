import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { SectionRenderer, renderSection } from "@/components/SectionRenderer";
import { ApplyFormSection } from "@/components/ApplyFormSection";
import { FooterSection } from "@/components/FooterSection";

interface ApplyPageData {
  slug: string;
  template: string;
  title: string;
  meta: {
    robots?: string;
    priority?: number;
    change_frequency?: string;
  };
  sections: Array<{
    type: string;
    version: string;
    hero?: {
      title: string;
      subtitle: string;
      note?: string;
    };
    form?: Record<string, string>;
    next_steps?: {
      title: string;
      items: Array<{ title: string; description: string }>;
      closing: string;
    };
    copyright_text?: string;
  }>;
  programs: Array<{ id: string; name_en: string; name_es: string }>;
  locations: Array<{ id: string; name_en: string; name_es: string }>;
}

export default function ApplyPage() {
  const { i18n } = useTranslation();
  const locale = i18n.language === "es" ? "es" : "en";
  const [location] = useLocation();
  
  const searchParams = new URLSearchParams(window.location.search);
  const preselectedProgram = searchParams.get("program") || undefined;

  const { data: page, isLoading, error, refetch } = useQuery<ApplyPageData>({
    queryKey: ["/api/pages/apply", locale],
    queryFn: async () => {
      const response = await fetch(`/api/pages/apply?locale=${locale}`);
      if (!response.ok) {
        throw new Error("Apply page not found");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"
            role="status"
          />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="apply-page-error">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {locale === "es" ? "Página no encontrada" : "Page not found"}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-apply">
      <Header />
      {page.sections.map((section, index) => {
        if (section.type === "apply_form") {
          return (
            <ApplyFormSection
              key={index}
              data={section as Parameters<typeof ApplyFormSection>[0]["data"]}
              programs={page.programs}
              locations={page.locations}
              locale={locale}
              preselectedProgram={preselectedProgram}
            />
          );
        }
        if (section.type === "footer") {
          return (
            <FooterSection
              key={index}
              data={section as Parameters<typeof FooterSection>[0]["data"]}
            />
          );
        }
        return renderSection(section as Parameters<typeof renderSection>[0], index);
      })}
    </div>
  );
}
