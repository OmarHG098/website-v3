import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { SectionRenderer } from "@/components/career-programs/SectionRenderer";
import type { CareerProgram } from "@shared/schema";
import { IconLoader2 } from "@tabler/icons-react";

export default function CareerProgramDetail() {
  const { i18n } = useTranslation();
  
  const [matchEn, paramsEn] = useRoute("/us/career-programs/:slug");
  const [matchEs, paramsEs] = useRoute("/es/programas-de-carrera/:slug");
  
  const isEnglish = matchEn;
  const slug = isEnglish ? paramsEn?.slug : paramsEs?.slug;
  const locale = isEnglish ? "en" : "es";

  const { data: program, isLoading, error } = useQuery<CareerProgram>({
    queryKey: ["/api/career-programs", slug, locale],
    queryFn: async () => {
      const response = await fetch(`/api/career-programs/${slug}?locale=${locale}`);
      if (!response.ok) {
        throw new Error("Program not found");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-program"
      >
        <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        data-testid="error-program"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {locale === "es" ? "Programa no encontrado" : "Program not found"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "es" 
              ? "El programa que buscas no existe." 
              : "The program you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-career-program">
      <SectionRenderer sections={program.sections} />
    </div>
  );
}
