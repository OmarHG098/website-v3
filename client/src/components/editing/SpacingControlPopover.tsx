import { useState, useCallback } from "react";
import { IconSpacingVertical, IconArrowUp, IconArrowDown, IconInfoCircle, IconDeviceMobile, IconDeviceDesktop } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { emitContentUpdated } from "@/lib/contentEvents";
import type { Section, SectionLayout, ResponsiveSpacing } from "@shared/schema";

interface SpacingControlPopoverProps {
  insertIndex: number;
  sections: Section[];
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
}

const SPACING_PRESETS = [
  { label: "None", value: "none" },
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
  { label: "XL", value: "xl" },
];

type Breakpoint = "mobile" | "desktop";

interface ResponsiveSpacingValues {
  mobile: { top: string; bottom: string };
  desktop: { top: string; bottom: string };
}

async function updateSectionField(
  contentType: string,
  slug: string,
  locale: string,
  sectionIndex: number,
  field: string,
  value: ResponsiveSpacing
): Promise<{ success: boolean; error?: string }> {
  const token = getDebugToken();
  const response = await fetch("/api/content/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify({
      contentType,
      slug,
      locale,
      operations: [
        {
          action: "update_field",
          path: `sections.${sectionIndex}.${field}`,
          value,
        },
      ],
    }),
  });
  return response.json();
}

function parseTopBottom(value: string | undefined): { top: string; bottom: string } {
  if (!value) return { top: "none", bottom: "none" };
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return { top: parts[0], bottom: parts[0] };
  }
  return { top: parts[0], bottom: parts[1] };
}

function combineTopBottom(top: string, bottom: string): string {
  const t = top || "none";
  const b = bottom || "none";
  if (t === b) return t;
  return `${t} ${b}`;
}

function parseResponsiveSpacing(value: ResponsiveSpacing | undefined): ResponsiveSpacingValues {
  if (!value) {
    return {
      mobile: { top: "none", bottom: "none" },
      desktop: { top: "none", bottom: "none" },
    };
  }
  // Handle inheritance: if one is missing, use the other's value
  const mobileValue = value.mobile ?? value.desktop ?? "none";
  const desktopValue = value.desktop ?? value.mobile ?? "none";
  return {
    mobile: parseTopBottom(mobileValue),
    desktop: parseTopBottom(desktopValue),
  };
}

function parseSpacingValue(section: Section | undefined): {
  padding: ResponsiveSpacingValues;
  margin: ResponsiveSpacingValues;
} {
  if (!section) {
    return {
      padding: { mobile: { top: "none", bottom: "none" }, desktop: { top: "none", bottom: "none" } },
      margin: { mobile: { top: "none", bottom: "none" }, desktop: { top: "none", bottom: "none" } },
    };
  }
  const layout = section as SectionLayout;
  return {
    padding: parseResponsiveSpacing(layout.paddingY),
    margin: parseResponsiveSpacing(layout.marginY),
  };
}

function SpacingPresetButtons({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const isCustom = value && !SPACING_PRESETS.some((p) => p.value === value);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-1">
        {SPACING_PRESETS.map((preset) => (
          <Button
            key={preset.value}
            variant={value === preset.value ? "default" : "outline"}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onChange(preset.value)}
            data-testid={`spacing-preset-${label.toLowerCase().replace(/\s/g, "-")}-${preset.value}`}
          >
            {preset.label}
          </Button>
        ))}
        <Input
          type="text"
          placeholder="Custom"
          value={isCustom ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-16 text-xs px-2"
          data-testid={`spacing-custom-${label.toLowerCase().replace(/\s/g, "-")}`}
        />
      </div>
    </div>
  );
}

