import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import { useSession } from "@/contexts/SessionContext";
import {
  IconBug,
  IconMap,
  IconMapPin,
  IconPencil,
  IconPencilOff,
  IconComponents,
  IconLanguage,
  IconRoute,
  IconSun,
  IconMoon,
  IconX,
  IconAlertTriangle,
  IconLayoutColumns,
  IconRocket,
  IconBrain,
  IconUsers,
  IconCertificate,
  IconQuestionMark,
  IconArrowRight,
  IconLayoutBottombar,
  IconArrowLeft,
  IconChevronRight,
  IconChevronDown,
  IconRefresh,
  IconCheck,
  IconSearch,
  IconExternalLink,
  IconMessage,
  IconBuildingSkyscraper,
  IconCreditCard,
  IconFolderCode,
  IconFolder,
  IconBook,
  IconSparkles,
  IconChartBar,
  IconTable,
  IconFlask,
  IconPlus,
  IconDatabase,
  IconPhoto,
  IconCopy,
} from "@tabler/icons-react";
import { US, ES, PT, FR, DE, IT } from "country-flag-icons/react/3x2";

const LocaleFlag = ({ locale, className = "w-4 h-3" }: { locale: string; className?: string }) => {
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
};
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebugAuth, getDebugToken } from "@/hooks/useDebugAuth";
import { locations } from "@/lib/locations";

const componentsList = [
  { type: "hero", label: "Hero", icon: IconRocket, description: "Main banner section" },
  { type: "two_column", label: "Two Column", icon: IconLayoutColumns, description: "Flexible two-column layout" },
  { type: "comparison_table", label: "Comparison Table", icon: IconTable, description: "Feature comparison with competitors" },
  { type: "features_grid", label: "Features Grid", icon: IconLayoutColumns, description: "Grid of cards - highlight (stats) or detailed variants" },
  { type: "numbered_steps", label: "Numbered Steps", icon: IconArrowRight, description: "Vertical timeline with numbered steps" },
  { type: "ai_learning", label: "AI Learning", icon: IconBrain, description: "AI tools showcase" },
  { type: "mentorship", label: "Mentorship", icon: IconUsers, description: "Support options" },
  { type: "pricing", label: "Pricing", icon: IconCreditCard, description: "Subscription pricing card" },
  { type: "projects", label: "Projects", icon: IconFolderCode, description: "Real-world project carousel" },
  { type: "project_showcase", label: "Project Showcase", icon: IconChartBar, description: "Graduate project with creators" },
  { type: "syllabus", label: "Syllabus", icon: IconBook, description: "Expandable curriculum modules" },
  { type: "why_learn_ai", label: "Why Learn AI", icon: IconSparkles, description: "AI motivation section" },
  { type: "certificate", label: "Certificate", icon: IconCertificate, description: "Certificate preview" },
  { type: "whos_hiring", label: "Who's Hiring", icon: IconBuildingSkyscraper, description: "Logo carousel of hiring companies" },
  { type: "testimonials", label: "Testimonials", icon: IconMessage, description: "Student reviews and success stories" },
  { type: "testimonials_slide", label: "Testimonials Slide", icon: IconMessage, description: "Sliding marquee testimonials with photos" },
  { type: "faq", label: "FAQ", icon: IconQuestionMark, description: "Accordion questions" },
  { type: "cta_banner", label: "CTA Banner", icon: IconArrowRight, description: "Call-to-action section" },
  { type: "footer", label: "Footer", icon: IconLayoutBottombar, description: "Copyright notice" },
  { type: "award_badges", label: "Award Badges", icon: IconCertificate, description: "Award logos with mobile carousel" },
];

type MenuView = "main" | "components" | "sitemap" | "experiments";

const STORAGE_KEY = "debug-bubble-menu-view";

interface SitemapUrl {
  loc: string;
  label: string;
}

interface RedirectItem {
  from: string;
  to: string;
  type: string;
}

interface ExperimentVariant {
  slug: string;
  version: number;
  allocation: number;
}

interface ExperimentConfig {
  slug: string;
  status: "planned" | "active" | "paused" | "winner" | "archived";
  description?: string;
  variants: ExperimentVariant[];
  targeting?: Record<string, unknown>;
  max_visitors?: number;
  stats?: Record<string, number>;
}

interface ExperimentsResponse {
  experiments: ExperimentConfig[];
  hasExperimentsFile: boolean;
  filePath: string;
}

interface ContentInfo {
  type: "programs" | "pages" | "landings" | "locations" | null;
  slug: string | null;
  label: string;
}

interface VariantInfo {
  filename: string;
  name: string;
  variantSlug: string;
  version: number | null;
  locale: string;
  displayName: string;
  isPromoted: boolean;
}

