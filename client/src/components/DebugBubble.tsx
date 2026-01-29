import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from "react";
import { subscribeToContentUpdates } from "@/lib/contentEvents";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import { useSession } from "@/contexts/SessionContext";
import { buildContentUrl, type ContentType } from "@shared/slugMappings";
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
  IconUsersGroup,
  IconBrandGithub,
  IconCloudDownload,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconDatabase,
  IconCopy,
  IconArrowUp,
  IconArrowDown,
  IconFile,
  IconTrash,
  IconDeviceFloppy,
  IconMenu2,
} from "@tabler/icons-react";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { useSyncOptional } from "@/contexts/SyncContext";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDebugAuth, getDebugToken, getDebugUserName } from "@/hooks/useDebugAuth";
import { locations } from "@/lib/locations";
import { normalizeLocale } from "@shared/locale";
import { LocaleFlag } from "@/components/DebugBubble/components/LocaleFlag";
import { useQuery } from "@tanstack/react-query";

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
  { type: "whos_hiring", label: "Who's Hiring", icon: IconBuildingSkyscraper, description: "Logo display - grid or carousel variants" },
  { type: "testimonials", label: "Testimonials", icon: IconMessage, description: "Student reviews and success stories" },
  { type: "testimonials_slide", label: "Testimonials Slide", icon: IconMessage, description: "Sliding marquee testimonials with photos" },
  { type: "faq", label: "FAQ", icon: IconQuestionMark, description: "Accordion questions" },
  { type: "cta_banner", label: "CTA Banner", icon: IconArrowRight, description: "Call-to-action section" },
  { type: "footer", label: "Footer", icon: IconLayoutBottombar, description: "Copyright notice" },
  { type: "award_badges", label: "Award Badges", icon: IconCertificate, description: "Award logos with mobile carousel" },
  { type: "horizontal_bars", label: "Horizontal Bars", icon: IconChartBar, description: "Animated horizontal bar chart" },
  { type: "vertical_bars_cards", label: "Vertical Bars Cards", icon: IconChartBar, description: "Cards with vertical bars comparing years" },
  { type: "graduates_stats", label: "Graduates Stats", icon: IconUsersGroup, description: "Image collage with statistics grid" },
];

type MenuView = "main" | "components" | "sitemap" | "experiments" | "menus";

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

interface GitHubSyncStatus {
  configured: boolean;
  syncEnabled: boolean;
  localCommit: string | null;
  remoteCommit: string | null;
  status: 'in-sync' | 'behind' | 'ahead' | 'diverged' | 'unknown' | 'not-configured' | 'invalid-credentials';
  behindBy?: number;
  aheadBy?: number;
  repoUrl?: string;
  branch?: string;
}

interface PendingChange {
  file: string;
  status: 'modified' | 'added' | 'deleted';
  source: 'local' | 'incoming' | 'conflict';
  contentType: string;
  slug: string;
  author?: string;
  date?: string;
  commitSha?: string;
}

interface ContentInfo {
  type: "programs" | "pages" | "landings" | "locations" | null;
  slug: string | null;
  label: string;
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
    if (stored === "main" || stored === "components" || stored === "sitemap" || stored === "experiments" || stored === "menus") {
      return stored;
    }
  }
  return "main";
};

interface MenuItem {
  name: string;
  file: string;
}

interface MenuData {
  navbar?: {
    items?: Array<{
      label: string;
      href: string;
      component: string;
      dropdown?: unknown;
    }>;
  };
}

