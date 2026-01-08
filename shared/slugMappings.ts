export interface SlugMapping {
  en: string;
  es: string;
  folder: string;
}

export const pageSlugMappings: SlugMapping[] = [
  { en: "awards", es: "premios", folder: "awards" },
  { en: "geekforce-career-support", es: "geekforce", folder: "geekforce-career-support" },
  { en: "geekpal-support", es: "geekpal", folder: "geekpal-support" },
  { en: "geeks-vs-others", es: "geeks-vs-otros", folder: "geeks-vs-others" },
  { en: "graduates-and-projects", es: "alumnos-y-proyectos", folder: "graduates-and-projects" },
  { en: "job-guarantee", es: "trabajo-garantizado", folder: "job-guarantee" },
  { en: "outcomes", es: "resultados", folder: "outcomes" },
  { en: "apply", es: "aplica", folder: "apply" },
  { en: "career-programs", es: "programas-de-carrera", folder: "career-programs" },
];

export function getSlugForLocale(folder: string, locale: string): string {
  const mapping = pageSlugMappings.find(m => m.folder === folder);
  if (!mapping) return folder;
  return locale === "es" ? mapping.es : mapping.en;
}

export function getFolderFromSlug(slug: string, locale: string): string {
  const mapping = pageSlugMappings.find(m => 
    locale === "es" ? m.es === slug : m.en === slug
  );
  return mapping?.folder || slug;
}

export function getTranslatedSlug(currentSlug: string, fromLocale: string, toLocale: string): string {
  const folder = getFolderFromSlug(currentSlug, fromLocale);
  return getSlugForLocale(folder, toLocale);
}