interface VariantsResponse {
  variants: VariantInfo[];
  contentType: string;
  slug: string;
  folderPath: string;
}

// De-slugify a string (e.g., "hero-messaging-test" -> "Hero Messaging Test")
function deslugify(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Detect content type and slug from URL path
function detectContentInfo(pathname: string): ContentInfo {
  // Private experiment editor: /private/:contentType/:contentSlug/experiment/:experimentSlug
  const experimentMatch = pathname.match(/^\/private\/(programs|pages|landings|locations)\/([^/]+)\/experiment\/[^/]+\/?$/);
  if (experimentMatch) {
    const typeLabels: Record<string, string> = {
      programs: "Program",
      pages: "Page",
      landings: "Landing",
      locations: "Location",
    };
    return { 
      type: experimentMatch[1] as ContentInfo["type"], 
      slug: experimentMatch[2], 
      label: typeLabels[experimentMatch[1]] || "Content" 
    };
  }

  // Programs: /en/career-programs/:slug or /es/programas-de-carrera/:slug
  const programEnMatch = pathname.match(/^\/en\/career-programs\/([^/]+)\/?$/);
  if (programEnMatch) {
    return { type: "programs", slug: programEnMatch[1], label: "Program" };
  }
  const programEsMatch = pathname.match(/^\/es\/programas-de-carrera\/([^/]+)\/?$/);
  if (programEsMatch) {
    return { type: "programs", slug: programEsMatch[1], label: "Program" };
  }

  // Landings: /landing/:slug
  const landingMatch = pathname.match(/^\/landing\/([^/]+)\/?$/);
  if (landingMatch) {
    return { type: "landings", slug: landingMatch[1], label: "Landing" };
  }

  // Locations: /en/location/:slug or /es/ubicacion/:slug
  const locationEnMatch = pathname.match(/^\/en\/location\/([^/]+)\/?$/);
  if (locationEnMatch) {
    return { type: "locations", slug: locationEnMatch[1], label: "Location" };
  }
  const locationEsMatch = pathname.match(/^\/es\/ubicacion\/([^/]+)\/?$/);
  if (locationEsMatch) {
    return { type: "locations", slug: locationEsMatch[1], label: "Location" };
  }

  // Template pages: /en/:slug or /es/:slug (catch-all for pages)
  const pageEnMatch = pathname.match(/^\/en\/([^/]+)\/?$/);
  if (pageEnMatch && !["career-programs", "location"].includes(pageEnMatch[1])) {
    return { type: "pages", slug: pageEnMatch[1], label: "Page" };
  }
  const pageEsMatch = pathname.match(/^\/es\/([^/]+)\/?$/);
  if (pageEsMatch && !["programas-de-carrera", "ubicacion"].includes(pageEsMatch[1])) {
    return { type: "pages", slug: pageEsMatch[1], label: "Page" };
  }

  return { type: null, slug: null, label: "" };
}

// Get persisted menu view from sessionStorage
const getPersistedMenuView = (): MenuView => {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === "main" || stored === "components" || stored === "sitemap" || stored === "experiments") {
      return stored;
    }
  }
  return "main";
};


