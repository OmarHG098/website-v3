import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { IconWorld } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pageSlugMappings, getTranslatedSlug } from '@shared/slugMappings';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

function getLocalizedPath(currentPath: string, targetLang: string): string | null {
  const fromLang = currentPath.startsWith('/es/') ? 'es' : 'en';
  
  // Handle /en/:slug or /es/:slug pattern
  const enMatch = currentPath.match(/^\/en\/(.+)$/);
  const esMatch = currentPath.match(/^\/es\/(.+)$/);
  
  if (enMatch && targetLang === 'es') {
    const slug = enMatch[1];
    // Check if this slug has a detail path (e.g., /en/career-programs/ai-engineering)
    const parts = slug.split('/');
    if (parts.length > 1) {
      const baseSlug = parts[0];
      const detailSlug = parts.slice(1).join('/');
      const translatedBase = getTranslatedSlug(baseSlug, 'en', 'es');
      return `/es/${translatedBase}/${detailSlug}`;
    }
    const translatedSlug = getTranslatedSlug(slug, 'en', 'es');
    return `/es/${translatedSlug}`;
  }
  
  if (esMatch && targetLang === 'en') {
    const slug = esMatch[1];
    // Check if this slug has a detail path
    const parts = slug.split('/');
    if (parts.length > 1) {
      const baseSlug = parts[0];
      const detailSlug = parts.slice(1).join('/');
      const translatedBase = getTranslatedSlug(baseSlug, 'es', 'en');
      return `/en/${translatedBase}/${detailSlug}`;
    }
    const translatedSlug = getTranslatedSlug(slug, 'es', 'en');
    return `/en/${translatedSlug}`;
  }
  
  return null;
}

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    
    const localizedPath = getLocalizedPath(location, lng);
    if (localizedPath) {
      setLocation(localizedPath);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          data-testid="button-language-switcher"
          aria-label={t('nav.changeLanguage')}
        >
          <IconWorld className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            data-testid={`menu-item-language-${language.code}`}
            className="cursor-pointer"
          >
            <span className="font-medium">{language.code.toUpperCase()}</span>
            <span className="ml-2">{language.name}</span>
            {currentLanguage.code === language.code && (
              <span className="ml-auto text-primary font-bold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
