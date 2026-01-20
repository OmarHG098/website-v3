export type SupportedLocale = "en" | "es";

export function normalizeLocale(locale: string | undefined | null): SupportedLocale {
  if (!locale) return "en";
  
  const normalized = locale.toLowerCase().split("-")[0].split("_")[0];
  
  if (normalized === "es") return "es";
  return "en";
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return locale === "en" || locale === "es";
}
