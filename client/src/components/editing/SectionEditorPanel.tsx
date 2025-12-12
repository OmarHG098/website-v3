import { useCallback, useState, useEffect } from "react";
import { IconX, IconDeviceFloppy, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditMode } from "@/contexts/EditModeContext";
import type { Section } from "@shared/schema";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import * as yamlParser from "js-yaml";

interface SectionEditorPanelProps {
  section: Section;
  sectionIndex: number;
  contentType?: "program" | "landing" | "location";
  slug?: string;
  locale?: string;
  onUpdate: (updatedSection: Section) => void;
  onClose: () => void;
}

export function SectionEditorPanel({
  section,
  sectionIndex,
  contentType,
  slug,
  locale,
  onUpdate,
  onClose,
}: SectionEditorPanelProps) {
  const editModeContext = useEditMode();
  const { addPendingChange, saveChanges, isSaving } = editModeContext || { 
    addPendingChange: () => {}, 
    saveChanges: async () => false, 
    isSaving: false 
  };
  const [yamlContent, setYamlContent] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
    
    // Validate YAML on change
    try {
      yamlParser.load(value);
      setParseError(null);
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
    }
  }, []);

  const handleApply = useCallback(() => {
    try {
      const parsed = yamlParser.load(yamlContent) as Section;
      if (!parsed || typeof parsed !== "object") {
        setParseError("Invalid section structure");
        return;
      }
      
      // Add pending change if we have content info
      if (contentType && slug && locale) {
        const pageKey = `${contentType}:${slug}:${locale}`;
        addPendingChange(pageKey, {
          action: "update_section",
          index: sectionIndex,
          section: parsed as Record<string, unknown>,
        });
      }
      
      // Update local state
      onUpdate(parsed);
      setHasChanges(false);
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
    }
  }, [yamlContent, sectionIndex, contentType, slug, locale, addPendingChange, onUpdate]);

  const handleSave = useCallback(async () => {
    // First apply any pending changes
    if (hasChanges) {
      handleApply();
    }
    
    // If no content info, just close (preview only mode)
    if (!contentType || !slug || !locale) {
      onClose();
      return;
    }
    
    // Then save to server
    const pageKey = `${contentType}:${slug}:${locale}`;
    const success = await saveChanges(pageKey, contentType, slug, locale);
    
    if (success) {
      onClose();
    }
  }, [hasChanges, handleApply, saveChanges, contentType, slug, locale, onClose]);

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
          onClick={onClose}
          data-testid="button-close-editor"
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="rounded-md overflow-hidden border">
            <CodeMirror
              value={yamlContent}
              height="400px"
              extensions={[yaml()]}
              theme={oneDark}
              onChange={handleYamlChange}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
            />
          </div>
          
          {parseError && (
            <div className="mt-2 p-2 bg-destructive/10 text-destructive text-sm rounded">
              {parseError}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t bg-muted/30">
        <div className="text-sm text-muted-foreground">
          {hasChanges ? "Unsaved changes" : "No changes"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleApply}
            disabled={!!parseError || !hasChanges}
            data-testid="button-apply-changes"
          >
            Apply
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
