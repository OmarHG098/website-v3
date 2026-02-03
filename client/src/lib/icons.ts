/**
 * Unified Icon System
 * 
 * This utility provides a centralized way to render icons from:
 * 1. Custom icons (Rigobot, etc.) - checked first
 * 2. Tabler icons - fallback
 * 
 * Usage:
 *   import { getIcon, getAllIconNames } from "@/lib/icons";
 *   const IconComponent = getIcon("Rigobot"); // Custom icon
 *   const IconComponent = getIcon("Rocket");  // Tabler icon
 */

import * as TablerIcons from "@tabler/icons-react";
import { getCustomIcon } from "@/components/custom-icons";

// Custom icon names available (from custom-icons/index.ts)
export const CUSTOM_ICON_NAMES = [
  "Rigobot",
  "RigobotIconTiny",
  "Briefcase",
  "ChecklistVerify",
  "CodeWindow",
  "Contract",
  "FolderCheck",
  "Graduation",
  "GrowthChart",
  "HandsGroup",
  "Handshake",
  "Interview",
  "JobSearch",
  "Matplotlib",
  "Mentor2",
  "Monitor",
  "Optimization",
  "PeopleGroup",
  "Rocket",
  "Security",
  "StairsWithFlag",
  "Target",
];

// Common Tabler icons for the picker (curated list)
export const TABLER_ICON_NAMES = [
  // General UI icons
  "IconRocket", "IconUsers", "IconBriefcase", "IconShield", "IconCheck",
  "IconX", "IconPlus", "IconMinus", "IconStar", "IconHeart",
  "IconHome", "IconSettings", "IconSearch", "IconMail", "IconPhone",
  "IconCalendar", "IconClock", "IconMap", "IconMapPin", "IconGlobe",
  "IconWorld", "IconSend", "IconDownload", "IconUpload", "IconShare",
  "IconLink", "IconExternalLink", "IconEye", "IconEyeOff", "IconLock",
  "IconLockOpen", "IconKey", "IconUser", "IconUserPlus", "IconUserCheck",
  "IconCreditCard", "IconWallet", "IconCash", "IconCoin", "IconCurrency",
  "IconCurrencyDollar", "IconCurrencyEuro", "IconReceipt", "IconCalculator", "IconChart",
  "IconChartBar", "IconChartLine", "IconChartPie", "IconTrendingUp", "IconTrendingDown",
  "IconTarget", "IconAward", "IconTrophy", "IconMedal", "IconCertificate",
  "IconBadge", "IconFlag", "IconBookmark", "IconTag", "IconTags",
  "IconFolder", "IconFile", "IconFileText", "IconClipboard", "IconNotes",
  "IconPencil", "IconEdit", "IconTrash", "IconArchive", "IconRefresh",
  "IconRotate", "IconRepeat", "IconArrowUp", "IconArrowDown", "IconArrowLeft",
  "IconArrowRight", "IconChevronUp", "IconChevronDown", "IconChevronLeft", "IconChevronRight",
  "IconMenu", "IconDotsVertical", "IconDots", "IconFilter", "IconSort",
  "IconZoomIn", "IconZoomOut", "IconMaximize", "IconMinimize", "IconFullscreen",
  "IconCode", "IconTerminal",
  "IconMessage", "IconMessageCircle", "IconMessages", "IconBell", "IconBellRinging",
  "IconAlertCircle", "IconAlertTriangle", "IconInfoCircle", "IconHelp", "IconQuestionMark",
  "IconBulb", "IconLightbulb", "IconFlame", "IconBolt", "IconZap",
  "IconCloud", "IconCloudDownload", "IconCloudUpload", "IconDatabase", "IconServer",
  "IconCpu", "IconDevices", "IconDeviceDesktop", "IconDeviceMobile", "IconDeviceTablet",
  "IconHeadphones", "IconHeadset", "IconMicrophone", "IconVolume", "IconVolumeOff",
  "IconWifi", "IconSun", "IconMoon",
  "IconSchool", "IconBook", "IconBooks", "IconNotebook", "IconBackpack",
  "IconGraduationCap", "IconRobot", "IconBrain", "IconActivity", "IconPulse",
  "IconApi", "IconSparkles", "IconWand",
  // Tech brand icons
  "IconBrandPython", "IconBrandJavascript", "IconBrandTypescript", "IconBrandHtml5", "IconBrandCss3",
  "IconBrandReact", "IconBrandNextjs", "IconBrandNodejs", "IconBrandNpm", "IconBrandBun",
  "IconBrandTailwind", "IconBrandBootstrap", "IconBrandSass", "IconBrandVue", "IconBrandAngular",
  "IconBrandSvelte", "IconBrandDeno", "IconBrandRust", "IconBrandGolang", "IconBrandSwift",
  "IconBrandKotlin", "IconBrandPhp", "IconBrandLaravel", "IconBrandDjango", "IconBrandFlask",
  // AI & Cloud brands
  "IconBrandOpenai", "IconBrandAws", "IconBrandAzure", "IconBrandGoogleCloud",
  "IconBrandFirebase", "IconBrandVercel", "IconBrandCloudflare", "IconBrandDigitalocean",
  // Database brands
  "IconBrandMongodb", "IconBrandMysql", "IconBrandSupabase", "IconBrandPrisma",
  // Tools & DevOps brands
  "IconBrandGithub", "IconBrandGitlab", "IconBrandBitbucket", "IconBrandGit",
  "IconBrandDocker", "IconBrandKubernetes", "IconBrandTerraform",
  "IconBrandVscode", "IconBrandFigma", "IconBrandSketch", "IconBrandNotion",
  // Social & Communication brands
  "IconBrandLinkedin", "IconBrandTwitter", "IconBrandX", "IconBrandFacebook", "IconBrandInstagram",
  "IconBrandYoutube", "IconBrandTiktok", "IconBrandDiscord", "IconBrandSlack", "IconBrandZoom",
  "IconBrandTelegram", "IconBrandWhatsapp", "IconBrandSpotify", "IconBrandReddit",
  // Company brands
  "IconBrandGoogle", "IconBrandApple", "IconBrandMicrosoft", "IconBrandMeta",
  "IconBrandAmazon", "IconBrandNetflix", "IconBrandPaypal", "IconBrandStripe",
  "IconBrandShopify", "IconBrandWordpress", "IconBrandMedium",
];

