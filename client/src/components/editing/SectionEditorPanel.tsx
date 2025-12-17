import { useCallback, useState, useEffect } from "react";
import { IconX, IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { queryClient } from "@/lib/queryClient";
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
        
        // Use server-confirmed section data if available, fallback to local parsed
        const confirmedSection = result.updatedSections?.[sectionIndex] as Section | undefined;
        if (!confirmedSection) {
          console.warn("Server did not return updated section, using local parsed data");
        }
        onUpdate(confirmedSection || parsed);
        setHasChanges(false);
        
        // Still invalidate queries to ensure cache consistency
        const apiPath = contentType === "program" 
          ? "/api/career-programs" 
          : contentType === "landing" 
            ? "/api/landings" 
            : "/api/locations";
        
        await queryClient.invalidateQueries({ queryKey: [apiPath, slug] });
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
  }, [yamlContent, sectionIndex, contentType, slug, locale, onUpdate]);

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
      {/* Editor */}
      <div className="flex-1 flex flex-col min-h-0">
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
        
        {parseError && (
          <div className="p-2 bg-destructive/10 text-destructive text-sm border-t">
            {parseError}
          </div>
        )}
      </div>
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
