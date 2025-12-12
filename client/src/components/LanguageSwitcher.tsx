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

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

const routeMappings = [
  { en: '/en/career-programs/', es: '/es/programas-de-carrera/' },
];

function getLocalizedPath(currentPath: string, targetLang: string): string | null {
  for (const mapping of routeMappings) {
    if (targetLang === 'es' && currentPath.startsWith(mapping.en)) {
      const slug = currentPath.slice(mapping.en.length);
      return mapping.es + slug;
    }
    if (targetLang === 'en' && currentPath.startsWith(mapping.es)) {
      const slug = currentPath.slice(mapping.es.length);
      return mapping.en + slug;
    }
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
