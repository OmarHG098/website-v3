import { useState, useCallback } from "react";
import { IconSpacingVertical, IconArrowUp, IconArrowDown, IconInfoCircle } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import type { Section, SectionLayout } from "@shared/schema";

interface SpacingControlPopoverProps {
  insertIndex: number;
  sections: Section[];
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  onSpacingChanged?: () => void;
}

const SPACING_PRESETS = [
  { label: "None", value: "none" },
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
  { label: "XL", value: "xl" },
];

const BACKGROUND_TOKENS = [
  { label: "Inherit", value: "", cssVar: "" },
  { label: "Background", value: "background", cssVar: "var(--background)" },
  { label: "Muted", value: "muted", cssVar: "var(--muted)" },
  { label: "Card", value: "card", cssVar: "var(--card)" },
  { label: "Accent", value: "accent", cssVar: "var(--accent)" },
  { label: "Primary", value: "primary", cssVar: "var(--primary)" },
  { label: "Secondary", value: "secondary", cssVar: "var(--secondary)" },
  { label: "Sidebar", value: "sidebar", cssVar: "var(--sidebar-background)" },
];

async function updateSectionField(
  contentType: string,
  slug: string,
  locale: string,
  sectionIndex: number,
  field: string,
  value: string
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

function parseLayoutValue(section: Section | undefined): { paddingY: string; marginY: string; background: string } {
  if (!section) return { paddingY: "", marginY: "", background: "" };
  const layout = section as SectionLayout;
  return {
    paddingY: layout.paddingY || "",
    marginY: layout.marginY || "",
    background: layout.background || "",
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

function BackgroundPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const isCustom = value && !BACKGROUND_TOKENS.some((t) => t.value === value);

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">Background</Label>
      <div className="flex flex-wrap items-center gap-1">
        {BACKGROUND_TOKENS.map((token) => (
          <button
            key={token.value}
            type="button"
            onClick={() => onChange(token.value)}
            className={`h-7 px-2 text-xs rounded-md border transition-all flex items-center gap-1.5 ${
              value === token.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            }`}
            data-testid={`background-token-${token.value || "inherit"}`}
          >
            {token.cssVar && (
              <span
                className="w-3 h-3 rounded-sm border border-border/50"
                style={{ background: `hsl(${token.cssVar})` }}
              />
            )}
            <span>{token.label}</span>
          </button>
        ))}
      </div>
      <Input
        type="text"
        placeholder="Custom (e.g., linear-gradient(...))"
        value={isCustom ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 text-xs px-2 mt-1"
        data-testid="background-custom"
      />
    </div>
  );
}

export function SpacingControlPopover({
  insertIndex,
  sections,
  contentType,
  slug,
  locale,
  onSpacingChanged,
}: SpacingControlPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const aboveIndex = insertIndex - 1;
  const belowIndex = insertIndex;
  const sectionAbove = aboveIndex >= 0 ? sections[aboveIndex] : undefined;
  const sectionBelow = belowIndex < sections.length ? sections[belowIndex] : undefined;

  const aboveLayout = parseLayoutValue(sectionAbove);
  const belowLayout = parseLayoutValue(sectionBelow);

  const [abovePaddingY, setAbovePaddingY] = useState(aboveLayout.paddingY);
  const [aboveMarginY, setAboveMarginY] = useState(aboveLayout.marginY);
  const [aboveBackground, setAboveBackground] = useState(aboveLayout.background);
  const [belowPaddingY, setBelowPaddingY] = useState(belowLayout.paddingY);
  const [belowMarginY, setBelowMarginY] = useState(belowLayout.marginY);
  const [belowBackground, setBelowBackground] = useState(belowLayout.background);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      const above = parseLayoutValue(sectionAbove);
      const below = parseLayoutValue(sectionBelow);
      setAbovePaddingY(above.paddingY);
      setAboveMarginY(above.marginY);
      setAboveBackground(above.background);
      setBelowPaddingY(below.paddingY);
      setBelowMarginY(below.marginY);
      setBelowBackground(below.background);
    }
  }, [sectionAbove, sectionBelow]);

  const handleApply = useCallback(async () => {
    if (!contentType || !slug || !locale) return;

    setIsSaving(true);
    const operations: Promise<{ success: boolean; error?: string }>[] = [];

    if (sectionAbove) {
      if (abovePaddingY !== aboveLayout.paddingY) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "paddingY", abovePaddingY));
      }
      if (aboveMarginY !== aboveLayout.marginY) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "marginY", aboveMarginY));
      }
      if (aboveBackground !== aboveLayout.background) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "background", aboveBackground));
      }
    }

    if (sectionBelow) {
      if (belowPaddingY !== belowLayout.paddingY) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "paddingY", belowPaddingY));
      }
      if (belowMarginY !== belowLayout.marginY) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "marginY", belowMarginY));
      }
      if (belowBackground !== belowLayout.background) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "background", belowBackground));
      }
    }

    try {
      const results = await Promise.all(operations);
      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        toast({
          title: "Failed to update layout",
          description: failed[0].error,
          variant: "destructive",
        });
      } else if (operations.length > 0) {
        toast({ title: "Layout updated" });
        onSpacingChanged?.();
      }
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error updating layout",
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
    abovePaddingY,
    aboveMarginY,
    aboveBackground,
    belowPaddingY,
    belowMarginY,
    belowBackground,
    aboveLayout,
    belowLayout,
    toast,
    onSpacingChanged,
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
          <span className="text-xs font-medium">Layout</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="center">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Section Layout</h4>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconInfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                <p className="mb-1"><strong>Padding:</strong> Space inside section (may inset content)</p>
                <p className="mb-1"><strong>Margin:</strong> Space outside section (between sections)</p>
                <p><strong>Background:</strong> Section background color or gradient</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {sectionAbove && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <IconArrowUp className="h-3.5 w-3.5" />
                <span>Section Above</span>
              </div>
              <BackgroundPicker
                value={aboveBackground}
                onChange={setAboveBackground}
              />
              <SpacingPresetButtons
                label="Padding Bottom"
                value={abovePaddingY}
                onChange={setAbovePaddingY}
              />
              <SpacingPresetButtons
                label="Margin Bottom"
                value={aboveMarginY}
                onChange={setAboveMarginY}
              />
            </div>
          )}

          {sectionBelow && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <IconArrowDown className="h-3.5 w-3.5" />
                <span>Section Below</span>
              </div>
              <BackgroundPicker
                value={belowBackground}
                onChange={setBelowBackground}
              />
              <SpacingPresetButtons
                label="Padding Top"
                value={belowPaddingY}
                onChange={setBelowPaddingY}
              />
              <SpacingPresetButtons
                label="Margin Top"
                value={belowMarginY}
                onChange={setBelowMarginY}
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