export function DebugBubble() {
  const { isValidated, hasToken, isLoading, isDebugMode, retryValidation, validateManualToken, clearToken } = useDebugAuth();
  const { session } = useSession();
  const editMode = useEditModeOptional();
  const { i18n } = useTranslation();
  const [pathname] = useLocation();
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
  const [redirectsList, setRedirectsList] = useState<RedirectItem[]>([]);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string>("");
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  
  // Experiments state
  const [experimentsData, setExperimentsData] = useState<ExperimentsResponse | null>(null);
  const [experimentsLoading, setExperimentsLoading] = useState(false);
  
  // Create experiment dialog state
  const [createExperimentOpen, setCreateExperimentOpen] = useState(false);
  const [variantsData, setVariantsData] = useState<VariantsResponse | null>(null);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [selectedVariantA, setSelectedVariantA] = useState<string>("");
  const [selectedVariantB, setSelectedVariantB] = useState<string>("");
  const [experimentName, setExperimentName] = useState("");
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [allocationA, setAllocationA] = useState(50);
  const [maxVisitors, setMaxVisitors] = useState(1000);
  const [newVariantTitle, setNewVariantTitle] = useState("");
  const [newVariantSlug, setNewVariantSlug] = useState("");
  
  // Targeting state
  const [targetDevices, setTargetDevices] = useState<string[]>([]);
  const [targetCountries, setTargetCountries] = useState<string[]>([]);
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [targetUtmSources, setTargetUtmSources] = useState<string[]>([]);
  const [targetUtmMediums, setTargetUtmMediums] = useState<string[]>([]);
  
  // Components search state
  const [componentsSearch, setComponentsSearch] = useState("");
  const [showComponentsSearch, setShowComponentsSearch] = useState(false);
  
  // Detect current content info from URL
  const contentInfo = useMemo(() => detectContentInfo(pathname), [pathname]);

  // Check if location is currently overridden via query string
  const currentLocationOverride = typeof window !== "undefined" 
    ? new URLSearchParams(window.location.search).get("location") 
    : null;

  // State for expanded folders in sitemap view
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Initialize menu view from sessionStorage (persisted across refreshes)
  const [menuView, setMenuViewState] = useState<MenuView>(getPersistedMenuView);

  // Wrapper to persist menu view changes to sessionStorage
  const setMenuView = (view: MenuView) => {
    setMenuViewState(view);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, view);
    }
  };

  // Auto-open experiments menu when URL contains "experiment"
  useEffect(() => {
    if (pathname.includes("experiment") && contentInfo.type && contentInfo.slug) {
      setMenuViewState("experiments");
    }
  }, [pathname, contentInfo.type, contentInfo.slug]);

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

  // Fetch redirects count on mount
  useEffect(() => {
    if (redirectsList.length === 0) {
      fetch("/api/debug/redirects")
        .then((res) => res.json())
        .then((data) => {
          setRedirectsList(data.redirects || []);
        })
        .catch(() => {});
    }
  }, []);

  // Fetch experiments when entering experiments view
  useEffect(() => {
    if (menuView === "experiments" && contentInfo.type && contentInfo.slug) {
      setExperimentsLoading(true);
      fetch(`/api/experiments/${contentInfo.type}/${contentInfo.slug}`)
        .then((res) => res.json())
        .then((data: ExperimentsResponse) => {
          setExperimentsData(data);
          setExperimentsLoading(false);
        })
        .catch(() => {
          setExperimentsLoading(false);
          setExperimentsData(null);
        });
    }
  }, [menuView, contentInfo.type, contentInfo.slug]);

  // Reset experiments data and menu view when leaving a content page
  useEffect(() => {
    if (!contentInfo.type) {
      setExperimentsData(null);
      // Reset menu view to main if currently on experiments view
      if (menuView === "experiments") {
        setMenuView("main");
      }
    }
  }, [contentInfo.type, menuView]);

  // Handle popover open/close - reset search but preserve menu view
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSitemapSearch("");
      setShowSitemapSearch(false);
      setComponentsSearch("");
      setShowComponentsSearch(false);
    }
  };

  // Handle create experiment dialog open
  const handleOpenCreateExperiment = () => {
    if (!contentInfo.type || !contentInfo.slug) return;
    
    setCreateExperimentOpen(true);
    setVariantsLoading(true);
    setSelectedVariantA("");
    setSelectedVariantB("");
    setExperimentName("");
    setWizardStep(1);
    setAllocationA(50);
    setMaxVisitors(1000);
    setNewVariantTitle("");
    setNewVariantSlug("");
    setTargetDevices([]);
    setTargetCountries([]);
    setTargetLanguages([]);
    setTargetUtmSources([]);
    setTargetUtmMediums([]);
    
    fetch(`/api/variants/${contentInfo.type}/${contentInfo.slug}`)
      .then((res) => res.json())
      .then((data: VariantsResponse) => {
        setVariantsData(data);
        setVariantsLoading(false);
      })
      .catch(() => {
        setVariantsLoading(false);
        setVariantsData(null);
      });
  };

  // Check if new variant is selected
  const isNewVariantSelected = selectedVariantB === "__new_variant__";
  
  // Determine if wizard needs step 2 (new variant creation)
  const needsStep2 = isNewVariantSelected;
  
  // Get next/prev step accounting for skipping step 2
  const getNextStep = (current: number): 1 | 2 | 3 => {
    if (current === 1) return needsStep2 ? 2 : 3;
    if (current === 2) return 3;
    return 3;
  };
  
  const getPrevStep = (current: number): 1 | 2 | 3 => {
    if (current === 3) return needsStep2 ? 2 : 1;
    if (current === 2) return 1;
    return 1;
  };
  
  // Calculate effective step number for display (renumber when skipping step 2)
  const getDisplayStep = (step: number) => {
    if (!needsStep2 && step === 3) return 2;
    return step;
  };
  
  // Total visible steps
  const totalVisibleSteps = needsStep2 ? 3 : 2;

  // Generate experiment slug from name
  const generateExperimentSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Filter components list by search
  const filteredComponentsList = componentsList.filter(
    (component) =>
      component.label.toLowerCase().includes(componentsSearch.toLowerCase()) ||
      component.description.toLowerCase().includes(componentsSearch.toLowerCase()) ||
      component.type.toLowerCase().includes(componentsSearch.toLowerCase())
  );

  // Filter sitemap URLs by search
  const filteredSitemapUrls = sitemapUrls.filter(
    (url) =>
      url.label.toLowerCase().includes(sitemapSearch.toLowerCase()) ||
      url.loc.toLowerCase().includes(sitemapSearch.toLowerCase())
  );

  // Group sitemap URLs into nested folders based on URL path structure
  interface SitemapFolder {
    name: string;
    path: string; // Full path to this folder level
    urls: SitemapUrl[]; // URLs that terminate at this folder level
    subfolders: SitemapFolder[];
  }

  const groupedSitemapUrls = (): { folders: SitemapFolder[]; rootUrls: SitemapUrl[] } => {
    const rootUrls: SitemapUrl[] = [];
    const folderMap = new Map<string, SitemapFolder>();

    filteredSitemapUrls.forEach((url) => {
      const path = new URL(url.loc).pathname;
      const segments = path.split('/').filter(Boolean);
      
      // Root level pages (e.g., "/", "/about")
      if (segments.length <= 1) {
        rootUrls.push(url);
        return;
      }

      // Build folder path from all segments except the last (the page)
      const folderSegments = segments.slice(0, -1);
      const folderPath = '/' + folderSegments.join('/');
      
      // Create or get the folder
      if (!folderMap.has(folderPath)) {
        folderMap.set(folderPath, {
          name: folderSegments.join('/'),
          path: folderPath,
          urls: [],
          subfolders: [],
        });
      }
      
      folderMap.get(folderPath)!.urls.push(url);
    });

    // Convert map to sorted array
    const folders = Array.from(folderMap.values()).sort((a, b) => 
      a.path.localeCompare(b.path)
    );

    return { folders, rootUrls };
  };

  const { folders, rootUrls } = groupedSitemapUrls();

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderName)) {
        next.delete(folderName);
      } else {
        next.add(folderName);
      }
      return next;
    });
  };

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

  const handleLocationOverride = () => {
    if (!selectedLocationSlug) return;
    const url = new URL(window.location.href);
    url.searchParams.set("location", selectedLocationSlug);
    window.location.href = url.toString();
  };

  const handleClearLocationOverride = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("location");
    window.location.href = url.toString();
  };

  // Group locations by region for display
  const locationsByRegion = locations.reduce((acc, loc) => {
    if (!acc[loc.region]) acc[loc.region] = [];
    acc[loc.region].push(loc);
    return acc;
  }, {} as Record<string, typeof locations>);

  const regionLabels: Record<string, string> = {
    "usa-canada": "USA & Canada",
    "latam": "Latin America",
    "europe": "Europe",
  };

  return (
    <div className="fixed bottom-4 left-4 z-50" data-testid="debug-bubble">
      <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Button
              size="icon"
              variant="default"
              className="h-12 w-12 rounded-full shadow-lg"
              data-testid="button-debug-toggle"
            >
              {open ? <IconX className="h-5 w-5" /> : <IconBug className="h-5 w-5" />}
            </Button>
            {editMode?.isEditMode && (
              <div 
                className="absolute -top-1 left-full ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium animate-pulse"
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  boxShadow: '0 0 12px 2px rgba(251, 191, 36, 0.6), 0 0 20px 4px rgba(251, 191, 36, 0.3)',
                }}
                data-testid="indicator-edit-mode"
              >
                <IconPencil className="h-3 w-3" />
                <span>On</span>
              </div>
            )}
          </div>
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
                    Enter your token below or add <code className="bg-muted px-1 rounded">?token=xxx</code> to URL, or{" "}
                    <a 
                      href={`https://breathecode.herokuapp.com/v1/auth/view/login?url=${encodeURIComponent(window.location.href)}`}
                      className="text-primary underline hover:no-underline"
                      data-testid="link-login"
                    >
                      click here to login
                    </a>
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
              <div className="p-3 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Dev Tools</h3>
                  <p className="text-xs text-muted-foreground">Development utilities</p>
                </div>
                {editMode && (
                  <div 
                    className="flex items-center bg-muted rounded-full p-0.5"
                    data-testid="toggle-edit-mode"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (!editMode.isEditMode) editMode.toggleEditMode();
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        editMode.isEditMode 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground"
                      }`}
                      data-testid="button-edit-mode"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (editMode.isEditMode) editMode.toggleEditMode();
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        !editMode.isEditMode 
                          ? "bg-foreground text-background shadow-sm" 
                          : "text-muted-foreground"
                      }`}
                      data-testid="button-read-mode"
                    >
                      Read
                    </button>
                  </div>
                )}
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
                
                <a
                  href="/private/redirects"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                  data-testid="link-redirects-page"
                >
                  <div className="flex items-center gap-3">
                    <IconRoute className="h-4 w-4 text-muted-foreground" />
                    <span>Redirects</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{redirectsList.length || '...'}</span>
                    <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </a>
                
                <a
                  href="/private/media-gallery"
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                  data-testid="link-media-gallery"
                >
                  <div className="flex items-center gap-3">
                    <IconPhoto className="h-4 w-4 text-muted-foreground" />
                    <span>Media</span>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </a>
                
                {/* Experiments menu item - only shown on content pages */}
                {contentInfo.type && contentInfo.slug && (
                  <button
                    onClick={() => setMenuView("experiments")}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                    data-testid="button-experiments-menu"
                  >
                    <div className="flex items-center gap-3">
                      <IconFlask className="h-4 w-4 text-muted-foreground" />
                      <span>Experiments</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{contentInfo.label}</span>
                      <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                )}
              </div>

              <div className="border-t p-2 space-y-1">
                {/* Session Group */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <IconDatabase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Session</span>
                    </div>
                    <button
                      onClick={() => setSessionModalOpen(true)}
                      className="p-1 rounded hover-elevate"
                      data-testid="button-session-view"
                      title="View session data"
                    >
                      <IconPencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  
                  <div className="pl-2 space-y-0.5">
                    <button
                      onClick={() => {
                        setSelectedLocationSlug(session.location?.slug || "");
                        setLocationModalOpen(true);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                      data-testid="button-location-override"
                    >
                      <div className="flex items-center gap-3">
                        <IconMapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Location</span>
                        {currentLocationOverride && (
                          <span className="text-xs text-muted-foreground">(override)</span>
                        )}
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded max-w-[100px] truncate">
                        {session.location?.name || 'Detecting...'}
                      </code>
                    </button>
                    
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
                  </div>
                </div>
                
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
                <div className="flex items-center justify-between">
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
                      <p className="text-xs text-muted-foreground">{componentsList.length} components</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowComponentsSearch(!showComponentsSearch)}
                    className={`p-1.5 rounded hover-elevate ${showComponentsSearch ? 'bg-muted' : ''}`}
                    title="Toggle search"
                    data-testid="button-toggle-components-search"
                  >
                    <IconSearch className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              {showComponentsSearch && (
                <div className="p-2 border-b">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search components..."
                      value={componentsSearch}
                      onChange={(e) => setComponentsSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                      data-testid="input-components-search"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              
              <ScrollArea className={showComponentsSearch ? "h-[240px]" : "h-[280px]"}>
                <div className="p-2 space-y-1">
                  {filteredComponentsList.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No components found
                    </div>
                  ) : filteredComponentsList.map((component) => {
                    const Icon = component.icon;
                    return (
                      <a
                        key={component.type}
                        href={`/private/component-showcase/${component.type}`}
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
          ) : menuView === "experiments" ? (
            <>
              <div className="px-3 py-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMenuView("main")}
                      className="p-1 rounded-md hover-elevate"
                      data-testid="button-back-to-main-experiments"
                    >
                      <IconArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h3 className="font-semibold text-sm">Experiments</h3>
                      <p className="text-xs text-muted-foreground">
                        {contentInfo.label}: {contentInfo.slug}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenCreateExperiment}
                    className="p-1.5 rounded hover-elevate"
                    title="Create new experiment"
                    data-testid="button-create-experiment"
                  >
                    <IconPlus className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  {experimentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : !experimentsData?.hasExperimentsFile ? (
                    <div className="text-center py-8 px-4">
                      <IconFlask className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">No experiments file found</p>
                      <p className="text-xs text-muted-foreground">
                        Create <code className="bg-muted px-1 rounded">marketing-content/{contentInfo.type}s/{contentInfo.slug}/experiments.yml</code>
                      </p>
                    </div>
                  ) : experimentsData.experiments.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <IconFlask className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No experiments defined</p>
                    </div>
                  ) : (
                    experimentsData.experiments.map((experiment) => {
                      const statusColors: Record<string, string> = {
                        planned: "bg-muted text-muted-foreground",
                        active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                        paused: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                        winner: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                        archived: "bg-muted text-muted-foreground opacity-60",
                      };
                      const totalExposures = Object.values(experiment.stats || {}).reduce((a, b) => a + b, 0);
                      
                      return (
                        <Link
                          key={experiment.slug}
                          href={`/private/${contentInfo.type}/${contentInfo.slug}/experiment/${experiment.slug}`}
                          className="flex flex-col w-full px-3 py-2.5 rounded-md text-sm hover-elevate cursor-pointer text-left"
                          data-testid={`button-experiment-${experiment.slug}`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-medium">{deslugify(experiment.slug)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[experiment.status]}`}>
                              {experiment.status}
                            </span>
                          </div>
                          {experiment.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                              {experiment.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{experiment.variants.length} variants</span>
                            {totalExposures > 0 && (
                              <span>{totalExposures} exposures</span>
                            )}
                            {experiment.max_visitors && (
                              <span>max {experiment.max_visitors}</span>
                            )}
                          </div>
                        </Link>
                      );
                    })
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
                    <>
                      {folders.map((folder) => (
                        <div key={folder.name} className="mb-1">
                          <button
                            onClick={() => toggleFolder(folder.name)}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
                            data-testid={`button-folder-${folder.name.toLowerCase()}`}
                          >
                            {expandedFolders.has(folder.name) ? (
                              <IconChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <IconChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <IconFolder className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-medium">{folder.name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {folder.urls.length}
                            </span>
                          </button>
                          {expandedFolders.has(folder.name) && (
                            <div className="ml-4 border-l pl-2 space-y-1 mt-1">
                              {folder.urls.map((url, urlIndex) => {
                                const path = new URL(url.loc).pathname;
                                return (
                                  <a
                                    key={`${folder.name}-${urlIndex}-${url.loc}`}
                                    href={path}
                                    className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm hover-elevate cursor-pointer"
                                    data-testid={`link-sitemap-url-${url.label.toLowerCase().replace(/\s+/g, '-')}`}
                                  >
                                    <IconMap className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm">{url.label}</div>
                                      <div className="text-xs text-muted-foreground truncate">{path}</div>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                      {rootUrls.map((url, urlIndex) => {
                        const path = new URL(url.loc).pathname;
                        return (
                          <a
                            key={`root-${urlIndex}-${url.loc}`}
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
                      })}
                    </>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </PopoverContent>
      </Popover>
      <Dialog open={locationModalOpen} onOpenChange={setLocationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Override Session Location</DialogTitle>
            <DialogDescription>
              You can override the auto-detected location by adding a <code className="text-xs bg-muted px-1 py-0.5 rounded">?location=slug</code> query parameter to any URL. This is useful for testing location-specific content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select new Location</label>
              <Select value={selectedLocationSlug} onValueChange={setSelectedLocationSlug}>
                <SelectTrigger data-testid="select-location-override">
                  <SelectValue placeholder="Choose a location..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(locationsByRegion).map(([region, locs]) => (
                    <div key={region}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {regionLabels[region] || region}
                      </div>
                      {locs.map((loc) => (
                        <SelectItem key={loc.slug} value={loc.slug}>
                          {loc.name}, {loc.country}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentLocationOverride && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Currently overriding:</span>
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{currentLocationOverride}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLocationOverride}
                  className="h-6 px-2 text-xs"
                  data-testid="button-clear-location-override"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setLocationModalOpen(false)}
              data-testid="button-cancel-location-override"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLocationOverride}
              disabled={!selectedLocationSlug}
              data-testid="button-confirm-location-override"
            >
              Override Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={sessionModalOpen} onOpenChange={setSessionModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Data</DialogTitle>
            <DialogDescription>
              Current session values captured from browser, geolocation, and URL parameters.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {hasToken && getDebugToken() && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Authentication Token</h4>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted px-2 py-1.5 rounded text-xs font-mono truncate" data-testid="text-session-token">
                    {getDebugToken()}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => {
                      const token = getDebugToken();
                      if (token) {
                        navigator.clipboard.writeText(token);
                        setTokenCopied(true);
                        setTimeout(() => setTokenCopied(false), 2000);
                      }
                    }}
                    data-testid="button-copy-token"
                  >
                    {tokenCopied ? (
                      <IconCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <IconCopy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            <div className={`space-y-3 ${hasToken && getDebugToken() ? 'border-t pt-3' : ''}`}>
              <h4 className="text-sm font-semibold text-foreground">Geolocation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.geo?.country || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.geo?.city || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.geo?.region || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.geo?.timezone || 'N/A'}</code>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">UTM Parameters</h4>
              <div className="space-y-1.5 text-sm">
                {(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_placement', 'utm_plan'] as const).map(key => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.utm?.[key] || '—'}</code>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Tracking</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PPC Tracking ID:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs max-w-[150px] truncate">{session.utm?.ppc_tracking_id || '—'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Referral:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.utm?.referral || session.utm?.ref || '—'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coupon:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.utm?.coupon || '—'}</code>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Experiment</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experiment:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.experiment?.experiment_slug || '—'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Variant:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.experiment?.variant_slug || '—'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.experiment?.variant_version ?? '—'}</code>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Session Info</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.language}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Browser Lang:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.browserLang || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location Campus:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.location?.slug || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initialized:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.initialized ? 'Yes' : 'No'}</code>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSessionModalOpen(false)}
              data-testid="button-close-session-modal"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={createExperimentOpen} onOpenChange={setCreateExperimentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Experiment</DialogTitle>
            <DialogDescription>
              {wizardStep === 1 && "Configure variants and traffic distribution"}
              {wizardStep === 2 && "Create a new variant file"}
              {wizardStep === 3 && "Set targeting rules (optional)"}
            </DialogDescription>
          </DialogHeader>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((step) => {
              const isActive = wizardStep === step;
              const isCompleted = wizardStep > step;
              const isHidden = step === 2 && !needsStep2;
              if (isHidden) return null;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <IconCheck className="h-4 w-4" /> : getDisplayStep(step)}
                  </div>
                  {step < 3 && !(step === 2 && !needsStep2) && (
                    <div className={`w-8 h-0.5 ${isCompleted ? "bg-primary/20" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="space-y-4 py-4 min-h-[280px]">
            {variantsLoading ? (
              <div className="flex items-center justify-center py-8">
                <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : !variantsData || variantsData.variants.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No variants found in this folder
              </div>
            ) : (
              <>
                {/* Step 1: Variants & Traffic */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Experiment Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Hero Messaging Test"
                        value={experimentName}
                        onChange={(e) => setExperimentName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        data-testid="input-experiment-name"
                      />
                      {experimentName && (
                        <p className="text-xs text-muted-foreground">
                          Slug: <code className="bg-muted px-1 rounded">{generateExperimentSlug(experimentName)}</code>
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Variant A (Control)</label>
                        <Select value={selectedVariantA} onValueChange={(value) => {
                          const newVariant = variantsData.variants.find(v => v.filename === value);
                          const currentB = variantsData.variants.find(v => v.filename === selectedVariantB);
                          if (currentB && newVariant && currentB.locale !== newVariant.locale) {
                            setSelectedVariantB("");
                          }
                          setSelectedVariantA(value);
                        }}>
                          <SelectTrigger data-testid="select-variant-a">
                            <SelectValue placeholder="Select control..." />
                          </SelectTrigger>
                          <SelectContent>
                            {variantsData.variants.map((variant) => (
                              <SelectItem 
                                key={variant.filename} 
                                value={variant.filename}
                                disabled={variant.filename === selectedVariantB && selectedVariantB !== "__new_variant__"}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {contentInfo.type !== 'landings' && <LocaleFlag locale={variant.locale} />}
                                  {variant.isPromoted && (
                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">base</span>
                                  )}
                                  <span className="truncate">{variant.displayName}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Variant B (Treatment)</label>
                        <Select value={selectedVariantB} onValueChange={setSelectedVariantB}>
                          <SelectTrigger data-testid="select-variant-b">
                            <SelectValue placeholder="Select treatment..." />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const selectedAVariant = variantsData.variants.find(v => v.filename === selectedVariantA);
                              const selectedLocale = selectedAVariant?.locale;
                              const isLanding = contentInfo.type === 'landings';
                              return variantsData.variants
                                .filter(variant => isLanding || !selectedLocale || variant.locale === selectedLocale)
                                .map((variant) => (
                                  <SelectItem 
                                    key={variant.filename} 
                                    value={variant.filename}
                                    disabled={variant.filename === selectedVariantA}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      {!isLanding && <LocaleFlag locale={variant.locale} />}
                                      {variant.isPromoted && (
                                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">base</span>
                                      )}
                                      <span className="truncate">{variant.displayName}</span>
                                    </div>
                                  </SelectItem>
                                ));
                            })()}
                            <div className="border-t my-1" />
                            <SelectItem value="__new_variant__">
                              <div className="flex items-center gap-2 text-primary">
                                <IconPlus className="h-4 w-4" />
                                <span>New variant</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {selectedVariantA && selectedVariantB && (
                      <>
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Traffic Split</label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <input
                                type="range"
                                min="10"
                                max="90"
                                step="5"
                                value={allocationA}
                                onChange={(e) => setAllocationA(parseInt(e.target.value))}
                                className="w-full"
                                data-testid="slider-allocation"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">A: <span className="font-medium text-foreground">{allocationA}%</span></span>
                            <span className="text-muted-foreground">B: <span className="font-medium text-foreground">{100 - allocationA}%</span></span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Traffic Goal</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="100"
                              step="100"
                              value={maxVisitors}
                              onChange={(e) => setMaxVisitors(parseInt(e.target.value) || 1000)}
                              className="w-32 px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                              data-testid="input-max-visitors"
                            />
                            <span className="text-sm text-muted-foreground">unique visitors</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {/* Step 2: New Variant Creation (only if new variant selected) */}
                {wizardStep === 2 && needsStep2 && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-muted/50 border">
                      <p className="text-sm text-muted-foreground">
                        Create a new variant file in{' '}
                        <code className="text-xs bg-background px-1 py-0.5 rounded">
                          {variantsData.folderPath}/
                        </code>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Variant Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Salary Focus Messaging"
                        value={newVariantTitle}
                        onChange={(e) => {
                          setNewVariantTitle(e.target.value);
                          setNewVariantSlug(generateExperimentSlug(e.target.value));
                        }}
                        className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        data-testid="input-new-variant-title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Variant Slug</label>
                      <input
                        type="text"
                        placeholder="e.g., salary-focus"
                        value={newVariantSlug}
                        onChange={(e) => setNewVariantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring font-mono"
                        data-testid="input-new-variant-slug"
                      />
                      {newVariantSlug && (
                        <p className="text-xs text-muted-foreground">
                          File: <code className="bg-muted px-1 rounded">
                            {newVariantSlug}.v1.{contentInfo.type === 'landings' ? '' : (variantsData.variants.find(v => v.filename === selectedVariantA)?.locale || 'en') + '.'}yml
                          </code>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 3: Targeting */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Leave empty to target all visitors, or select specific audiences.
                    </p>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Devices</label>
                      <div className="flex flex-wrap gap-2">
                        {['desktop', 'mobile', 'tablet'].map((device) => (
                          <Button
                            key={device}
                            type="button"
                            variant={targetDevices.includes(device) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setTargetDevices(prev => 
                                prev.includes(device) 
                                  ? prev.filter(d => d !== device)
                                  : [...prev, device]
                              );
                            }}
                            data-testid={`button-device-${device}`}
                          >
                            {device}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UTM Sources</label>
                      <input
                        type="text"
                        placeholder="e.g., google, facebook (comma-separated)"
                        value={targetUtmSources.join(', ')}
                        onChange={(e) => setTargetUtmSources(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        data-testid="input-utm-sources"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UTM Mediums</label>
                      <input
                        type="text"
                        placeholder="e.g., cpc, organic (comma-separated)"
                        value={targetUtmMediums.join(', ')}
                        onChange={(e) => setTargetUtmMediums(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        data-testid="input-utm-mediums"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {wizardStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setWizardStep(getPrevStep(wizardStep))}
                data-testid="button-wizard-back"
              >
                <IconArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {wizardStep === 1 && (
              <Button
                variant="outline"
                onClick={() => setCreateExperimentOpen(false)}
                data-testid="button-cancel-create-experiment"
              >
                Cancel
              </Button>
            )}
            {wizardStep !== 3 && (
              <Button
                disabled={
                  wizardStep === 1 && (!selectedVariantA || !selectedVariantB || !experimentName) ||
                  wizardStep === 2 && (!newVariantTitle || !newVariantSlug)
                }
                onClick={() => setWizardStep(getNextStep(wizardStep))}
                data-testid="button-wizard-next"
              >
                Next
                <IconArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {wizardStep === 3 && (
              <Button
                onClick={() => {
                  if (selectedVariantA && selectedVariantB && experimentName && variantsData) {
                    const variantA = variantsData.variants.find(v => v.filename === selectedVariantA);
                    const variantBData = isNewVariantSelected 
                      ? { variantSlug: newVariantSlug, version: 1 }
                      : variantsData.variants.find(v => v.filename === selectedVariantB);
                    
                    const targetingYaml = [
                      targetDevices.length > 0 ? `    devices:\n${targetDevices.map(d => `      - ${d}`).join('\n')}` : '',
                      targetUtmSources.length > 0 ? `    utm_sources:\n${targetUtmSources.map(s => `      - ${s}`).join('\n')}` : '',
                      targetUtmMediums.length > 0 ? `    utm_mediums:\n${targetUtmMediums.map(m => `      - ${m}`).join('\n')}` : '',
                    ].filter(Boolean).join('\n');
                    
                    const yaml = `- slug: ${generateExperimentSlug(experimentName)}
  status: planned
  description: "${experimentName}"
  variants:
    - slug: ${variantA?.variantSlug || 'control'}
      version: ${variantA?.version || 1}
      allocation: ${allocationA}
    - slug: ${variantBData?.variantSlug || 'treatment'}
      version: ${variantBData?.version || 1}
      allocation: ${100 - allocationA}
  max_visitors: ${maxVisitors}${targetingYaml ? `\n  targeting:\n${targetingYaml}` : ''}`;
                    navigator.clipboard.writeText(yaml);
                    setCreateExperimentOpen(false);
                  }
                }}
                data-testid="button-copy-experiment-yaml"
              >
                <IconCopy className="h-4 w-4 mr-2" />
                Copy YAML
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
