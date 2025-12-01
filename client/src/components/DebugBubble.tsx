import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  IconBug,
  IconMap,
  IconComponents,
  IconLanguage,
  IconRoute,
  IconSun,
  IconMoon,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebugAuth } from "@/hooks/useDebugAuth";

export function DebugBubble() {
  const { isValidated, hasToken, isLoading, isDevelopment } = useDebugAuth();
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // In production, don't render if not validated or still loading
  // In development, always show (but with warning if no token)
  if (isLoading) {
    return null;
  }
  
  if (!isDevelopment && !isValidated) {
    return null;
  }
  
  const showTokenWarning = isDevelopment && !hasToken;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === "es" ? "ES" : "EN";

  return (
    <div className="fixed bottom-4 left-4 z-50" data-testid="debug-bubble">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="default"
            className="h-12 w-12 rounded-full shadow-lg"
            data-testid="button-debug-toggle"
          >
            {open ? <IconX className="h-5 w-5" /> : <IconBug className="h-5 w-5" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          align="start" 
          className="w-72 p-0"
          sideOffset={8}
        >
          <div className="p-3 border-b">
            <h3 className="font-semibold text-sm">Debug Tools</h3>
            <p className="text-xs text-muted-foreground">Development utilities</p>
          </div>
          
          {showTokenWarning && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <IconAlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-200">No token detected</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Add <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">?token=xxx</code> to URL or set <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">VITE_BREATHECODE_TOKEN</code>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-2 space-y-1">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
              data-testid="link-sitemap"
            >
              <IconMap className="h-4 w-4 text-muted-foreground" />
              <span>Sitemap</span>
            </a>
            
            <a
              href="/component-showcase"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
              data-testid="link-component-showcase"
            >
              <IconComponents className="h-4 w-4 text-muted-foreground" />
              <span>Component Showcase</span>
            </a>
          </div>

          <div className="border-t p-2 space-y-1">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-3">
                <IconRoute className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Current Route</span>
              </div>
              <code className="text-xs bg-muted px-2 py-1 rounded">{location}</code>
            </div>
            
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
              data-testid="button-toggle-language"
            >
              <div className="flex items-center gap-3">
                <IconLanguage className="h-4 w-4 text-muted-foreground" />
                <span>Language</span>
              </div>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded">{currentLang}</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
              data-testid="button-toggle-theme"
            >
              <div className="flex items-center gap-3">
                {theme === "light" ? (
                  <IconSun className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <IconMoon className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Theme</span>
              </div>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded capitalize">{theme}</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
