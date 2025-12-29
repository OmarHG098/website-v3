import { useState, useCallback } from "react";
import { IconSpacingVertical, IconArrowUp, IconArrowDown, IconInfoCircle } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { emitContentUpdated } from "@/lib/contentEvents";
import type { Section, SectionLayout } from "@shared/schema";

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

function parseSpacingValue(section: Section | undefined): { paddingY: string; marginY: string } {
  if (!section) return { paddingY: "", marginY: "" };
  const layout = section as SectionLayout;
  return {
    paddingY: layout.paddingY || "",
    marginY: layout.marginY || "",
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

export function SpacingControlPopover({
  insertIndex,
  sections,
  contentType,
  slug,
  locale,
}: SpacingControlPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const aboveIndex = insertIndex - 1;
  const belowIndex = insertIndex;
  const sectionAbove = aboveIndex >= 0 ? sections[aboveIndex] : undefined;
  const sectionBelow = belowIndex < sections.length ? sections[belowIndex] : undefined;

  const aboveSpacing = parseSpacingValue(sectionAbove);
  const belowSpacing = parseSpacingValue(sectionBelow);

  const [abovePaddingY, setAbovePaddingY] = useState(aboveSpacing.paddingY);
  const [aboveMarginY, setAboveMarginY] = useState(aboveSpacing.marginY);
  const [belowPaddingY, setBelowPaddingY] = useState(belowSpacing.paddingY);
  const [belowMarginY, setBelowMarginY] = useState(belowSpacing.marginY);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      const above = parseSpacingValue(sectionAbove);
      const below = parseSpacingValue(sectionBelow);
      setAbovePaddingY(above.paddingY);
      setAboveMarginY(above.marginY);
      setBelowPaddingY(below.paddingY);
      setBelowMarginY(below.marginY);
    }
  }, [sectionAbove, sectionBelow]);

  const handleApply = useCallback(async () => {
    if (!contentType || !slug || !locale) return;

    setIsSaving(true);
    const operations: Promise<{ success: boolean; error?: string }>[] = [];

    if (sectionAbove) {
      if (abovePaddingY !== aboveSpacing.paddingY) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "paddingY", abovePaddingY));
      }
      if (aboveMarginY !== aboveSpacing.marginY) {
        operations.push(updateSectionField(contentType, slug, locale, aboveIndex, "marginY", aboveMarginY));
      }
    }

    if (sectionBelow) {
      if (belowPaddingY !== belowSpacing.paddingY) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "paddingY", belowPaddingY));
      }
      if (belowMarginY !== belowSpacing.marginY) {
        operations.push(updateSectionField(contentType, slug, locale, belowIndex, "marginY", belowMarginY));
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
        // Emit event to trigger page refresh
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
    abovePaddingY,
    aboveMarginY,
    belowPaddingY,
    belowMarginY,
    aboveSpacing,
    belowSpacing,
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
            <Tooltip>
              <TooltipTrigger asChild>
                <IconInfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                <p className="mb-1"><strong>Padding:</strong> Adds space inside the section (may break full-bleed backgrounds)</p>
                <p><strong>Margin:</strong> Adds space outside the section (preserves backgrounds)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {sectionAbove && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <IconArrowUp className="h-3.5 w-3.5" />
                <span>Section Above (Bottom)</span>
              </div>
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
                <span>Section Below (Top)</span>
              </div>
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
