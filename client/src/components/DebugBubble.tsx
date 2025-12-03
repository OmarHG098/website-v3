import { useState, useEffect } from "react";
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
  IconRefresh,
  IconCheck,
  IconSearch,
  IconExternalLink,
  IconWorld,
  IconMessage,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebugAuth, getDebugToken } from "@/hooks/useDebugAuth";

const componentsList = [
  { type: "hero", label: "Hero", icon: IconRocket, description: "Main banner section" },
  { type: "program_overview", label: "Program Overview", icon: IconLayout, description: "Key program features" },
  { type: "ai_learning", label: "AI Learning", icon: IconBrain, description: "AI tools showcase" },
  { type: "mentorship", label: "Mentorship", icon: IconUsers, description: "Support options" },
  { type: "features_checklist", label: "Features Checklist", icon: IconChecklist, description: "Benefits list" },
  { type: "tech_stack", label: "Tech Stack", icon: IconCode, description: "Technologies grid" },
  { type: "certificate", label: "Certificate", icon: IconCertificate, description: "Certificate preview" },
  { type: "whos_hiring", label: "Who's Hiring", icon: IconBuildingSkyscraper, description: "Logo carousel of hiring companies" },
  { type: "testimonials", label: "Testimonials", icon: IconMessage, description: "Student reviews and success stories" },
  { type: "faq", label: "FAQ", icon: IconQuestionMark, description: "Accordion questions" },
  { type: "credibility", label: "Credibility", icon: IconChartBar, description: "Stats and logos" },
  { type: "footer_cta", label: "Footer CTA", icon: IconArrowRight, description: "Final call-to-action" },
  { type: "footer", label: "Footer", icon: IconLayoutBottombar, description: "Copyright notice" },
];

type MenuView = "main" | "components" | "sitemap" | "landings" | "redirects";

const STORAGE_KEY = "debug-bubble-menu-view";

interface SitemapUrl {
  loc: string;
  label: string;
}

interface LandingItem {
  slug: string;
  title: string;
}

interface RedirectItem {
  from: string;
  to: string;
  type: string;
}

// Get persisted menu view from sessionStorage
const getPersistedMenuView = (): MenuView => {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "main" || stored === "components" || stored === "sitemap" || stored === "landings" || stored === "redirects") {
      return stored;
    }
  }
  return "main";
};