function MenusView() {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  
  const { data: menusData, isLoading } = useQuery<{ menus: MenuItem[] }>({
    queryKey: ["/api/menus"],
  });
  
  const { data: menuDetailData, isFetching: isMenuLoading } = useQuery<{ name: string; data: MenuData }>({
    queryKey: ["/api/menus", expandedMenu],
    enabled: !!expandedMenu,
  });

  const menus = menusData?.menus || [];
  const menuData = menuDetailData?.data;

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <IconMenu2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-2">No menus found</p>
        <p className="text-xs text-muted-foreground">
          Add <code className="bg-muted px-1 rounded">.yml</code> files to{" "}
          <code className="bg-muted px-1 rounded">marketing-content/menus/</code>
        </p>
      </div>
    );
  }

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.name} className="mb-1">
          <button
            onClick={() => toggleMenu(menu.name)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm hover-elevate cursor-pointer"
            data-testid={`button-menu-${menu.name}`}
          >
            {isMenuLoading && expandedMenu === menu.name ? (
              <IconRefresh className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
            ) : expandedMenu === menu.name ? (
              <IconChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <IconChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <IconMenu2 className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">{menu.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">{menu.file}</span>
          </button>

          {expandedMenu === menu.name && menuData && (
            <div className="ml-4 border-l pl-2 space-y-1 mt-1">
              {menuData?.navbar?.items?.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-muted-foreground hover-elevate cursor-pointer"
                  data-testid={`link-menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-60">{item.component}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// Edit Mode Toggle Component - uses optional hook to handle being outside provider
function EditModeToggle() {
  const editMode = useEditModeOptional();
  
  // If not within EditModeProvider, don't render
  if (!editMode) {
    return null;
  }
  
  const { isEditMode, toggleEditMode } = editMode;
  
  return (
    <button
      onClick={toggleEditMode}
      className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
      data-testid="button-toggle-edit-mode"
    >
      <div className="flex items-center gap-3">
        {isEditMode ? (
          <IconPencilOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <IconPencil className="h-4 w-4 text-muted-foreground" />
        )}
        <span>Edit Mode</span>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded ${isEditMode ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        {isEditMode ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export function DebugBubble() {
  const { isValidated, hasToken, isLoading, isDebugMode, retryValidation, validateManualToken, clearToken, checkSession } = useDebugAuth();
  const { session } = useSession();
  const editMode = useEditModeOptional();
  const syncContext = useSyncOptional();
  const { i18n } = useTranslation();
  const { toast } = useToast();
  const [pathname, navigate] = useLocation();
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
  
  // GitHub sync status state
  const [githubSyncStatus, setGithubSyncStatus] = useState<GitHubSyncStatus | null>(null);
  const [syncStatusLoading, setSyncStatusLoading] = useState(false);
  
  // Pending changes state
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [pendingChangesLoading, setPendingChangesLoading] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Pull conflict state
  const [pullConflictModalOpen, setPullConflictModalOpen] = useState(false);
  const [pullConflictFiles, setPullConflictFiles] = useState<string[]>([]);
  
  // Per-file sync state
  const [selectedFileForCommit, setSelectedFileForCommit] = useState<string | null>(null);
  const [fileCommitMessage, setFileCommitMessage] = useState("");
  const [fileCommitting, setFileCommitting] = useState<string | null>(null);
  const [filePulling, setFilePulling] = useState<string | null>(null);
  const [confirmPullFile, setConfirmPullFile] = useState<string | null>(null);
  
  // Advanced options state
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [isIgnoringAllChanges, setIsIgnoringAllChanges] = useState(false);
  
  // Create content modal state
  const [createContentModalOpen, setCreateContentModalOpen] = useState(false);
  const [createContentType, setCreateContentType] = useState<'location' | 'page' | 'program' | 'landing'>('page');
  const [createContentTitle, setCreateContentTitle] = useState("");
  const [createContentSlugEn, setCreateContentSlugEn] = useState("");
  const [createContentSlugEs, setCreateContentSlugEs] = useState("");
  const [createContentSlugEnStatus, setCreateContentSlugEnStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [createContentSlugEsStatus, setCreateContentSlugEsStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [editingSlugEn, setEditingSlugEn] = useState(false);
  const [editingSlugEs, setEditingSlugEs] = useState(false);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [createLandingLocale, setCreateLandingLocale] = useState<'en' | 'es'>('en');
  
  // Session check state
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  
  // Breathecode host state
  const [breathecodeHost, setBreathecodeHost] = useState<{ host: string; isDefault: boolean } | null>(null);
  
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

  // Fetch Breathecode host on mount
  useEffect(() => {
    fetch("/api/debug/breathecode-host")
      .then((res) => res.json())
      .then((data) => {
        setBreathecodeHost(data);
      })
      .catch(() => {});
  }, []);

  // Listen for open-sync-modal event from SyncConflictBanner
  useEffect(() => {
    const handleOpenSyncModal = () => {
      setCommitModalOpen(true);
      // Fetch pending changes when modal opens from banner
      setPendingChangesLoading(true);
      fetch(`/api/github/pending-changes?_t=${Date.now()}`)
        .then((res) => res.json())
        .then((data: { changes: PendingChange[]; count: number }) => {
          setPendingChanges(data.changes || []);
          setPendingChangesLoading(false);
        })
        .catch(() => {
          setPendingChanges([]);
          setPendingChangesLoading(false);
        });
    };
    window.addEventListener("open-sync-modal", handleOpenSyncModal);
    return () => {
      window.removeEventListener("open-sync-modal", handleOpenSyncModal);
    };
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

  // Fetch GitHub sync status on mount and when popover opens
  useEffect(() => {
    if (open && menuView === "main" && !githubSyncStatus && !syncStatusLoading) {
      setSyncStatusLoading(true);
      fetch("/api/github/sync-status")
        .then((res) => res.json())
        .then((data: GitHubSyncStatus) => {
          setGithubSyncStatus(data);
          setSyncStatusLoading(false);
        })
        .catch(() => {
          setSyncStatusLoading(false);
        });
    }
  }, [open, menuView]);

  // Function to refresh sync status
  const refreshSyncStatus = () => {
    setSyncStatusLoading(true);
    setGithubSyncStatus(null);
    fetch("/api/github/sync-status")
      .then((res) => res.json())
      .then((data: GitHubSyncStatus) => {
        setGithubSyncStatus(data);
        setSyncStatusLoading(false);
      })
      .catch(() => {
        setSyncStatusLoading(false);
      });
  };

  // Function to execute the actual sync (called after conflict check)
  const executeSyncFromRemote = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        // Refresh sync status and pending changes before reload
        await refreshSyncStatus();
        if (syncContext) {
          syncContext.refreshSyncStatus();
        }
        window.location.reload();
      } else {
        setIsSyncing(false);
      }
    } catch {
      setIsSyncing(false);
    }
  };

  // Function to sync from remote (pull latest changes) - checks for conflicts first
  const handleSyncFromRemote = async () => {
    setIsSyncing(true);
    try {
      // Check for conflicts first
      const conflictRes = await fetch("/api/github/pull-conflicts");
      if (conflictRes.ok) {
        const conflictData = await conflictRes.json();
        if (conflictData.hasConflicts && conflictData.conflictingFiles.length > 0) {
          // Show conflict modal instead of pulling
          setPullConflictFiles(conflictData.conflictingFiles);
          setPullConflictModalOpen(true);
          setIsSyncing(false);
          return;
        }
      }
      // No conflicts, proceed with sync
      await executeSyncFromRemote();
    } catch {
      setIsSyncing(false);
    }
  };

  // Fetch pending changes when GitHub sync is enabled
  const fetchPendingChanges = () => {
    setPendingChangesLoading(true);
    fetch(`/api/github/pending-changes?_t=${Date.now()}`)
      .then((res) => res.json())
      .then((data: { changes: PendingChange[]; count: number }) => {
        setPendingChanges(data.changes || []);
        setPendingChangesLoading(false);
      })
      .catch(() => {
        setPendingChanges([]);
        setPendingChangesLoading(false);
      });
  };

  // Handle session check (validates without clearing cache first)
  const handleCheckSession = async () => {
    setIsCheckingSession(true);
    try {
      const result = await checkSession();
      if (result.valid) {
        toast({
          title: "Session valid",
          description: "Your authentication is still active.",
        });
      } else if (result.networkError) {
        // Network error - session not cleared, just inform user
        toast({
          title: "Network error",
          description: "Could not reach server to verify session. Try again later.",
          variant: "destructive",
        });
      } else if (result.expired) {
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Session invalid",
          description: "Please log in again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Check failed",
        description: "Could not verify session.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Fetch pending changes when sync status indicates sync is enabled
  useEffect(() => {
    if (githubSyncStatus?.syncEnabled) {
      fetchPendingChanges();
    }
  }, [githubSyncStatus?.syncEnabled]);

  // Listen for content updates to refresh pending changes immediately
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates(() => {
      // Refresh pending changes when any content is updated
      if (!githubSyncStatus) {
        // Fetch sync status first, which will trigger pending changes fetch
        fetch("/api/github/sync-status")
          .then((res) => res.json())
          .then((data: GitHubSyncStatus) => {
            setGithubSyncStatus(data);
            if (data.syncEnabled) {
              fetchPendingChanges();
            }
          })
          .catch(() => {});
      } else if (githubSyncStatus.syncEnabled) {
        fetchPendingChanges();
      }
    });

    return unsubscribe;
  }, [githubSyncStatus]);

  // Handle commit
  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    
    setIsCommitting(true);
    try {
      const forceCommit = syncContext?.forceCommitEnabled || false;
      const author = getDebugUserName();
      const res = await fetch("/api/github/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: commitMessage.trim(),
          force: forceCommit,
          author,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setCommitModalOpen(false);
        setCommitMessage("");
        setPendingChanges([]);
        refreshSyncStatus();
        if (syncContext) {
          syncContext.refreshSyncStatus();
          syncContext.syncWithRemote();
        }
      } else {
        alert(data.error || "Failed to commit changes");
      }
    } catch (error) {
      alert("Failed to commit changes");
    } finally {
      setIsCommitting(false);
    }
  };

  // Handle per-file commit
  const handleFileCommit = async (filePath: string) => {
    if (!fileCommitMessage.trim()) return;
    
    setFileCommitting(filePath);
    try {
      const author = getDebugUserName();
      const res = await fetch("/api/github/commit-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          filePath,
          message: fileCommitMessage.trim(),
          author,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Remove committed file from pending changes
        const remainingChanges = pendingChanges.filter(c => c.file !== filePath);
        setPendingChanges(remainingChanges);
        setSelectedFileForCommit(null);
        setFileCommitMessage("");
        
        // If all pending changes are resolved, sync with remote to update lastSyncedCommit
        if (remainingChanges.length === 0) {
          try {
            await fetch("/api/github/sync-with-remote", { method: "POST" });
          } catch {
            // Silently fail - sync status will still be refreshed
          }
        }
        
        refreshSyncStatus();
        if (syncContext) {
          syncContext.refreshSyncStatus();
        }
      } else {
        alert(data.error || "Failed to commit file");
      }
    } catch {
      alert("Failed to commit file");
    } finally {
      setFileCommitting(null);
    }
  };

  // Handle per-file pull
  const handleFilePull = async (filePath: string) => {
    setFilePulling(filePath);
    try {
      const res = await fetch("/api/github/pull-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Remove file from pending changes (now synced)
        const remainingChanges = pendingChanges.filter(c => c.file !== filePath);
        setPendingChanges(remainingChanges);
        setConfirmPullFile(null);
        
        // If all pending changes are resolved, sync with remote to update lastSyncedCommit
        if (remainingChanges.length === 0) {
          try {
            await fetch("/api/github/sync-with-remote", { method: "POST" });
          } catch {
            // Silently fail - sync status will still be refreshed
          }
        }
        
        refreshSyncStatus();
        if (syncContext) {
          syncContext.refreshSyncStatus();
        }
      } else {
        alert(data.error || "Failed to pull file");
      }
    } catch {
      alert("Failed to pull file");
    } finally {
      setFilePulling(null);
    }
  };

  // Handle ignore all local changes - reset to remote state
  const handleIgnoreAllChanges = async () => {
    const localChanges = pendingChanges.filter(c => c.source === 'local' || c.source === 'conflict');
    if (localChanges.length === 0) return;
    
    const confirmed = window.confirm(
      `This will erase all changes you have made to Marketing Content YAMLs (${localChanges.length} file${localChanges.length > 1 ? 's' : ''}). This cannot be undone. Continue?`
    );
    if (!confirmed) return;
    
    setIsIgnoringAllChanges(true);
    try {
      // Pull each file with local changes from remote
      for (const change of localChanges) {
        const res = await fetch("/api/github/pull-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath: change.file }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to reset ${change.file}`);
        }
      }
      
      // Clear pending changes and refresh
      setPendingChanges(pendingChanges.filter(c => c.source !== 'local' && c.source !== 'conflict'));
      setAdvancedOptionsOpen(false);
      
      // Sync with remote to update status
      try {
        await fetch("/api/github/sync-with-remote", { method: "POST" });
      } catch {
        // Silently fail
      }
      
      refreshSyncStatus();
      if (syncContext) {
        syncContext.refreshSyncStatus();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to ignore local changes");
    } finally {
      setIsIgnoringAllChanges(false);
    }
  };

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
      <Popover open={open} onOpenChange={handleOpenChange}>
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
            {/* Show "Commit" indicator when there are local changes that need uploading - only when logged in */}
            {githubSyncStatus?.syncEnabled && pendingChanges.some(c => c.source === 'local' || c.source === 'conflict') && !noTokenDetected && !tokenWithoutCapabilities && (
              <button
                onClick={() => {
                  setCommitModalOpen(true);
                  fetchPendingChanges(); // Refresh pending changes when opening modal
                }}
                className="absolute -top-1 left-full ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium animate-pulse cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  boxShadow: '0 0 12px 2px rgba(251, 191, 36, 0.6), 0 0 20px 4px rgba(251, 191, 36, 0.3)',
                }}
                data-testid="indicator-pending-changes"
                title={`${pendingChanges.length} pending change${pendingChanges.length > 1 ? 's' : ''} - click to commit`}
              >
                <IconArrowUp className="h-3 w-3" />
                <span>Commit</span>
              </button>
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
                  {breathecodeHost && !breathecodeHost.isDefault && (
                    <div className="flex items-start gap-1.5 mt-2 text-amber-600 dark:text-amber-400">
                      <IconAlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div>The host is pointing to</div>
                        <div className="font-mono break-all">{breathecodeHost.host}</div>
                      </div>
                    </div>
                  )}
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
          ) : (
            <>
              {/* Warning banner for invalid GitHub credentials */}
              {githubSyncStatus?.syncEnabled && githubSyncStatus.status === 'invalid-credentials' && (
                <div className="p-3 bg-red-100 dark:bg-red-900/50 border-b border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-2">
                    <IconAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-red-800 dark:text-red-200">
                        Invalid GitHub Credentials for Sync
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                        Check GITHUB_TOKEN and GITHUB_REPO_URL settings
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning banner when sync is disabled */}
              {githubSyncStatus && !githubSyncStatus.syncEnabled && githubSyncStatus.configured && (
                <div className="p-3 bg-muted/50 border-b border-border">
                  <div className="flex items-start gap-2">
                    <IconBrandGithub className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">
                        GitHub Sync is Disabled
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Set GITHUB_SYNC_ENABLED=true to enable
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning banner when behind or diverged from GitHub */}
              {githubSyncStatus && (githubSyncStatus.status === 'behind' || githubSyncStatus.status === 'diverged') && (
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 border-b border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <IconAlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                        {githubSyncStatus.status === 'behind' 
                          ? 'Pull latest changes before publishing'
                          : 'Local and remote have diverged'}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                        Production content edits may be overwritten
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Persistent Dev Tools header - visible in all menu views */}
              <div className="p-3 border-b pl-[8px] pr-[8px] pt-[3px] pb-[3px]">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Dev Tools</h3>
                  <div className="flex items-center gap-2">
                    {/* Read/Edit toggle */}
                    {editMode && (
                      <div 
                        className="flex items-center bg-muted rounded-full p-0.5"
                        data-testid="toggle-edit-mode"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (!editMode.isEditMode) {
                              editMode.toggleEditMode();
                              // Navigate to preview route if on a content page
                              if (contentInfo.type && contentInfo.slug && !pathname.startsWith('/private/preview/')) {
                                // Extract locale from URL path (e.g., /en/career-programs/... → en)
                                // This is more reliable than i18n.language which can return browser locale like en-US
                                const pathSegments = pathname.split('/').filter(Boolean);
                                const urlLocale = pathSegments[0];
                                const normalizedLocale = normalizeLocale(urlLocale || i18n.language);
                                const previewUrl = `/private/preview/${contentInfo.type}/${contentInfo.slug}?locale=${normalizedLocale}`;
                                navigate(previewUrl);
                              }
                            }
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
                    {/* Preview breakpoint toggle - only visible in edit mode */}
                    {editMode && editMode.isEditMode && (
                      <div 
                        className="flex items-center bg-muted rounded-full p-0.5"
                        data-testid="toggle-preview-breakpoint"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            editMode.setPreviewBreakpoint('desktop');
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            editMode.previewBreakpoint === 'desktop' 
                              ? "bg-foreground text-background shadow-sm" 
                              : "text-muted-foreground"
                          }`}
                          data-testid="button-preview-desktop"
                          title="Preview desktop view"
                        >
                          <IconDeviceDesktop className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            editMode.setPreviewBreakpoint('mobile');
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            editMode.previewBreakpoint === 'mobile' 
                              ? "bg-foreground text-background shadow-sm" 
                              : "text-muted-foreground"
                          }`}
                          data-testid="button-preview-mobile"
                          title="Preview mobile view"
                        >
                          <IconDeviceMobile className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Menu content based on current view */}
              {menuView === "main" ? (
              <>
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
                
                <button
                  onClick={() => setMenuView("menus")}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover-elevate"
                  data-testid="button-menus-menu"
                >
                  <div className="flex items-center gap-3">
                    <IconMenu2 className="h-4 w-4 text-muted-foreground" />
                    <span>Menus</span>
                  </div>
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                
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
                
                {/* GitHub sync status */}
                <div className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm">
                  <div className="flex items-center gap-3">
                    <IconBrandGithub className="h-4 w-4 text-muted-foreground" />
                    <span>GitHub Sync</span>
                    {githubSyncStatus && !githubSyncStatus.syncEnabled && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {syncStatusLoading ? (
                      <IconRefresh className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    ) : githubSyncStatus ? (
                      <>
                        {githubSyncStatus.status === 'in-sync' && (
                          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <IconCheck className="h-3.5 w-3.5" />
                            In sync
                          </span>
                        )}
                        {githubSyncStatus.status === 'behind' && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <IconCloudDownload className="h-3.5 w-3.5" />
                            {githubSyncStatus.behindBy} behind
                          </span>
                        )}
                        {githubSyncStatus.status === 'ahead' && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                            {githubSyncStatus.aheadBy} ahead
                          </span>
                        )}
                        {githubSyncStatus.status === 'diverged' && (
                          <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <IconAlertTriangle className="h-3.5 w-3.5" />
                            Diverged
                          </span>
                        )}
                        {githubSyncStatus.status === 'invalid-credentials' && (
                          <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                            <IconAlertTriangle className="h-3.5 w-3.5" />
                            Invalid Credentials
                          </span>
                        )}
                        {githubSyncStatus.status === 'not-configured' && (
                          <span className="text-xs text-muted-foreground">Not configured</span>
                        )}
                        {githubSyncStatus.status === 'unknown' && (
                          <span className="text-xs text-amber-600 dark:text-amber-400" title="Could not compare local and remote commits">
                            Check failed
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">--</span>
                    )}
                    <button
                      onClick={refreshSyncStatus}
                      disabled={syncStatusLoading}
                      className="p-1 rounded hover-elevate disabled:opacity-50"
                      data-testid="button-refresh-sync-status"
                      title="Refresh sync status"
                    >
                      <IconRefresh className={`h-3.5 w-3.5 ${syncStatusLoading ? 'animate-spin' : ''}`} />
                    </button>
                    {githubSyncStatus?.syncEnabled && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          fetchPendingChanges();
                          setCommitModalOpen(true);
                        }}
                        className="p-1 rounded hover-elevate"
                        data-testid="button-open-sync-modal"
                        title="Manage file sync"
                      >
                        <IconCloudDownload className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t p-2 space-y-1">
                {/* Session Group */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <IconDatabase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Session</span>
                      {!hasToken && (
                        <span className="text-xs text-amber-600 dark:text-amber-400">(no auth)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleCheckSession}
                        disabled={isCheckingSession}
                        className="p-1 rounded hover-elevate"
                        data-testid="button-session-refresh"
                        title="Check session validity"
                      >
                        <IconRefresh className={`h-3.5 w-3.5 text-muted-foreground ${isCheckingSession ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => setSessionModalOpen(true)}
                        className="p-1 rounded hover-elevate"
                        data-testid="button-session-view"
                        title="View session data"
                      >
                        <IconPencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
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
                        Create <code className="bg-muted px-1 rounded">experiments.yml</code> in the content folder
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
          ) : menuView === "menus" ? (
            <>
              <div className="px-3 py-2 border-b">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMenuView("main")}
                    className="p-1 rounded-md hover-elevate"
                    data-testid="button-back-to-main-menus"
                  >
                    <IconArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <h3 className="font-semibold text-sm">Menus</h3>
                    <p className="text-xs text-muted-foreground">Navigation menu configurations</p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-1">
                  <MenusView />
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
                      onClick={() => setCreateContentModalOpen(true)}
                      className="p-1.5 rounded hover-elevate"
                      title="Create new content"
                      data-testid="button-create-content"
                    >
                      <IconPlus className="h-4 w-4 text-muted-foreground" />
                    </button>
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
                                    className="block px-3 py-1 rounded-md text-xs text-muted-foreground hover-elevate cursor-pointer truncate"
                                    data-testid={`link-sitemap-url-${url.label.toLowerCase().replace(/\s+/g, '-')}`}
                                  >
                                    {path}
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
                            className="block px-3 py-1.5 rounded-md text-xs text-muted-foreground hover-elevate cursor-pointer truncate"
                            data-testid={`link-sitemap-url-${url.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {path}
                          </a>
                        );
                      })}
                    </>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
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
            <DialogTitle>Session Data{getDebugUserName() ? ` - ${getDebugUserName()}` : ''}</DialogTitle>
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
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => {
                      clearToken();
                      setSessionModalOpen(false);
                    }}
                    data-testid="button-clear-session-token"
                    title="Clear token"
                  >
                    <IconX className="h-4 w-4" />
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
              <h4 className="text-sm font-semibold text-foreground">Device</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.device?.deviceCategory || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OS:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.device?.osFamily || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Browser:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.device?.browserFamily || 'N/A'}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viewport:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.device?.viewportWidth}x{session.device?.viewportHeight}</code>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Pixel Ratio:</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{session.device?.devicePixelRatio || 'N/A'}</code>
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
      {/* Sync Files Modal */}
      <Dialog open={commitModalOpen} onOpenChange={setCommitModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconBrandGithub className="h-5 w-5" />
              Sync Files with GitHub
            </DialogTitle>
            <DialogDescription>
              Upload your local changes to remote or download incoming changes from remote.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Pending changes list */}
            <div className="space-y-2">
              {pendingChangesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <IconRefresh className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : pendingChanges.length === 0 ? (
                <div className="py-2">
                  <p className="text-sm text-muted-foreground">
                    All files are in sync. No local or remote changes detected.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[250px]">
                  <div className="space-y-1">
                    {pendingChanges.map((change, index) => (
                      <Card 
                        key={`${change.file}-${index}`}
                        className="p-2 space-y-1"
                      >
                        {/* Row 1: File path only */}
                        <div 
                          className="font-mono text-xs text-foreground truncate"
                          title={change.file}
                        >
                          {change.file.replace('marketing-content/', '')}
                        </div>
                        
                        {/* Row 2: Badge | Author | Date | Commit hash | Actions */}
                        {selectedFileForCommit === change.file ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={fileCommitMessage}
                              onChange={(e) => setFileCommitMessage(e.target.value)}
                              placeholder="Commit message..."
                              className="w-full px-2 py-1.5 text-xs rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                              data-testid={`input-file-commit-message-${index}`}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && fileCommitMessage.trim()) {
                                  handleFileCommit(change.file);
                                } else if (e.key === 'Escape') {
                                  setSelectedFileForCommit(null);
                                  setFileCommitMessage("");
                                }
                              }}
                            />
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                className="h-7 text-xs flex-1"
                                onClick={() => handleFileCommit(change.file)}
                                disabled={!fileCommitMessage.trim() || fileCommitting === change.file}
                                data-testid={`button-confirm-file-commit-${index}`}
                              >
                                {fileCommitting === change.file ? (
                                  <IconRefresh className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <IconArrowUp className="h-3 w-3 mr-1" />
                                    Commit
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setSelectedFileForCommit(null);
                                  setFileCommitMessage("");
                                }}
                                data-testid={`button-cancel-file-commit-${index}`}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Badge */}
                            <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded ${
                              change.source === 'conflict'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                : change.source === 'incoming'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}>
                              {change.source === 'conflict' ? 'Conflict' : change.source === 'incoming' ? 'Incoming update' : 'Local update'}
                            </span>
                            
                            {/* Author */}
                            <span className="text-xs text-muted-foreground">
                              {change.author || (change.source === 'local' ? 'Legacy yourself' : '')}
                            </span>
                            
                            {/* Date */}
                            {change.date && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(change.date).toLocaleDateString()}
                              </span>
                            )}
                            
                            {/* Commit hash (clickable) */}
                            {change.commitSha && githubSyncStatus?.repoUrl && (
                              <a
                                href={`${githubSyncStatus.repoUrl.replace(/\.git$/, '')}/commit/${change.commitSha}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-primary hover:underline"
                                title={`View commit ${change.commitSha}`}
                                data-testid={`link-commit-${index}`}
                              >
                                {change.commitSha.substring(0, 7)}
                              </a>
                            )}
                            
                            {/* Spacer to push buttons to the right */}
                            <div className="flex-1" />
                            
                            {/* Action buttons */}
                            <div className="flex items-center gap-1">
                              {/* Backup download button - always visible */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6"
                                    onClick={async () => {
                                      try {
                                        const token = getDebugToken();
                                        const headers: Record<string, string> = {};
                                        if (token) {
                                          headers["Authorization"] = `Token ${token}`;
                                        }
                                        const response = await fetch(`/api/content/file?path=${encodeURIComponent(change.file)}`, { headers });
                                        if (!response.ok) throw new Error('Failed to fetch file');
                                        const content = await response.text();
                                        const blob = new Blob([content], { type: 'application/x-yaml' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        const pathParts = change.file.replace('marketing-content/', '').split('/');
                                        const fileName = pathParts.length >= 2 
                                          ? `${pathParts[pathParts.length - 2]}.${pathParts[pathParts.length - 1]}`
                                          : pathParts.pop() || 'backup.yml';
                                        a.download = fileName;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                        toast({
                                          title: "Backup downloaded",
                                          description: `Downloaded ${change.file.split('/').pop()}`,
                                        });
                                      } catch (error) {
                                        console.error('Failed to download backup:', error);
                                        toast({
                                          title: "Download failed",
                                          description: "Could not download the backup file",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                    data-testid={`button-backup-file-${index}`}
                                  >
                                    <IconDeviceFloppy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p>Download a backup of my page</p>
                                </TooltipContent>
                              </Tooltip>
                              {/* Show Upload button for local changes and conflicts */}
                              {(change.source === 'local' || change.source === 'conflict') && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-6 w-6"
                                      onClick={() => {
                                        setSelectedFileForCommit(change.file);
                                        setFileCommitMessage("");
                                      }}
                                      data-testid={`button-commit-file-${index}`}
                                    >
                                      <IconArrowUp className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>Upload my version to remote</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {/* Show Download button for incoming changes and conflicts */}
                              {(change.source === 'incoming' || change.source === 'conflict') && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="h-6 w-6"
                                      onClick={() => {
                                        if (change.source === 'conflict') {
                                          setConfirmPullFile(change.file);
                                        } else {
                                          handleFilePull(change.file);
                                        }
                                      }}
                                      disabled={filePulling === change.file}
                                      data-testid={`button-pull-file-${index}`}
                                    >
                                      {filePulling === change.file ? (
                                        <IconRefresh className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <IconArrowDown className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>Download and Override mine</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            
            {/* Advanced Options - always visible */}
            <div className="border-t pt-3">
              <button
                type="button"
                onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-toggle-advanced-options"
              >
                {advancedOptionsOpen ? (
                  <IconChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <IconChevronRight className="h-3.5 w-3.5" />
                )}
                Advanced options
              </button>
              
              {advancedOptionsOpen && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Discard all your local changes and reset to the remote version.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleIgnoreAllChanges}
                    disabled={isIgnoringAllChanges || !pendingChanges.some(c => c.source === 'local' || c.source === 'conflict')}
                    data-testid="button-ignore-all-changes"
                  >
                    {isIgnoringAllChanges ? (
                      <>
                        <IconRefresh className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <IconTrash className="h-3.5 w-3.5 mr-1.5" />
                        Ignore all my local changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCommitModalOpen(false);
                setSelectedFileForCommit(null);
                setFileCommitMessage("");
                setAdvancedOptionsOpen(false);
              }}
              data-testid="button-close-commit-modal"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pull Conflict Modal */}
      <Dialog open={pullConflictModalOpen} onOpenChange={setPullConflictModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <IconAlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <DialogTitle>Conflicting Files Detected</DialogTitle>
                <DialogDescription>
                  The following files have been modified both locally and on remote.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <ScrollArea className="max-h-[200px] border rounded-md">
              <div className="p-2 space-y-1">
                {pullConflictFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-2 py-1.5 text-sm">
                    <IconFile className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span 
                      className="font-mono text-xs truncate" 
                      title={file}
                    >
                      {file.replace('marketing-content/', '')}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <p className="text-xs text-muted-foreground mt-3">
              Pulling will overwrite your local changes to these files.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setPullConflictModalOpen(false)}
              data-testid="button-cancel-pull"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPullConflictModalOpen(false);
                setCommitModalOpen(true);
              }}
              data-testid="button-commit-first"
            >
              <IconArrowUp className="h-4 w-4 mr-2" />
              Commit First
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setPullConflictModalOpen(false);
                executeSyncFromRemote();
              }}
              data-testid="button-pull-anyway"
            >
              <IconCloudDownload className="h-4 w-4 mr-2" />
              Pull Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Per-file Download Confirmation Modal */}
      <Dialog open={confirmPullFile !== null} onOpenChange={(open) => !open && setConfirmPullFile(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <IconCloudDownload className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <DialogTitle>Download and Override Local File?</DialogTitle>
                <DialogDescription>
                  This will replace your local version with the remote version.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <IconFile className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span 
                className="font-mono text-sm truncate" 
                title={confirmPullFile || ''}
              >
                {confirmPullFile?.replace('marketing-content/', '')}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3">
              Your local version will be replaced with the remote version. This action cannot be undone.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmPullFile(null)}
              disabled={filePulling === confirmPullFile}
              data-testid="button-cancel-pull-file"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmPullFile) {
                  handleFilePull(confirmPullFile);
                }
              }}
              disabled={filePulling === confirmPullFile}
              data-testid="button-confirm-pull-file"
            >
              {filePulling === confirmPullFile ? (
                <>
                  <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <IconCloudDownload className="h-4 w-4 mr-2" />
                  Download and Override mine
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Content Modal */}
      <Dialog open={createContentModalOpen} onOpenChange={(open) => {
        setCreateContentModalOpen(open);
        if (!open) {
          setCreateContentTitle("");
          setCreateContentSlugEn("");
          setCreateContentSlugEs("");
          setCreateContentSlugEnStatus('idle');
          setCreateContentSlugEsStatus('idle');
          setEditingSlugEn(false);
          setEditingSlugEs(false);
          setCreateContentType('page');
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconPlus className="h-5 w-5" />
              Create New Content
            </DialogTitle>
            <DialogDescription>
              Create a new page, location, program, or landing with starter YAML files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <div className="flex items-center gap-2">
                <Select 
                  value={createContentType} 
                  onValueChange={(v) => {
                    setCreateContentType(v as 'location' | 'page' | 'program' | 'landing');
                    // Re-validate slugs with new type (skip for landing - uses different validation)
                    if (v !== 'landing') {
                      if (createContentSlugEn) {
                        setCreateContentSlugEnStatus('checking');
                        fetch(`/api/content/check-slug?type=${v}&slug=${createContentSlugEn}&locale=en`)
                          .then(res => res.json())
                          .then(data => setCreateContentSlugEnStatus(data.available ? 'available' : 'taken'))
                          .catch(() => setCreateContentSlugEnStatus('idle'));
                      }
                      if (createContentSlugEs) {
                        setCreateContentSlugEsStatus('checking');
                        fetch(`/api/content/check-slug?type=${v}&slug=${createContentSlugEs}&locale=es`)
                          .then(res => res.json())
                          .then(data => setCreateContentSlugEsStatus(data.available ? 'available' : 'taken'))
                          .catch(() => setCreateContentSlugEsStatus('idle'));
                      }
                    } else {
                      // For landings, validate single slug
                      if (createContentSlugEn) {
                        setCreateContentSlugEnStatus('checking');
                        fetch(`/api/content/check-slug?type=landing&slug=${createContentSlugEn}`)
                          .then(res => res.json())
                          .then(data => setCreateContentSlugEnStatus(data.available ? 'available' : 'taken'))
                          .catch(() => setCreateContentSlugEnStatus('idle'));
                      }
                    }
                  }}
                >
                  <SelectTrigger data-testid="select-content-type" className={createContentType === 'landing' ? 'flex-1' : 'w-full'}>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="landing">Landing</SelectItem>
                  </SelectContent>
                </Select>
                
                {createContentType === 'landing' && (
                  <Select value={createLandingLocale} onValueChange={(v) => setCreateLandingLocale(v as 'en' | 'es')}>
                    <SelectTrigger className="w-36" data-testid="select-landing-locale">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <LocaleFlag locale={createLandingLocale} />
                          <span>{createLandingLocale === 'en' ? 'English' : 'Spanish'}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <span className="flex items-center gap-2">
                          <LocaleFlag locale="en" />
                          <span>English</span>
                        </span>
                      </SelectItem>
                      <SelectItem value="es">
                        <span className="flex items-center gap-2">
                          <LocaleFlag locale="es" />
                          <span>Spanish</span>
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={createContentTitle}
                onChange={(e) => {
                  const title = e.target.value;
                  setCreateContentTitle(title);
                  const slug = title
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                  setCreateContentSlugEn(slug);
                  setCreateContentSlugEs(slug);
                  if (slug) {
                    if (createContentType === 'landing') {
                      // Landings: single slug validation
                      setCreateContentSlugEnStatus('checking');
                      fetch(`/api/content/check-slug?type=landing&slug=${slug}`)
                        .then(res => res.json())
                        .then(data => setCreateContentSlugEnStatus(data.available ? 'available' : 'taken'))
                        .catch(() => setCreateContentSlugEnStatus('idle'));
                    } else {
                      // Other types: validate both EN/ES slugs
                      setCreateContentSlugEnStatus('checking');
                      setCreateContentSlugEsStatus('checking');
                      fetch(`/api/content/check-slug?type=${createContentType}&slug=${slug}&locale=en`)
                        .then(res => res.json())
                        .then(data => setCreateContentSlugEnStatus(data.available ? 'available' : 'taken'))
                        .catch(() => setCreateContentSlugEnStatus('idle'));
                      fetch(`/api/content/check-slug?type=${createContentType}&slug=${slug}&locale=es`)
                        .then(res => res.json())
                        .then(data => setCreateContentSlugEsStatus(data.available ? 'available' : 'taken'))
                        .catch(() => setCreateContentSlugEsStatus('idle'));
                    }
                  } else {
                    setCreateContentSlugEnStatus('idle');
                    setCreateContentSlugEsStatus('idle');
                  }
                }}
                placeholder="e.g., Career Development Guide"
                className="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                data-testid="input-content-title"
              />
            </div>
            
            {createContentSlugEn && createContentType === 'landing' && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-md">
                {/* Single slug for landings */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Sitemap URL:</p>
                  <div className="flex items-center gap-2">
                    {editingSlugEn ? (
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-xs font-mono text-muted-foreground">/landing/</span>
                        <input
                          type="text"
                          value={createContentSlugEn}
                          onChange={(e) => {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                              .replace(/-+/g, '-');
                            setCreateContentSlugEn(slug);
                            if (slug) {
                              setCreateContentSlugEnStatus('checking');
                              fetch(`/api/content/check-slug?type=landing&slug=${slug}`)
                                .then(res => res.json())
                                .then(data => setCreateContentSlugEnStatus(data.available ? 'available' : 'taken'))
                                .catch(() => setCreateContentSlugEnStatus('idle'));
                            } else {
                              setCreateContentSlugEnStatus('idle');
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs font-mono rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          data-testid="input-slug-landing"
                          autoFocus
                          onBlur={() => setEditingSlugEn(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingSlugEn(false)}
                        />
                      </div>
                    ) : (
                      <code 
                        className="flex-1 text-xs bg-background px-2 py-1 rounded cursor-pointer hover-elevate"
                        onClick={() => setEditingSlugEn(true)}
                        data-testid="url-preview-landing"
                      >
                        /landing/{createContentSlugEn}
                      </code>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingSlugEn(!editingSlugEn)}
                      className="p-1 rounded hover-elevate"
                      title="Edit slug"
                      data-testid="button-edit-slug-landing"
                    >
                      <IconPencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <div className="w-4">
                      {createContentSlugEnStatus === 'checking' && (
                        <IconRefresh className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {createContentSlugEnStatus === 'available' && (
                        <IconCheck className="h-4 w-4 text-green-600" />
                      )}
                      {createContentSlugEnStatus === 'taken' && (
                        <IconX className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  {createContentSlugEnStatus === 'taken' && (
                    <p className="text-xs text-red-600 pl-1">This slug is already taken</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Files that will be created:</p>
                  <div className="space-y-0.5 font-mono text-xs text-muted-foreground">
                    <div>marketing-content/landings/{createContentSlugEn}/</div>
                    <div className="pl-4">├── _common.yml</div>
                    <div className="pl-4">└── promoted.yml</div>
                  </div>
                </div>
              </div>
            )}
            
            {createContentSlugEn && createContentType !== 'landing' && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-md">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">URLs that will be created:</p>
                  
                  {/* English URL Row */}
                  <div className="flex items-center gap-2">
                    {editingSlugEn ? (
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {buildContentUrl(createContentType as ContentType, '', 'en').slice(0, -1)}
                        </span>
                        <input
                          type="text"
                          value={createContentSlugEn}
                          onChange={(e) => {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                              .replace(/-+/g, '-');
                            setCreateContentSlugEn(slug);
                            if (slug) {
                              setCreateContentSlugEnStatus('checking');
                              fetch(`/api/content/check-slug?type=${createContentType}&slug=${slug}&locale=en`)
                                .then(res => res.json())
                                .then(data => setCreateContentSlugEnStatus(data.available ? 'available' : 'taken'))
                                .catch(() => setCreateContentSlugEnStatus('idle'));
                            } else {
                              setCreateContentSlugEnStatus('idle');
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs font-mono rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          data-testid="input-slug-en"
                          autoFocus
                          onBlur={() => setEditingSlugEn(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingSlugEn(false)}
                        />
                      </div>
                    ) : (
                      <code 
                        className="flex-1 text-xs bg-background px-2 py-1 rounded cursor-pointer hover-elevate"
                        onClick={() => setEditingSlugEn(true)}
                        data-testid="url-preview-en"
                      >
                        {buildContentUrl(createContentType as ContentType, createContentSlugEn, 'en')}
                      </code>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingSlugEn(!editingSlugEn)}
                      className="p-1 rounded hover-elevate"
                      title="Edit English slug"
                      data-testid="button-edit-slug-en"
                    >
                      <IconPencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <div className="w-4">
                      {createContentSlugEnStatus === 'checking' && (
                        <IconRefresh className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {createContentSlugEnStatus === 'available' && (
                        <IconCheck className="h-4 w-4 text-green-600" />
                      )}
                      {createContentSlugEnStatus === 'taken' && (
                        <IconX className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  {createContentSlugEnStatus === 'taken' && (
                    <p className="text-xs text-red-600 pl-1">English slug is taken</p>
                  )}
                  
                  {/* Spanish URL Row */}
                  <div className="flex items-center gap-2">
                    {editingSlugEs ? (
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {buildContentUrl(createContentType as ContentType, '', 'es').slice(0, -1)}
                        </span>
                        <input
                          type="text"
                          value={createContentSlugEs}
                          onChange={(e) => {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, '-')
                              .replace(/[^a-z0-9-]/g, '')
                              .replace(/-+/g, '-');
                            setCreateContentSlugEs(slug);
                            if (slug) {
                              setCreateContentSlugEsStatus('checking');
                              fetch(`/api/content/check-slug?type=${createContentType}&slug=${slug}&locale=es`)
                                .then(res => res.json())
                                .then(data => setCreateContentSlugEsStatus(data.available ? 'available' : 'taken'))
                                .catch(() => setCreateContentSlugEsStatus('idle'));
                            } else {
                              setCreateContentSlugEsStatus('idle');
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs font-mono rounded border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          data-testid="input-slug-es"
                          autoFocus
                          onBlur={() => setEditingSlugEs(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingSlugEs(false)}
                        />
                      </div>
                    ) : (
                      <code 
                        className="flex-1 text-xs bg-background px-2 py-1 rounded cursor-pointer hover-elevate"
                        onClick={() => setEditingSlugEs(true)}
                        data-testid="url-preview-es"
                      >
                        {buildContentUrl(createContentType as ContentType, createContentSlugEs, 'es')}
                      </code>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingSlugEs(!editingSlugEs)}
                      className="p-1 rounded hover-elevate"
                      title="Edit Spanish slug"
                      data-testid="button-edit-slug-es"
                    >
                      <IconPencil className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <div className="w-4">
                      {createContentSlugEsStatus === 'checking' && (
                        <IconRefresh className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {createContentSlugEsStatus === 'available' && (
                        <IconCheck className="h-4 w-4 text-green-600" />
                      )}
                      {createContentSlugEsStatus === 'taken' && (
                        <IconX className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  {createContentSlugEsStatus === 'taken' && (
                    <p className="text-xs text-red-600 pl-1">Spanish slug is taken</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Files that will be created:</p>
                  <div className="space-y-0.5 font-mono text-xs text-muted-foreground">
                    <div>marketing-content/{createContentType === 'location' ? 'locations' : createContentType === 'program' ? 'programs' : 'pages'}/{createContentSlugEn}/</div>
                    <div className="pl-4">├── _common.yml</div>
                    <div className="pl-4">├── en.yml</div>
                    <div className="pl-4">└── es.yml</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCreateContentModalOpen(false)}
              data-testid="button-cancel-create-content"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                // Validation differs for landings vs other types
                if (createContentType === 'landing') {
                  if (!createContentSlugEn || createContentSlugEnStatus !== 'available') return;
                } else {
                  if (!createContentSlugEn || !createContentSlugEs || 
                      createContentSlugEnStatus !== 'available' || 
                      createContentSlugEsStatus !== 'available') return;
                }
                
                setIsCreatingContent(true);
                try {
                  const token = getDebugToken();
                  
                  // Different endpoint for landings
                  if (createContentType === 'landing') {
                    const response = await fetch('/api/content/create-landing', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Token ${token}` } : {}),
                      },
                      body: JSON.stringify({
                        slug: createContentSlugEn,
                        locale: createLandingLocale,
                        title: createContentTitle || createContentSlugEn,
                      }),
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                      const newUrl = `/landing/${createContentSlugEn}`;
                      toast({
                        title: "Landing created",
                        description: `Created new landing at ${newUrl}`,
                      });
                      setCreateContentModalOpen(false);
                      setCreateContentTitle("");
                      setCreateContentSlugEn("");
                      setCreateContentSlugEs("");
                      setCreateContentSlugEnStatus('idle');
                      setCreateContentSlugEsStatus('idle');
                      setCreateLandingLocale('en');
                      
                      // Refresh sitemap
                      setSitemapLoading(true);
                      const sitemapRes = await fetch('/api/debug/sitemap-urls');
                      if (sitemapRes.ok) {
                        const urls = await sitemapRes.json();
                        setSitemapUrls(urls);
                      }
                      setSitemapLoading(false);
                      
                      // Navigate to the new landing
                      window.location.href = newUrl;
                    } else {
                      toast({
                        title: "Failed to create landing",
                        description: data.error || "An error occurred",
                        variant: "destructive",
                      });
                    }
                  } else {
                    const response = await fetch('/api/content/create', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Token ${token}` } : {}),
                      },
                      body: JSON.stringify({
                        type: createContentType,
                        slugEn: createContentSlugEn,
                        slugEs: createContentSlugEs,
                        title: createContentTitle || createContentSlugEn,
                      }),
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                      const newUrl = buildContentUrl(createContentType as ContentType, createContentSlugEn, 'en');
                      toast({
                        title: "Content created",
                        description: `Created new ${createContentType} at ${newUrl}`,
                      });
                      setCreateContentModalOpen(false);
                      setCreateContentTitle("");
                      setCreateContentSlugEn("");
                      setCreateContentSlugEs("");
                      setCreateContentSlugEnStatus('idle');
                      setCreateContentSlugEsStatus('idle');
                      
                      // Refresh sitemap
                      setSitemapLoading(true);
                      const sitemapRes = await fetch('/api/debug/sitemap-urls');
                      if (sitemapRes.ok) {
                        const urls = await sitemapRes.json();
                        setSitemapUrls(urls);
                      }
                      setSitemapLoading(false);
                      
                      // Navigate to the new page
                      window.location.href = newUrl;
                    } else {
                      toast({
                        title: "Failed to create content",
                        description: data.error || "An error occurred",
                        variant: "destructive",
                      });
                    }
                  }
                } catch (error) {
                  console.error('Error creating content:', error);
                  toast({
                    title: "Failed to create content",
                    description: "Network error occurred",
                    variant: "destructive",
                  });
                } finally {
                  setIsCreatingContent(false);
                }
              }}
              disabled={
                isCreatingContent || !createContentSlugEn || createContentSlugEnStatus !== 'available' ||
                (createContentType !== 'landing' && (!createContentSlugEs || createContentSlugEsStatus !== 'available'))
              }
              data-testid="button-confirm-create-content"
            >
              {isCreatingContent ? (
                <>
                  <IconRefresh className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create {createContentType.charAt(0).toUpperCase() + createContentType.slice(1)}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