// Type for icon components
type IconComponent = React.ComponentType<{
  className?: string;
  size?: number | string;
  width?: string;
  height?: string;
  color?: string;
  style?: React.CSSProperties;
}>;

/**
 * Normalize icon name to handle various formats:
 * - "rocket" -> "IconRocket" (for Tabler)
 * - "Rocket" -> "IconRocket" (for Tabler) or "Rocket" (for custom)
 * - "IconRocket" -> "IconRocket" (already normalized)
 * - "Rigobot" -> "Rigobot" (custom icon)
 */
function normalizeIconName(name: string): { normalized: string; isTabler: boolean } {
  if (!name) return { normalized: "", isTabler: false };
  
  // Check if it's a known custom icon first
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  if (CUSTOM_ICON_NAMES.includes(capitalizedName)) {
    return { normalized: capitalizedName, isTabler: false };
  }
  
  // For Tabler icons, ensure "Icon" prefix
  if (name.startsWith("Icon")) {
    return { normalized: name, isTabler: true };
  }
  
  // Capitalize and add Icon prefix for Tabler
  return { 
    normalized: `Icon${capitalizedName}`,
    isTabler: true 
  };
}

/**
 * Get an icon component by name.
 * Checks custom icons first, then falls back to Tabler.
 * 
 * @param name Icon name (e.g., "Rigobot", "rocket", "IconRocket")
 * @returns Icon component or null if not found
 */
export function getIcon(name: string): IconComponent | null {
  if (!name) return null;
  
  const { normalized, isTabler } = normalizeIconName(name);
  
  if (!isTabler) {
    // Try custom icon
    const customIcon = getCustomIcon(normalized);
    if (customIcon) return customIcon as IconComponent;
  }
  
  // Try Tabler icon
  const tablerIcon = (TablerIcons as unknown as Record<string, IconComponent>)[normalized];
  if (tablerIcon) return tablerIcon;
  
  // Last resort: try custom icon even for unknown names
  const fallbackCustom = getCustomIcon(name);
  if (fallbackCustom) return fallbackCustom as IconComponent;
  
  return null;
}

/**
 * Get all Tabler icon names dynamically from the library.
 * This provides access to ALL 5000+ Tabler icons.
 */
export function getAllTablerIconNames(): string[] {
  return Object.keys(TablerIcons).filter(
    (key) => key.startsWith("Icon") && key !== "Icon"
  );
}

/**
 * Get all available icon names for the picker.
 * Returns custom icons first, then ALL Tabler icons.
 */
export function getAllIconNames(): string[] {
  return [...CUSTOM_ICON_NAMES, ...getAllTablerIconNames()];
}

/**
 * Get display name for an icon (without "Icon" prefix for Tabler)
 */
export function getIconDisplayName(name: string): string {
  if (name.startsWith("Icon")) {
    return name.slice(4);
  }
  return name;
}

/**
 * Check if an icon name is a custom icon
 */
export function isCustomIcon(name: string): boolean {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return CUSTOM_ICON_NAMES.includes(capitalizedName);
}