export function DebugBubble() {
  const { isValidated, hasToken, isLoading, isDebugMode, retryValidation, validateManualToken, clearToken } = useDebugAuth();
  const [location] = useLocation();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });
  const [cacheClearStatus, setCacheClearStatus] = useState<"idle" | "loading" | "success">("idle");
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([]);
  const [sitemapSearch, setSitemapSearch] = useState("");
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [showSitemapSearch, setShowSitemapSearch] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [landingsList, setLandingsList] = useState<LandingItem[]>([]);
  const [landingsLoading, setLandingsLoading] = useState(false);
  const [redirectsList, setRedirectsList] = useState<RedirectItem[]>([]);
  const [redirectsLoading, setRedirectsLoading] = useState(false);

  // Initialize menu view from sessionStorage (persisted across refreshes)
  const [menuView, setMenuViewState] = useState<MenuView>(getPersistedMenuView);

  // Wrapper to persist menu view changes to sessionStorage
  const setMenuView = (view: MenuView) => {
    setMenuViewState(view);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, view);
    }
  };

  // Fetch sitemap URLs when entering sitemap view
  useEffect(() => {
    if (menuView === "sitemap" && sitemapUrls.length === 0) {
      setSitemapLoading(true);
      fetch("/api/debug/sitemap-urls")
        .then((res) => res.json())
        .then((data) => {
          setSitemapUrls(data);
          setSitemapLoading(false);
        })
        .catch(() => setSitemapLoading(false));
    }
  }, [menuView]);

  // Fetch landings when entering landings view
  useEffect(() => {
    if (menuView === "landings" && landingsList.length === 0) {
      setLandingsLoading(true);
      const locale = i18n.language || "en";
      fetch(`/api/landings?locale=${locale}`)
        .then((res) => res.json())
        .then((data) => {
          setLandingsList(data);
          setLandingsLoading(false);
        })
        .catch(() => setLandingsLoading(false));
    }
  }, [menuView, i18n.language]);

  // Fetch redirects when entering redirects view
  useEffect(() => {
    if (menuView === "redirects" && redirectsList.length === 0) {
      setRedirectsLoading(true);
      fetch("/api/debug/redirects")
        .then((res) => res.json())
        .then((data) => {
          setRedirectsList(data.redirects || []);
          setRedirectsLoading(false);
        })
        .catch(() => setRedirectsLoading(false));
    }
  }, [menuView]);

  // Handle popover open/close - reset search but preserve menu view
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSitemapSearch("");
      setShowSitemapSearch(false);
    }
  };

  // Filter sitemap URLs by search
  const filteredSitemapUrls = sitemapUrls.filter(
    (url) =>
      url.label.toLowerCase().includes(sitemapSearch.toLowerCase()) ||
      url.loc.toLowerCase().includes(sitemapSearch.toLowerCase())
  );

  // Only show bubble if debug mode is active
  // In dev: always active
  // In production: requires ?debug=true in URL
  if (!isDebugMode) {
    return null;
  }
  
  // Wait for loading to complete
  if (isLoading) {
    return null;
  }
  
  // Token states for different warning scenarios
  const noTokenDetected = !hasToken;
  const tokenWithoutCapabilities = hasToken && isValidated === false;

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

  const clearSitemapCache = async () => {
    setCacheClearStatus("loading");
    try {
      const token = getDebugToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      const response = await fetch("/api/debug/clear-sitemap-cache", {
        method: "POST",
        headers,
      });

      if (response.ok) {
        setCacheClearStatus("success");
        setTimeout(() => setCacheClearStatus("idle"), 2000);
      } else {
        console.error("Failed to clear sitemap cache");
        setCacheClearStatus("idle");
      }
    } catch (error) {
      console.error("Error clearing sitemap cache:", error);
      setCacheClearStatus("idle");
    }
  };

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
          {/* No token detected - show only warning */}
          {noTokenDetected ? (
            <div className="p-4 pl-[8px] pr-[8px]">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900 flex-shrink-0">
                  <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">No token detected</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Enter your token below or add <code className="bg-muted px-1 rounded">?token=xxx</code> to URL
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter token..."
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tokenInput.trim()) {
                          validateManualToken(tokenInput.trim());
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      data-testid="input-token"
                    />
                    <Button
                      size="sm"
                      onClick={() => validateManualToken(tokenInput.trim())}
                      disabled={!tokenInput.trim() || isLoading}
                      data-testid="button-validate-token"
                    >
                      {isLoading ? (
                        <IconRefresh className="h-4 w-4 animate-spin" />
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : tokenWithoutCapabilities ? (
            /* Token exists but not validated - show warning with retry */
            (<div className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                  <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Limited access</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Token detected but no webmaster capabilities have been detected
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={retryValidation}
                      disabled={isLoading}
                      className="flex-1"
                      data-testid="button-retry-validation"
                    >
                      {isLoading ? (
                        <IconRefresh className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <IconRefresh className="h-4 w-4 mr-1" />
                          Retry
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearToken}
                      disabled={isLoading}
                      data-testid="button-clear-token"
                    >
                      <IconX className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>)
          ) : menuView === "main" ? (
            <>
              <div className="p-3 border-b">
                <h3 className="font-semibold text-sm">Debug Tools</h3>
                <p className="text-xs text-muted-foreground">Development utilities</p>
              </div>
              
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm">
                  <button
                    onClick={() => setMenuView("sitemap")}
                    className="flex items-center gap-3 flex-1 hover-elevate rounded-md -ml-1 pl-1 py-0.5"
                    data-testid="button-sitemap-menu"
                  >
                    <IconMap className="h-4 w-4 text-muted-foreground" />
                    <span>Sitemap</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearSitemapCache}
                      disabled={cacheClearStatus === "loading"}
                      className="p-1 rounded hover-elevate disabled:opacity-50"
                      data-testid="button-clear-sitemap-cache"
                      title="Clear sitemap cache"
                    >
                      {cacheClearStatus === "loading" ? (
                        <IconRefresh className="h-3.5 w-3.5 animate-spin" />
                      ) : cacheClearStatus === "success" ? (
                        <IconCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      ) : (
                        <IconRefresh className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => setMenuView("sitemap")}
                      className="p-0.5 rounded hover-elevate"
                      data-testid="button-sitemap-chevron"
                    >
                      <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
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
                
                <button
                  onClick={() => setMenuView("landings")}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                  data-testid="button-landings-menu"
                >
                  <div className="flex items-center gap-3">
                    <IconWorld className="h-4 w-4 text-muted-foreground" />
                    <span>Landings</span>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                
                <button
                  onClick={() => setMenuView("redirects")}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                  data-testid="button-redirects-menu"
                >
                  <div className="flex items-center gap-3">
                    <IconRoute className="h-4 w-4 text-muted-foreground" />
                    <span>Redirects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{redirectsList.length || '...'}</span>
                    <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
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
          ) : menuView === "components" ? (
            <>
              <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMenuView("main")}
                    className="p-1 rounded-md hover-elevate"
                    data-testid="button-back-to-main"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-sm">Components</h3>
                    <p className="text-xs text-muted-foreground">Select a component to view</p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  {componentsList.map((component) => {
                    const Icon = component.icon;
                    return (
                      <a
                        key={component.type}
                        href={`/component-showcase/${component.type}`}
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
          ) : menuView === "landings" ? (
            <>
              <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMenuView("main")}
                    className="p-1 rounded-md hover-elevate"
                    data-testid="button-back-to-main-landings"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-sm">Landing Pages</h3>
                    <p className="text-xs text-muted-foreground">
                      {landingsList.length} landing{landingsList.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  {landingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : landingsList.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No landings found
                    </div>
                  ) : (
                    landingsList.map((landing) => (
                      <a
                        key={landing.slug}
                        href={`/landing/${landing.slug}`}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
                        data-testid={`link-landing-${landing.slug}`}
                      >
                        <IconWorld className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{landing.title}</div>
                          <div className="text-xs text-muted-foreground truncate">/landing/{landing.slug}</div>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          ) : menuView === "redirects" ? (
            <>
              <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMenuView("main")}
                    className="p-1 rounded-md hover-elevate"
                    data-testid="button-back-to-main-redirects"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-sm">Active Redirects</h3>
                    <p className="text-xs text-muted-foreground">
                      {redirectsList.length} 301 redirect{redirectsList.length !== 1 ? 's' : ''} configured
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  {redirectsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : redirectsList.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No redirects configured
                    </div>
                  ) : (
                    redirectsList.map((redirect, index) => (
                      <div
                        key={`${redirect.from}-${index}`}
                        className="px-3 py-2 rounded-md text-sm bg-muted/50"
                        data-testid={`redirect-item-${index}`}
                      >
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded flex-1 min-w-0 truncate">{redirect.from}</code>
                          <IconArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded flex-1 min-w-0 truncate">{redirect.to}</code>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {redirect.type}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              <div className="px-3 py-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMenuView("main")}
                      className="p-1 rounded-md hover-elevate"
                      data-testid="button-back-to-main-sitemap"
                    >
                      <IconArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h3 className="font-semibold text-sm">Sitemap URLs</h3>
                      <p className="text-xs text-muted-foreground">{sitemapUrls.length} URLs indexed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowSitemapSearch(!showSitemapSearch)}
                      className={`p-1.5 rounded hover-elevate ${showSitemapSearch ? 'bg-muted' : ''}`}
                      title="Toggle search"
                      data-testid="button-toggle-sitemap-search"
                    >
                      <IconSearch className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover-elevate"
                      title="Open sitemap.xml"
                      data-testid="link-sitemap-xml"
                    >
                      <IconExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              </div>
              
              {showSitemapSearch && (
                <div className="p-2 border-b">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search URLs..."
                      value={sitemapSearch}
                      onChange={(e) => setSitemapSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      data-testid="input-sitemap-search"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              
              <ScrollArea className="h-[240px]">
                <div className="p-2 space-y-1">
                  {sitemapLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredSitemapUrls.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No URLs found
                    </div>
                  ) : (
                    filteredSitemapUrls.map((url) => {
                      const path = new URL(url.loc).pathname;
                      return (
                        <a
                          key={url.loc}
                          href={path}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
                          data-testid={`link-sitemap-url-${url.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <IconMap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{url.label}</div>
                            <div className="text-xs text-muted-foreground truncate">{path}</div>
                          </div>
                        </a>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
