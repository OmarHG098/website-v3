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
  IconLayout,
  IconRocket,
  IconBrain,
  IconUsers,
  IconChecklist,
  IconCode,
  IconCertificate,
  IconQuestionMark,
  IconChartBar,
  IconArrowRight,
  IconLayoutBottombar,
  IconArrowLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebugAuth } from "@/hooks/useDebugAuth";

const componentsList = [
  { type: "hero", label: "Hero", icon: IconRocket, description: "Main banner section" },
  { type: "program_overview", label: "Program Overview", icon: IconLayout, description: "Key program features" },
  { type: "ai_learning", label: "AI Learning", icon: IconBrain, description: "AI tools showcase" },
  { type: "mentorship", label: "Mentorship", icon: IconUsers, description: "Support options" },
  { type: "features_checklist", label: "Features Checklist", icon: IconChecklist, description: "Benefits list" },
  { type: "tech_stack", label: "Tech Stack", icon: IconCode, description: "Technologies grid" },
  { type: "certificate", label: "Certificate", icon: IconCertificate, description: "Certificate preview" },
  { type: "faq", label: "FAQ", icon: IconQuestionMark, description: "Accordion questions" },
  { type: "credibility", label: "Credibility", icon: IconChartBar, description: "Stats and logos" },
  { type: "footer_cta", label: "Footer CTA", icon: IconArrowRight, description: "Final call-to-action" },
  { type: "footer", label: "Footer", icon: IconLayoutBottombar, description: "Copyright notice" },
];

type MenuView = "main" | "components";

export function DebugBubble() {
  const { isValidated, hasToken, isLoading, isDevelopment } = useDebugAuth();
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>("main");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  // Reset menu view when popover closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setMenuView("main");
    }
  };

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
      <Popover open={open} onOpenChange={handleOpenChange}>
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
          className="w-80 p-0"
          sideOffset={8}
        >
          {menuView === "main" ? (
            <>
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
                
                <button
                  onClick={() => setMenuView("components")}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                  data-testid="button-components-menu"
                >
                  <div className="flex items-center gap-3">
                    <IconComponents className="h-4 w-4 text-muted-foreground" />
                    <span>Components</span>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              <div className="border-t p-2 space-y-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    <IconRoute className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Current Route</span>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded max-w-[120px] truncate">{location}</code>
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
            </>
          ) : (
            <>
              <div className="p-2 border-b">
                <button
                  onClick={() => setMenuView("main")}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover-elevate w-full"
                  data-testid="button-back-to-main"
                >
                  <IconArrowLeft className="h-4 w-4" />
                  <span>Back to main</span>
                </button>
              </div>
              
              <div className="px-3 py-2 border-b">
                <h3 className="font-semibold text-sm">Components</h3>
                <p className="text-xs text-muted-foreground">Select a component to view in showcase</p>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  {componentsList.map((component) => {
                    const Icon = component.icon;
                    return (
                      <a
                        key={component.type}
                        href={`/component-showcase?focus=${component.type}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
                        data-testid={`link-component-${component.type}`}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{component.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{component.description}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
