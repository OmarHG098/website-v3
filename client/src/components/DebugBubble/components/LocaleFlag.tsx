import { US, ES, PT, FR, DE, IT } from "country-flag-icons/react/3x2";

interface LocaleFlagProps {
  locale: string;
  className?: string;
}

export function LocaleFlag({ locale, className = "w-4 h-3" }: LocaleFlagProps) {
  const flags: Record<string, React.ComponentType<{ className?: string }>> = {
    en: US,
    es: ES,
    pt: PT,
    fr: FR,
    de: DE,
    it: IT,
  };
  const FlagComponent = flags[locale.toLowerCase()];
  if (!FlagComponent) return <span className="text-xs">{locale.toUpperCase()}</span>;
  return <FlagComponent className={className} />;
}