function BreakpointToggle({
  activeBreakpoint,
  onChange,
}: {
  activeBreakpoint: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
}) {
  return (
    <div className="flex rounded-md overflow-hidden border">
      <button
        onClick={() => onChange("mobile")}
        className={`flex items-center justify-center p-2 transition-colors ${
          activeBreakpoint === "mobile"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
        data-testid="toggle-breakpoint-mobile"
      >
        <IconDeviceMobile className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange("desktop")}
        className={`flex items-center justify-center p-2 transition-colors ${
          activeBreakpoint === "desktop"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
        data-testid="toggle-breakpoint-desktop"
      >
        <IconDeviceDesktop className="h-4 w-4" />
      </button>
    </div>
  );
}

// Check if mobile and desktop values are equal for a position
function areBreakpointsEqual(values: ResponsiveSpacingValues, position: "top" | "bottom"): boolean {
  return values.mobile[position] === values.desktop[position];
}

export function SpacingControlPopover({
  insertIndex,
  sections,
  contentType,
  slug,
  locale,
}: SpacingControlPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>("desktop");
  const { toast } = useToast();

  const aboveIndex = insertIndex - 1;
  const belowIndex = insertIndex;
  const sectionAbove = aboveIndex >= 0 ? sections[aboveIndex] : undefined;
  const sectionBelow = belowIndex < sections.length ? sections[belowIndex] : undefined;

  const aboveInitial = parseSpacingValue(sectionAbove);
  const belowInitial = parseSpacingValue(sectionBelow);

  const [abovePadding, setAbovePadding] = useState<ResponsiveSpacingValues>(aboveInitial.padding);
  const [aboveMargin, setAboveMargin] = useState<ResponsiveSpacingValues>(aboveInitial.margin);
  const [belowPadding, setBelowPadding] = useState<ResponsiveSpacingValues>(belowInitial.padding);
  const [belowMargin, setBelowMargin] = useState<ResponsiveSpacingValues>(belowInitial.margin);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      const above = parseSpacingValue(sectionAbove);
      const below = parseSpacingValue(sectionBelow);
      setAbovePadding(above.padding);
      setAboveMargin(above.margin);
      setBelowPadding(below.padding);
      setBelowMargin(below.margin);
    }
  }, [sectionAbove, sectionBelow]);

  // Update a spacing value
  // - Editing desktop: syncs to mobile if they currently match (inheritance behavior)
  // - Editing mobile: only updates mobile (explicit override, breaks sync)
  const updateResponsiveValue = (
    setter: React.Dispatch<React.SetStateAction<ResponsiveSpacingValues>>,
    breakpoint: Breakpoint,
    position: "top" | "bottom",
    value: string
  ) => {
    setter(prev => {
      // Editing desktop: sync to mobile if they're currently equal
      if (breakpoint === "desktop" && areBreakpointsEqual(prev, position)) {
        return {
          mobile: { ...prev.mobile, [position]: value },
          desktop: { ...prev.desktop, [position]: value },
        };
      }
      // Editing mobile (or breakpoints differ): only update the active breakpoint
      return {
        ...prev,
        [breakpoint]: {
          ...prev[breakpoint],
          [position]: value,
        },
      };
    });
  };

  // Convert to ResponsiveSpacing for saving
  // If both breakpoints are identical, only save one (desktop) so the other inherits
  const toResponsiveSpacing = (values: ResponsiveSpacingValues): ResponsiveSpacing => {
    const mobileStr = combineTopBottom(values.mobile.top, values.mobile.bottom);
    const desktopStr = combineTopBottom(values.desktop.top, values.desktop.bottom);
    
    // If identical, only save desktop so mobile inherits
    if (mobileStr === desktopStr) {
      return { desktop: desktopStr };
    }
    
    return {
      mobile: mobileStr,
      desktop: desktopStr,
    };
  };

  const hasChanged = (original: ResponsiveSpacingValues, current: ResponsiveSpacingValues): boolean => {
    return (
      original.mobile.top !== current.mobile.top ||
      original.mobile.bottom !== current.mobile.bottom ||
      original.desktop.top !== current.desktop.top ||
      original.desktop.bottom !== current.desktop.bottom
    );
  };

  const handleApply = useCallback(async () => {
    if (!contentType || !slug || !locale) return;

    setIsSaving(true);
    const operations: Promise<{ success: boolean; error?: string }>[] = [];

    if (sectionAbove) {
      const originalAbove = parseSpacingValue(sectionAbove);
      if (hasChanged(originalAbove.padding, abovePadding)) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "paddingY", toResponsiveSpacing(abovePadding)));
      }
      if (hasChanged(originalAbove.margin, aboveMargin)) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "marginY", toResponsiveSpacing(aboveMargin)));
      }
    }

    if (sectionBelow) {
      const originalBelow = parseSpacingValue(sectionBelow);
      if (hasChanged(originalBelow.padding, belowPadding)) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "paddingY", toResponsiveSpacing(belowPadding)));
      }
      if (hasChanged(originalBelow.margin, belowMargin)) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "marginY", toResponsiveSpacing(belowMargin)));
      }
    }

    try {
      const results = await Promise.all(operations);
      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        toast({
          title: "Failed to update spacing",
          description: failed[0].error,
          variant: "destructive",
        });
      } else if (operations.length > 0) {
        toast({ title: "Spacing updated" });
        emitContentUpdated({ contentType, slug, locale });
      }
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error updating spacing",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    contentType,
    slug,
    locale,
    sectionAbove,
    sectionBelow,
    aboveIndex,
    belowIndex,
    abovePadding,
    aboveMargin,
    belowPadding,
    belowMargin,
    toast,
  ]);

  if (!sectionAbove && !sectionBelow) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-primary text-primary bg-background shadow-sm hover:bg-primary/10 hover:px-4 hover:py-2 hover:gap-2 transition-all duration-200"
          data-testid={`button-spacing-${insertIndex}`}
        >
          <IconSpacingVertical className="h-4 w-4" />
          <span className="text-xs font-medium">Spacing</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="center">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Adjust Spacing</h4>
            <div className="flex items-center gap-2">
              <BreakpointToggle
                activeBreakpoint={activeBreakpoint}
                onChange={setActiveBreakpoint}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconInfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-xs">
                  <p className="mb-1"><strong>Padding:</strong> Adds space inside the section (may break full-bleed backgrounds)</p>
                  <p className="mb-1"><strong>Margin:</strong> Adds space outside the section (preserves backgrounds)</p>
                  <p><strong>Breakpoint:</strong> Mobile applies below 768px, Desktop at 768px+</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {sectionAbove && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <IconArrowUp className="h-3.5 w-3.5" />
                <span>Section Above ({sectionAbove.type})</span>
              </div>
              <SpacingPresetButtons
                label="Padding Bottom"
                value={abovePadding[activeBreakpoint].bottom}
                onChange={(val) => updateResponsiveValue(setAbovePadding, activeBreakpoint, "bottom", val)}
              />
              <SpacingPresetButtons
                label="Margin Bottom"
                value={aboveMargin[activeBreakpoint].bottom}
                onChange={(val) => updateResponsiveValue(setAboveMargin, activeBreakpoint, "bottom", val)}
              />
            </div>
          )}

          {sectionBelow && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <IconArrowDown className="h-3.5 w-3.5" />
                <span>Section Below ({sectionBelow.type})</span>
              </div>
              <SpacingPresetButtons
                label="Padding Top"
                value={belowPadding[activeBreakpoint].top}
                onChange={(val) => updateResponsiveValue(setBelowPadding, activeBreakpoint, "top", val)}
              />
              <SpacingPresetButtons
                label="Margin Top"
                value={belowMargin[activeBreakpoint].top}
                onChange={(val) => updateResponsiveValue(setBelowMargin, activeBreakpoint, "top", val)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isSaving}
              data-testid={`button-apply-spacing-${insertIndex}`}
            >
              {isSaving ? "Saving..." : "Apply"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
