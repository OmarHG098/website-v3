import { useCallback, useState, useEffect, useMemo } from "react";
import { IconX, IconDeviceFloppy, IconLoader2, IconCode, IconSettings } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { refreshContent } from "@/lib/contentRefresh";
import type { Section } from "@shared/schema";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import * as yamlParser from "js-yaml";

interface SectionEditorPanelProps {
  section: Section;
  sectionIndex: number;
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  variant?: string;
  version?: number;
  onUpdate: (updatedSection: Section) => void;
  onClose: () => void;
  onPreviewChange?: (previewSection: Section | null) => void;
}

const BACKGROUND_TOKENS = [
  { label: "None", value: "", cssVar: "" },
  { label: "Background", value: "background", cssVar: "var(--background)" },
  { label: "Muted", value: "muted", cssVar: "var(--muted)" },
  { label: "Card", value: "card", cssVar: "var(--card)" },
  { label: "Accent", value: "accent", cssVar: "var(--accent)" },
  { label: "Primary", value: "primary", cssVar: "var(--primary)" },
  { label: "Secondary", value: "secondary", cssVar: "var(--secondary)" },
  { label: "Sidebar", value: "sidebar", cssVar: "var(--sidebar-background)" },
];

interface BackgroundPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const isCustom = value && !BACKGROUND_TOKENS.some((t) => t.value === value);
  const [customValue, setCustomValue] = useState(isCustom ? value : "");

  // Sync custom value when external value changes
  useEffect(() => {
    const isNowCustom = value && !BACKGROUND_TOKENS.some((t) => t.value === value);
    if (isNowCustom) {
      setCustomValue(value);
    } else {
      setCustomValue("");
    }
  }, [value]);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Background Color</Label>
      <div className="grid grid-cols-4 gap-2">
        {BACKGROUND_TOKENS.map((token) => (
          <button
            key={token.value}
            type="button"
            onClick={() => onChange(token.value)}
            className={`h-12 rounded-md border-2 transition-all flex flex-col items-center justify-center gap-1 ${
              value === token.value
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
            data-testid={`props-background-${token.value || "none"}`}
          >
            {token.cssVar ? (
              <span
                className="w-6 h-6 rounded border border-border/50"
                style={{ background: `hsl(${token.cssVar})` }}
              />
            ) : (
              <span className="w-6 h-6 rounded border border-dashed border-border/50 bg-transparent" />
            )}
            <span className="text-[10px] text-muted-foreground">{token.label}</span>
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Custom CSS Value</Label>
        <Input
          type="text"
          placeholder="e.g., #ff5500, linear-gradient(...)"
          value={customValue}
          onChange={(e) => {
            setCustomValue(e.target.value);
            if (e.target.value) {
              onChange(e.target.value);
            }
          }}
          className="text-sm"
          data-testid="props-background-custom"
        />
        <p className="text-xs text-muted-foreground">
          Enter any valid CSS color or gradient value
        </p>
      </div>
    </div>
  );
}

export function SectionEditorPanel({
  section,
  sectionIndex,
  contentType,
  slug,
  locale,
  variant,
  version,
  onUpdate,
  onClose,
  onPreviewChange,
}: SectionEditorPanelProps) {
  const { toast } = useToast();
  const [yamlContent, setYamlContent] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("code");

  // Parse current YAML to extract props
  const parsedSection = useMemo(() => {
    try {
      return yamlParser.load(yamlContent) as Record<string, unknown> | null;
    } catch {
      return null;
    }
  }, [yamlContent]);

  const currentBackground = (parsedSection?.background as string) || "";

  // Initialize YAML content from section
  useEffect(() => {
    try {
      const yamlStr = yamlParser.dump(section, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
      });
      setYamlContent(yamlStr);
      setHasChanges(false);
    } catch (error) {
      console.error("Error converting section to YAML:", error);
    }
  }, [section]);

  const handleYamlChange = useCallback((value: string) => {
    setYamlContent(value);
    setHasChanges(true);

    // Validate YAML on change and trigger live preview
    try {
      const parsed = yamlParser.load(value) as Section;
      setParseError(null);

      // Trigger live preview if valid section
      if (parsed && typeof parsed === "object" && onPreviewChange) {
        onPreviewChange(parsed);
      }
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
    }
  }, [onPreviewChange]);

  // Update a specific property in the YAML
  const updateProperty = useCallback((key: string, value: string) => {
    try {
      const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object") return;

      if (value) {
        parsed[key] = value;
      } else {
        delete parsed[key];
      }

      const newYaml = yamlParser.dump(parsed, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
      });

      setYamlContent(newYaml);
      setHasChanges(true);
      setParseError(null);

      // Trigger live preview
      if (onPreviewChange) {
        onPreviewChange(parsed as Section);
      }
    } catch (error) {
      console.error("Error updating property:", error);
    }
  }, [yamlContent, onPreviewChange]);

  // Shared save logic - returns true on success
  const saveToServer = useCallback(async (): Promise<boolean> => {
    if (!contentType || !slug || !locale) {
      return false;
    }

    let parsed: Section;
    try {
      parsed = yamlParser.load(yamlContent) as Section;
      if (!parsed || typeof parsed !== "object") {
        setParseError("Invalid section structure");
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
      return false;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const token = getDebugToken();
      const response = await fetch("/api/content/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Token ${token}` } : {}),
        },
        body: JSON.stringify({
          contentType,
          slug,
          locale,
          variant,
          version,
          operations: [{
            action: "update_section",
            index: sectionIndex,
            section: parsed as Record<string, unknown>,
          }],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("[SectionEditorPanel] Save successful, refreshing content...", { contentType, slug, locale });

        // Use server-confirmed section data if available, fallback to local parsed
        const confirmedSection = result.updatedSections?.[sectionIndex] as Section | undefined;
        if (!confirmedSection) {
          console.warn("Server did not return updated section, using local parsed data");
        }
        onUpdate(confirmedSection || parsed);
        setHasChanges(false);

        // Refresh content to update the page
        console.log("[SectionEditorPanel] Calling refreshContent...");
        await refreshContent(contentType, slug, locale);
        console.log("[SectionEditorPanel] refreshContent completed");
        return true;
      } else {
        const error = await response.json();
        setSaveError(error.error || "Failed to save changes");
        return false;
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      setSaveError(error instanceof Error ? error.message : "Network error");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [yamlContent, sectionIndex, contentType, slug, locale, variant, version, onUpdate]);

  // Save without closing editor
  const handleSave = useCallback(async () => {
    const success = await saveToServer();
    if (success) {
      toast({
        title: "Changes saved",
        description: "Your section has been updated successfully.",
      });
    }
  }, [saveToServer, toast]);

  // Handle close with unsaved changes warning
  const handleClose = useCallback(() => {
    if (hasChanges) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to close without saving?");
      if (!confirmed) return;
    }
    // Clear live preview when closing
    if (onPreviewChange) {
      onPreviewChange(null);
    }
    onClose();
  }, [hasChanges, onClose, onPreviewChange]);

  const sectionType = (section as { type: string }).type || "unknown";

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-background border-l shadow-xl z-[100] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold">Edit Section</h2>
          <p className="text-sm text-muted-foreground">
            {sectionType} (Section {sectionIndex + 1})
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClose}
          data-testid="button-close-editor"
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-2 grid w-auto grid-cols-2">
          <TabsTrigger value="code" className="gap-1.5" data-testid="tab-code">
            <IconCode className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="props" className="gap-1.5" data-testid="tab-props">
            <IconSettings className="h-4 w-4" />
            Props
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden">
          <div className="flex-1 min-h-0">
            <CodeMirror
              value={yamlContent}
              height="100%"
              extensions={[yaml()]}
              theme={oneDark}
              onChange={handleYamlChange}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
              className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
            />
          </div>
        </TabsContent>

        <TabsContent value="props" className="flex-1 overflow-auto p-4 mt-0 data-[state=inactive]:hidden">
          <div className="space-y-6">
            <BackgroundPicker
              value={currentBackground}
              onChange={(value) => updateProperty("background", value)}
            />

            {/* Placeholder for future props */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                More properties coming soon: spacing, visibility, animations...
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {parseError && (
        <div className="p-2 bg-destructive/10 text-destructive text-sm border-t">
          {parseError}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t bg-muted/30">
        <div className="text-sm">
          {saveError ? (
            <span className="text-destructive">{saveError}</span>
          ) : hasChanges ? (
            <span className="text-muted-foreground">Unsaved changes</span>
          ) : (
            <span className="text-muted-foreground">No changes</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            data-testid="button-cancel-edit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!!parseError || isSaving}
            data-testid="button-save-section"
          >
            {isSaving ? (
              <>
                <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
