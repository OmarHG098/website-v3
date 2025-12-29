import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { LocationPage } from "@shared/schema";
import { IconLoader2 } from "@tabler/icons-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useSchemaOrg } from "@/hooks/useSchemaOrg";
import { useContentAutoRefresh } from "@/hooks/useContentAutoRefresh";
import Header from "@/components/Header";

export default function LocationDetail() {
  const { i18n } = useTranslation();
  
  const [matchEn, paramsEn] = useRoute("/en/location/:slug");
  const [matchEs, paramsEs] = useRoute("/es/ubicacion/:slug");
  
  const locale = matchEn ? "en" : matchEs ? "es" : i18n.language;
  const slug = matchEn ? paramsEn?.slug : matchEs ? paramsEs?.slug : undefined;
  const hasValidRoute = matchEn || matchEs;

  const { data: location, isLoading, error, refetch } = useQuery<LocationPage>({
    queryKey: ["/api/locations", slug, locale],
    queryFn: async () => {
      const response = await fetch(`/api/locations/${slug}?locale=${locale}`);
      if (!response.ok) {
        throw new Error("Location not found");
      }
      return response.json();
    },
    enabled: !!slug && hasValidRoute,
  });

  usePageMeta(location?.meta);
  useSchemaOrg(location?.schema);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  useContentAutoRefresh("location", slug, locale, handleRefetch);

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        data-testid="loading-location"
      >
        <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !location) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        data-testid="error-location"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {locale === "es" ? "Ubicación no encontrada" : "Location not found"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "es" 
              ? "La ubicación que buscas no existe." 
              : "The location you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-location">
      <Header />
      <SectionRenderer 
        sections={location.sections} 
        contentType="location"
        slug={slug}
        locale={locale}
      />
    </div>
  );
}
