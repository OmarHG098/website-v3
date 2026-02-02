import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  IconX,
  IconDeviceFloppy,
  IconLoader2,
  IconCode,
  IconSettings,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDevices,
  IconCheck,
  IconAlertTriangle,
  IconPlus,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconPhoto,
  IconChevronDown,
  IconTrash,
} from "@tabler/icons-react";
import { IconQuestionMark } from "@tabler/icons-react";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { editContent } from "@/lib/contentApi";
import { emitContentUpdated } from "@/lib/contentEvents";
import {
  parseEditorType,
  type ColorPickerVariant,
  type EditorType,
} from "@/lib/field-editor-registry";
import { IconPickerModal } from "./IconPickerModal";
import { RelatedFeaturesPicker } from "./RelatedFeaturesPicker";
import type { Section, ImageRegistry } from "@shared/schema";
import { IconSearch } from "@tabler/icons-react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import * as yamlParser from "js-yaml";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { usePageHistoryOptional } from "@/contexts/PageHistoryContext";

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
  allSections?: Section[];
}

interface ShowOnPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function ShowOnPicker({ value, onChange }: ShowOnPickerProps) {
  const options = [
    { id: "all", label: "Both", icon: IconDevices },
    { id: "desktop", label: "Desktop", icon: IconDeviceDesktop },
    { id: "mobile", label: "Mobile", icon: IconDeviceMobile },
  ];

  const currentValue = value || "all";

  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-sm font-medium whitespace-nowrap">Show on</Label>
      <div className="flex rounded-md border border-border overflow-hidden">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = currentValue === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id === "all" ? "" : option.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              } ${option.id !== "all" ? "border-l border-border" : ""}`}
              data-testid={`props-showon-${option.id}`}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface VariantPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  label?: string;
}

function VariantPicker({ value, onChange, options, label = "Variant" }: VariantPickerProps) {
  const currentValue = value || options[0]?.id || "";

  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-sm font-medium whitespace-nowrap">{label}</Label>
      <div className="flex rounded-md border border-border overflow-hidden">
        {options.map((option, index) => {
          const isSelected = currentValue === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              } ${index !== 0 ? "border-l border-border" : ""}`}
              data-testid={`props-variant-${option.id}`}
            >
              <span>{option.label}</span>
            </button>
          );
        })}
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
  allSections,
}: SectionEditorPanelProps) {
  const { toast } = useToast();
  const [yamlContent, setYamlContent] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("code");

  // Icon picker state
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerTarget, setIconPickerTarget] = useState<{
    arrayField: string;
    index: number;
    field: string;
    label: string;
    currentIcon: string;
  } | null>(null);

  // Image picker modal state
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<{
    // For array fields
    arrayPath?: string;
    index?: number;
    srcField?: string;
    // For simple fields
    fieldPath?: string;
    label?: string;
    // Common
    currentSrc: string;
    currentAlt: string;
    // Optional tag filter (e.g., "logo" to show only logos)
    tagFilter?: string;
  } | null>(null);
  const [imageGallerySearch, setImageGallerySearch] = useState("");
  const [visibleImageCount, setVisibleImageCount] = useState(48);

  const handleUndoRedoRestore = useCallback((content: string) => {
    setYamlContent(content);
    setHasChanges(true);
    try {
      const parsed = yamlParser.load(content) as Section;
      setParseError(null);
      if (parsed && typeof parsed === "object" && onPreviewChange) {
        onPreviewChange(parsed);
      }
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
    }
  }, [onPreviewChange]);

  const { pushState: pushUndoState, canUndo, canRedo, undo, redo, clear: clearUndoHistory } = useUndoRedo(
    yamlContent,
    handleUndoRedoRestore,
    { enableKeyboardShortcuts: true }
  );
  
  const pageHistory = usePageHistoryOptional();

  // Store initial state when section loads for undo capability
  const initialYamlRef = useRef<string | null>(null);
  
  // Clear undo history and store initial state when section changes
  useEffect(() => {
    clearUndoHistory();
    // Store the initial YAML so we can undo back to it
    try {
      const yamlStr = yamlParser.dump(section, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
      });
      initialYamlRef.current = yamlStr;
    } catch {
      initialYamlRef.current = null;
    }
  }, [sectionIndex, section, clearUndoHistory]);

  // Fetch image registry for gallery picker
  const { data: imageRegistry } = useQuery<ImageRegistry>({
    queryKey: ["/api/image-registry"],
  });

  // Filter and sort gallery images by usage count (most used first)
  const filteredGalleryImages = useMemo(() => {
    if (!imageRegistry?.images) return [];
    const searchLower = imageGallerySearch.toLowerCase();
    const tagFilter = imagePickerTarget?.tagFilter?.toLowerCase();
    return Object.entries(imageRegistry.images)
      .filter(([id, img]) => {
        // Apply tag filter first (e.g., "logo" to show only logos)
        if (tagFilter && !img.tags?.some((tag) => tag.toLowerCase() === tagFilter)) {
          return false;
        }
        if (!searchLower) return true;
        return (
          id.toLowerCase().includes(searchLower) ||
          img.alt.toLowerCase().includes(searchLower) ||
          img.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => (b[1].usage_count ?? 0) - (a[1].usage_count ?? 0));
  }, [imageRegistry, imageGallerySearch, imagePickerTarget?.tagFilter]);

  // Reset visible count when search changes or modal opens
  useEffect(() => {
    setVisibleImageCount(48);
  }, [imageGallerySearch, imagePickerOpen]);

  // Parse current YAML to extract props
  const parsedSection = useMemo(() => {
    try {
      return yamlParser.load(yamlContent) as Record<string, unknown> | null;
    } catch {
      return null;
    }
  }, [yamlContent]);

  const currentBackground = (parsedSection?.background as string) || "";
  const currentShowOn = (parsedSection?.showOn as string) || "";

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

  const handleYamlChange = useCallback(
    (value: string) => {
      // Save the initial state on first edit so user can undo back to it
      if (!hasChanges && initialYamlRef.current && yamlContent !== value) {
        pushUndoState(initialYamlRef.current);
      }
      
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
    },
    [onPreviewChange, hasChanges, yamlContent, pushUndoState],
  );

  // Update a specific property in the YAML
  const updateProperty = useCallback(
    (key: string, value: string) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        // Handle nested paths like "left.image" or "media.src"
        const pathParts = key.split(".");
        if (pathParts.length === 1) {
          // Simple key
          if (value) {
            parsed[key] = value;
          } else {
            delete parsed[key];
          }
        } else {
          // Nested path - traverse and set
          let current: Record<string, unknown> = parsed;
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i];
            if (!current[part] || typeof current[part] !== "object") {
              current[part] = {};
            }
            current = current[part] as Record<string, unknown>;
          }
          const finalKey = pathParts[pathParts.length - 1];
          if (value) {
            current[finalKey] = value;
          } else {
            delete current[finalKey];
          }
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
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Update an array property in the YAML (e.g., related_features)
  // For related_features, insert after title to maintain YAML structure
  const updateArrayProperty = useCallback(
    (key: string, value: string[]) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        // Build ordered result with related_features after title
        const buildOrderedResult = (
          obj: Record<string, unknown>,
          keyToInsert: string,
          valueToInsert: string[]
        ): Record<string, unknown> => {
          const result: Record<string, unknown> = {};
          let inserted = false;

          for (const [k, v] of Object.entries(obj)) {
            if (k === keyToInsert) continue; // Skip - we'll insert in correct position
            result[k] = v;
            // Insert after title
            if (k === "title" && !inserted) {
              result[keyToInsert] = valueToInsert;
              inserted = true;
            }
          }

          // Fallback: insert after type if no title found
          if (!inserted) {
            const fallback: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(result)) {
              fallback[k] = v;
              if (k === "type" && !inserted) {
                fallback[keyToInsert] = valueToInsert;
                inserted = true;
              }
            }
            return inserted ? fallback : { ...result, [keyToInsert]: valueToInsert };
          }

          return result;
        };

        let updated: Record<string, unknown>;

        if (value && value.length > 0) {
          if (key === "related_features") {
            updated = buildOrderedResult(parsed, key, value);
          } else {
            updated = { ...parsed, [key]: value };
          }
        } else {
          // Remove the key
          updated = {};
          for (const [k, v] of Object.entries(parsed)) {
            if (k !== key) {
              updated[k] = v;
            }
          }
        }

        const newYaml = yamlParser.dump(updated, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
        });

        setYamlContent(newYaml);
        setHasChanges(true);
        setParseError(null);

        // Trigger live preview with updated object
        if (onPreviewChange) {
          onPreviewChange(updated as Section);
        }
      } catch (error) {
        console.error("Error updating array property:", error);
      }
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Update a specific field in an array item (supports nested paths like "signup_card.features")
  const updateArrayItemField = useCallback(
    (arrayPath: string, index: number, field: string, value: string | number) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        // Support nested paths like "signup_card.features" by splitting on dots
        const pathParts = arrayPath.split(".");
        let current: Record<string, unknown> = parsed;
        
        // Traverse to the parent object containing the array
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== "object") return;
          current = current[part] as Record<string, unknown>;
        }
        
        // Get the array from the final path part
        const arrayField = pathParts[pathParts.length - 1];
        const array = current[arrayField] as
          | Record<string, unknown>[]
          | undefined;
        if (!Array.isArray(array) || !array[index]) return;

        array[index][field] = value;

        const newYaml = yamlParser.dump(parsed, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
        });

        setYamlContent(newYaml);
        setHasChanges(true);
        setParseError(null);

        if (onPreviewChange) {
          onPreviewChange(parsed as Section);
        }
      } catch (error) {
        console.error("Error updating array item:", error);
      }
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Update multiple fields of an array item at once (avoids stale state issues)
  const updateArrayItemFields = useCallback(
    (arrayPath: string, index: number, updates: Record<string, string>) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        const pathParts = arrayPath.split(".");
        let current: Record<string, unknown> = parsed;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== "object") return;
          current = current[part] as Record<string, unknown>;
        }
        
        const arrayField = pathParts[pathParts.length - 1];
        const array = current[arrayField] as Record<string, unknown>[] | undefined;
        if (!Array.isArray(array) || !array[index]) return;

        // Apply all updates at once
        for (const [field, value] of Object.entries(updates)) {
          array[index][field] = value;
        }

        const newYaml = yamlParser.dump(parsed, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
        });

        setYamlContent(newYaml);
        setHasChanges(true);
        setParseError(null);

        if (onPreviewChange) {
          onPreviewChange(parsed as Section);
        }
      } catch (error) {
        console.error("Error updating array item fields:", error);
      }
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Add a new item to an array field
  const addArrayItem = useCallback(
    (arrayPath: string, defaultItem: Record<string, unknown>) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        // Support nested paths like "signup_card.features" by splitting on dots
        const pathParts = arrayPath.split(".");
        let current: Record<string, unknown> = parsed;
        
        // Traverse to the parent object containing the array
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== "object") {
            current[part] = {};
          }
          current = current[part] as Record<string, unknown>;
        }
        
        // Get or create the array from the final path part
        const arrayField = pathParts[pathParts.length - 1];
        let array = current[arrayField] as Record<string, unknown>[] | undefined;
        
        if (!Array.isArray(array)) {
          array = [];
          current[arrayField] = array;
        }

        array.push(defaultItem);

        const newYaml = yamlParser.dump(parsed, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
        });

        setYamlContent(newYaml);
        setHasChanges(true);
        setParseError(null);

        if (onPreviewChange) {
          onPreviewChange(parsed as Section);
        }
      } catch (error) {
        console.error("Error adding array item:", error);
      }
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Remove an item from an array field
  const removeArrayItem = useCallback(
    (arrayPath: string, indexToRemove: number) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        const pathParts = arrayPath.split(".");
        let current: Record<string, unknown> = parsed;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== "object") return;
          current = current[part] as Record<string, unknown>;
        }
        
        const arrayField = pathParts[pathParts.length - 1];
        const array = current[arrayField] as Record<string, unknown>[] | undefined;
        
        if (!Array.isArray(array) || indexToRemove < 0 || indexToRemove >= array.length) return;

        array.splice(indexToRemove, 1);

        const newYaml = yamlParser.dump(parsed, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
        });

        setYamlContent(newYaml);
        setHasChanges(true);
        setParseError(null);

        if (onPreviewChange) {
          onPreviewChange(parsed as Section);
        }
      } catch (error) {
        console.error("Error removing array item:", error);
      }
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Replace an entire array field
  const updateArrayField = useCallback(
    (arrayPath: string, newArray: Record<string, unknown>[]) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        pushUndoState(yamlContent);

        // Support nested paths like "signup_card.features" by splitting on dots
        const pathParts = arrayPath.split(".");
        let current: Record<string, unknown> = parsed;
        
        // Traverse to the parent object containing the array
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== "object") {
            current[part] = {};
          }
          current = current[part] as Record<string, unknown>;
        }
        
        // Set the array from the final path part
        const arrayField = pathParts[pathParts.length - 1];
        
        if (newArray.length === 0) {
          // Remove the field if array is empty
          delete current[arrayField];
        } else {
          current[arrayField] = newArray;
        }

        const newYaml = yamlParser.dump(parsed, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
        });

        setYamlContent(newYaml);
        setHasChanges(true);
        setParseError(null);

        if (onPreviewChange) {
          onPreviewChange(parsed as Section);
        }
      } catch (error) {
        console.error("Error updating array field:", error);
      }
    },
    [yamlContent, onPreviewChange, pushUndoState],
  );

  // Get configured field editors from the component registry API
  const sectionType = (section as { type: string }).type || "";

  // Fetch all field editors from component registry
  const { data: allFieldEditors } = useQuery<
    Record<string, Record<string, EditorType>>
  >({
    queryKey: ["/api/component-registry/field-editors"],
  });

  // Get configured fields for current section type, filtering by variant
  const configuredFields = useMemo(() => {
    const rawFields = allFieldEditors?.[sectionType] || {};
    const result: Record<string, EditorType> = {};
    
    // Get current variant from parsed section
    const currentVariant = parsedSection?.variant as string | undefined;
    
    for (const [fieldPath, editorType] of Object.entries(rawFields)) {
      // Check if field path has variant prefix (e.g., "productShowcase:left_images[].src")
      const colonIndex = fieldPath.indexOf(":");
      if (colonIndex > 0 && !fieldPath.startsWith("color-picker:")) {
        // This is a variant-specific field
        const variantPrefix = fieldPath.substring(0, colonIndex);
        const actualFieldPath = fieldPath.substring(colonIndex + 1);
        
        // Only include if current variant matches
        if (currentVariant === variantPrefix) {
          result[actualFieldPath] = editorType;
        }
      } else {
        // Global field - include for all variants
        result[fieldPath] = editorType;
      }
    }
    
    return result;
  }, [allFieldEditors, sectionType, parsedSection?.variant]);

  // Render icon from name using shared icon utility
  const renderIconByName = useCallback((iconName: string) => {
    if (!iconName) {
      return <IconQuestionMark className="h-5 w-5 text-muted-foreground" />;
    }
    const IconComponent = getIcon(iconName);
    if (!IconComponent) {
      return <IconQuestionMark className="h-5 w-5 text-muted-foreground" />;
    }
    return <IconComponent className="h-5 w-5" />;
  }, []);

  // Handle icon picker selection
  const handleIconSelect = useCallback(
    (iconName: string) => {
      if (iconPickerTarget) {
        updateArrayItemField(
          iconPickerTarget.arrayField,
          iconPickerTarget.index,
          iconPickerTarget.field,
          iconName,
        );
        setIconPickerTarget(null);
      }
    },
    [iconPickerTarget, updateArrayItemField],
  );

  // Shared save logic - returns true on success
  const saveToServer = useCallback(async (): Promise<{
    success: boolean;
    warning?: string;
  }> => {
    if (!contentType || !slug || !locale) {
      return { success: false };
    }

    let parsed: Section;
    try {
      parsed = yamlParser.load(yamlContent) as Section;
      if (!parsed || typeof parsed !== "object") {
        setParseError("Invalid section structure");
        return { success: false };
      }
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
      return { success: false };
    }

    setIsSaving(true);
    setSaveError(null);
    
    // Save page snapshot for undo before making changes
    if (pageHistory && allSections) {
      pageHistory.pushSnapshot(allSections, `Antes de editar sección ${sectionIndex + 1}`);
    }

    try {
      const result = await editContent({
        contentType,
        slug,
        locale,
        variant,
        version,
        operations: [
          {
            action: "update_section",
            index: sectionIndex,
            section: parsed as Record<string, unknown>,
          },
        ],
      });

      if (result.success) {

        // Use server-confirmed section data if available, fallback to local parsed
        const confirmedSection = result.updatedSections?.[sectionIndex] as
          | Section
          | undefined;
        if (!confirmedSection) {
          console.warn(
            "Server did not return updated section, using local parsed data",
          );
        }
        onUpdate(confirmedSection || parsed);
        setHasChanges(false);
        
        // Update initial state reference so next undo session starts from saved state
        initialYamlRef.current = yamlContent;

        // Emit event to trigger page refresh
        emitContentUpdated({ contentType, slug, locale });

        // Return warning if present (for GitHub sync failures)
        return { success: true, warning: result.warning };
      } else {
        setSaveError(result.error || "Failed to save changes");
        return { success: false };
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      setSaveError(error instanceof Error ? error.message : "Network error");
      return { success: false };
    } finally {
      setIsSaving(false);
    }
  }, [
    yamlContent,
    sectionIndex,
    contentType,
    slug,
    locale,
    variant,
    version,
    onUpdate,
    pageHistory,
    allSections,
  ]);

  // Save without closing editor
  const handleSave = useCallback(async () => {
    const result = await saveToServer();
    if (result && result.success) {
      if (result.warning) {
        // Show warning toast for GitHub sync failures
        toast({
          title: "Changes saved with warning",
          description: result.warning,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Changes saved",
          description: "Your section has been updated successfully.",
        });
      }
    }
  }, [saveToServer, toast]);

  // Handle close with unsaved changes warning
  const handleClose = useCallback(() => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to close without saving?",
      );
      if (!confirmed) return;
    }
    // Clear live preview when closing
    if (onPreviewChange) {
      onPreviewChange(null);
    }
    onClose();
  }, [hasChanges, onClose, onPreviewChange]);

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-background border-l shadow-xl z-[9999] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold">Editar Sección</h2>
          <p className="text-sm text-muted-foreground">
            {sectionType} (Sección {sectionIndex + 1})
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo}
            title="Deshacer (Ctrl+Z)"
            data-testid="button-undo"
          >
            <IconArrowBackUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo}
            title="Rehacer (Ctrl+Shift+Z)"
            data-testid="button-redo"
          >
            <IconArrowForwardUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClose}
            data-testid="button-close-editor"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="mx-4 mt-2 grid w-auto grid-cols-2">
          <TabsTrigger value="code" className="gap-1.5" data-testid="tab-code">
            <IconCode className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger
            value="props"
            className="gap-1.5"
            data-testid="tab-props"
          >
            <IconSettings className="h-4 w-4" />
            Props
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="code"
          className="flex-1 flex flex-col min-h-0 mt-0 data-[state=inactive]:hidden"
        >
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

        <TabsContent
          value="props"
          className="flex-1 overflow-auto p-4 mt-0 data-[state=inactive]:hidden"
        >
          <div className="space-y-6">
            <ShowOnPicker
              value={currentShowOn}
              onChange={(value) => updateProperty("showOn", value)}
            />
            
            {/* CTA Banner variant picker */}
            {sectionType === "cta_banner" && (
              <VariantPicker
                value={(parsedSection?.variant as string) || "default"}
                onChange={(value) => updateProperty("variant", value)}
                options={[
                  { id: "default", label: "Default (Buttons)" },
                  { id: "form", label: "Form" },
                ]}
              />
            )}
            {/* FAQ related features picker */}
            {sectionType === "faq" && (
              <>
                <div 
                  className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2"
                  data-testid="alert-faq-edit-warning"
                >
                  <IconAlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    {locale === "es" 
                      ? "Los cambios a las FAQs afectarán todas las páginas del sitio que muestran estas preguntas."
                      : "Changes to FAQs here will affect all pages across the site that display these questions."}
                  </p>
                </div>
                <RelatedFeaturesPicker
                  value={(parsedSection?.related_features as string[]) || []}
                  onChange={(value) => updateArrayProperty("related_features", value)}
                  locale={locale}
                />
              </>
            )}
            
            <ColorPicker
              value={currentBackground}
              onChange={(value) => updateProperty("background", value)}
              type="background"
              testIdPrefix="props-background"
            />
            {/* Render array fields with configured editors */}
            {Object.entries(configuredFields).map(
              ([fieldPath, editorTypeRaw]) => {
                // Parse editor type with optional variant (e.g., "color-picker:background")
                const { type: editorType, variant } =
                  parseEditorType(editorTypeRaw);

                // Handle simple field paths (e.g., "image" or "nested.image")
                const isSimpleField = !fieldPath.includes("[]");
                if (isSimpleField && editorType === "image-picker") {
                  // Get the current value by traversing the path
                  const getSimpleFieldValue = () => {
                    if (!parsedSection) return "";
                    const pathParts = fieldPath.split(".");
                    let current: unknown = parsedSection;
                    for (const part of pathParts) {
                      if (!current || typeof current !== "object") return "";
                      current = (current as Record<string, unknown>)[part];
                    }
                    return (current as string) || "";
                  };
                  
                  const currentValue = getSimpleFieldValue();
                  const fieldLabel = fieldPath.split(".").pop() || fieldPath;
                  
                  return (
                    <div key={fieldPath} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {fieldLabel.replace(/_/g, " ")}
                      </Label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setImagePickerTarget({
                              fieldPath,
                              label: fieldLabel,
                              currentSrc: currentValue,
                              currentAlt: "",
                              tagFilter: variant, // e.g., "logo" from "image-picker:logo"
                            });
                            setImagePickerOpen(true);
                          }}
                          className="relative w-16 h-16 rounded-md border border-input bg-muted/50 hover:bg-muted transition-colors overflow-hidden group"
                          data-testid={`props-image-${fieldLabel}`}
                          title={`Change ${fieldLabel}`}
                        >
                          {currentValue ? (
                            <>
                              <img
                                src={currentValue}
                                alt={fieldLabel}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <IconPhoto className="h-5 w-5 text-white" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <IconPhoto className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </button>
                        {currentValue && (
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {currentValue.split("/").pop()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                // Handle simple field paths with image-with-style-picker (e.g., "left.image")
                if (isSimpleField && editorType === "image-with-style-picker") {
                  const getNestedValue = (path: string, defaultValue: unknown = "") => {
                    if (!parsedSection) return defaultValue;
                    const pathParts = path.split(".");
                    let current: unknown = parsedSection;
                    for (const part of pathParts) {
                      if (!current || typeof current !== "object") return defaultValue;
                      current = (current as Record<string, unknown>)[part];
                    }
                    return current ?? defaultValue;
                  };
                  
                  const pathParts = fieldPath.split(".");
                  const parentPath = pathParts.slice(0, -1).join(".");
                  const side = pathParts[0]; // "left" or "right"
                  
                  const currentValue = getNestedValue(fieldPath, "") as string;
                  const currentAlt = getNestedValue(`${parentPath}.image_alt`, "") as string;
                  const currentObjectFit = getNestedValue(`${parentPath}.image_object_fit`, "") as string;
                  const currentObjectPosition = getNestedValue(`${parentPath}.image_object_position`, "") as string;
                  const currentMaxWidth = getNestedValue(`${parentPath}.image_max_width`, "") as string;
                  const currentMaxHeight = getNestedValue(`${parentPath}.image_max_height`, "") as string;
                  const currentMobileMaxWidth = getNestedValue(`${parentPath}.image_mobile_max_width`, "") as string;
                  const currentMobileMaxHeight = getNestedValue(`${parentPath}.image_mobile_max_height`, "") as string;
                  
                  const fieldLabel = side === "left" ? "Imagen Izquierda" : side === "right" ? "Imagen Derecha" : fieldPath.split(".").pop() || fieldPath;
                  
                  return (
                    <Collapsible key={fieldPath} className="border rounded-md">
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                          data-testid={`props-image-style-${side}-trigger`}
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                            {currentValue ? (
                              <img
                                src={currentValue}
                                alt={currentAlt || fieldLabel}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <IconPhoto className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <span className="flex-1 text-left text-sm font-medium">
                            {fieldLabel}
                          </span>
                          <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3 pt-0 space-y-3 border-t">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setImagePickerTarget({
                                  fieldPath,
                                  label: fieldLabel,
                                  currentSrc: currentValue,
                                  currentAlt,
                                  tagFilter: variant,
                                });
                                setImagePickerOpen(true);
                              }}
                              className="relative w-16 h-16 rounded-md border border-input bg-muted/50 hover:bg-muted transition-colors overflow-hidden group"
                              data-testid={`props-image-style-${side}-picker`}
                              title="Cambiar imagen"
                            >
                              {currentValue ? (
                                <>
                                  <img
                                    src={currentValue}
                                    alt={currentAlt}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <IconPhoto className="h-5 w-5 text-white" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <IconPhoto className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </button>
                            <div className="flex-1 space-y-1">
                              <Label className="text-xs text-muted-foreground">Alt text</Label>
                              <Input
                                value={currentAlt}
                                onChange={(e) => updateProperty(`${parentPath}.image_alt`, e.target.value)}
                                placeholder="Descripción de la imagen"
                                className="h-8 text-sm"
                                data-testid={`props-image-style-${side}-alt`}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Object Fit</Label>
                              <Select
                                value={currentObjectFit || "cover"}
                                onValueChange={(value) => updateProperty(`${parentPath}.image_object_fit`, value)}
                              >
                                <SelectTrigger className="h-8 text-sm" data-testid={`props-image-style-${side}-object-fit`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cover">Cover (recorta)</SelectItem>
                                  <SelectItem value="contain">Contain (completa)</SelectItem>
                                  <SelectItem value="fill">Fill (estirar)</SelectItem>
                                  <SelectItem value="none">None (original)</SelectItem>
                                  <SelectItem value="scale-down">Scale Down</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Posición (X Y)</Label>
                              <Input
                                value={currentObjectPosition}
                                onChange={(e) => updateProperty(`${parentPath}.image_object_position`, e.target.value)}
                                placeholder="center center"
                                className="h-8 text-sm"
                                data-testid={`props-image-style-${side}-object-position`}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Ancho Máx.</Label>
                              <Input
                                value={currentMaxWidth}
                                onChange={(e) => updateProperty(`${parentPath}.image_max_width`, e.target.value)}
                                placeholder="400px"
                                className="h-8 text-sm"
                                data-testid={`props-image-style-${side}-max-width`}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Alto Máx.</Label>
                              <Input
                                value={currentMaxHeight}
                                onChange={(e) => updateProperty(`${parentPath}.image_max_height`, e.target.value)}
                                placeholder="300px"
                                className="h-8 text-sm"
                                data-testid={`props-image-style-${side}-max-height`}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Ancho Móvil Máx.</Label>
                              <Input
                                value={currentMobileMaxWidth}
                                onChange={(e) => updateProperty(`${parentPath}.image_mobile_max_width`, e.target.value)}
                                placeholder="100%"
                                className="h-8 text-sm"
                                data-testid={`props-image-style-${side}-mobile-max-width`}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Alto Móvil Máx.</Label>
                              <Input
                                value={currentMobileMaxHeight}
                                onChange={(e) => updateProperty(`${parentPath}.image_mobile_max_height`, e.target.value)}
                                placeholder="200px"
                                className="h-8 text-sm"
                                data-testid={`props-image-style-${side}-mobile-max-height`}
                              />
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                // Parse field path like "features[].icon" or "signup_card.features[].icon"
                // Matches: optional.nested.path.arrayName[].fieldName
                const match = fieldPath.match(/^([\w.]+)\[\]\.(\w+)$/);
                if (!match) return null;

                const [, arrayPath, itemField] = match;
                
                // Support nested paths by traversing the object
                const getArrayData = () => {
                  if (!parsedSection) return undefined;
                  const pathParts = arrayPath.split(".");
                  let current: Record<string, unknown> = parsedSection as Record<string, unknown>;
                  
                  for (const part of pathParts) {
                    if (!current || typeof current !== "object") return undefined;
                    current = current[part] as Record<string, unknown>;
                  }
                  
                  return current as unknown as Record<string, unknown>[] | undefined;
                };
                
                const arrayData = getArrayData();
                
                // Skip if the array field doesn't exist in the current section data
                // This prevents showing editors for fields that don't apply to the current variant
                if (arrayData === undefined) return null;
                
                const safeArrayData = Array.isArray(arrayData) ? arrayData : [];
                
                // For display, use the last part of the path as the label
                const arrayFieldLabel = arrayPath.split(".").pop() || arrayPath;

                if (editorType === "icon-picker") {
                  return (
                    <div key={fieldPath} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {arrayFieldLabel} Icons
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {safeArrayData.map((item, index) => {
                          const currentValue =
                            (item[itemField] as string) || "";
                          const itemLabel =
                            (item.title as string) ||
                            (item.label as string) ||
                            (item.name as string) ||
                            `Item ${index + 1}`;

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setIconPickerTarget({
                                  arrayField: arrayPath,
                                  index,
                                  field: itemField,
                                  label: itemLabel,
                                  currentIcon: currentValue,
                                });
                                setIconPickerOpen(true);
                              }}
                              className="flex items-center justify-center w-10 h-10 rounded border bg-muted/30 hover:bg-muted transition-colors"
                              data-testid={`props-icon-${arrayFieldLabel}-${index}`}
                              title={`${itemLabel}: ${currentValue || "no icon"}`}
                            >
                              {renderIconByName(currentValue)}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            const defaultItem: Record<string, unknown> = {
                              [itemField]: "IconBook",
                              text: "New feature",
                              count: "0",
                            };
                            addArrayItem(arrayPath, defaultItem);
                          }}
                          className="flex items-center justify-center w-10 h-10 rounded border border-dashed border-muted-foreground/50 bg-transparent hover:bg-muted/30 hover:border-muted-foreground transition-colors"
                          data-testid={`props-icon-${arrayFieldLabel}-add`}
                          title="Add new item"
                        >
                          <IconPlus className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  );
                }

                if (editorType === "color-picker") {
                  // Use the variant from config, defaulting to "accent"
                  const colorType = (variant as ColorPickerVariant) || "accent";

                  return (
                    <div key={fieldPath} className="space-y-3">
                      <Label className="text-sm font-medium capitalize">
                        {arrayFieldLabel} Colors
                      </Label>
                      <div className="space-y-2">
                        {safeArrayData.map((item, index) => {
                          const currentValue =
                            (item[itemField] as string) || "";
                          const itemLabel =
                            (item.title as string) ||
                            (item.label as string) ||
                            (item.name as string) ||
                            `Item ${index + 1}`;

                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm text-muted-foreground min-w-[80px] truncate">
                                {itemLabel}
                              </span>
                              <ColorPicker
                                value={currentValue}
                                onChange={(value) =>
                                  updateArrayItemField(
                                    arrayPath,
                                    index,
                                    itemField,
                                    value,
                                  )
                                }
                                type={colorType}
                                allowNone={true}
                                allowCustom={true}
                                testIdPrefix={`props-color-${arrayFieldLabel}-${index}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (editorType === "image-picker") {
                  return (
                    <div key={fieldPath} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {arrayFieldLabel.replace(/_/g, " ")}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {safeArrayData.map((item, index) => {
                          const currentValue =
                            (item[itemField] as string) || "";
                          const altValue = (item.alt as string) || "";
                          // For ID fields, look up the actual src from registry
                          const displaySrc = imageRegistry?.images?.[currentValue]?.src || currentValue;

                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setImagePickerTarget({
                                  arrayPath,
                                  index,
                                  srcField: itemField,
                                  currentSrc: currentValue,
                                  currentAlt: altValue,
                                  tagFilter: variant, // e.g., "logo" from "image-picker:logo"
                                });
                                setImagePickerOpen(true);
                              }}
                              className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border hover:border-primary transition-colors flex-shrink-0 relative group"
                              data-testid={`props-image-${arrayFieldLabel}-${index}`}
                              title={altValue || `Image ${index + 1}`}
                            >
                              {currentValue ? (
                                <img
                                  src={displaySrc}
                                  alt={altValue || `Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                  ?
                                </div>
                              )}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            const defaultItem: Record<string, unknown> = {
                              [itemField]: "",
                              alt: "",
                            };
                            addArrayItem(arrayPath, defaultItem);
                          }}
                          className="w-12 h-12 rounded-md border border-dashed border-muted-foreground/50 bg-transparent hover:bg-muted/30 hover:border-muted-foreground transition-colors flex items-center justify-center"
                          data-testid={`props-image-${arrayFieldLabel}-add`}
                          title="Add image"
                        >
                          <IconPlus className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  );
                }

                if (editorType === "image-with-style-picker") {
                  const MAX_IMAGES = 4;
                  const hasImages = safeArrayData.length > 0;
                  
                  const initializeDefaultImages = () => {
                    const defaultImages = [
                      { src: "", alt: "Student 1", object_fit: "cover", object_position: "center top", border_radius: "0.5rem" },
                      { src: "", alt: "Student 2", object_fit: "cover", object_position: "center top", border_radius: "0.5rem" },
                      { src: "", alt: "Student 3", object_fit: "cover", object_position: "center top", border_radius: "0.5rem" },
                      { src: "", alt: "Student 4", object_fit: "cover", object_position: "center top", border_radius: "0.5rem" },
                    ];
                    updateArrayField(arrayPath, defaultImages);
                  };

                  return (
                    <div key={fieldPath} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Imágenes ({safeArrayData.length}/{MAX_IMAGES})
                        </Label>
                        {!hasImages && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={initializeDefaultImages}
                            data-testid="props-image-style-init"
                          >
                            <IconPlus className="h-4 w-4 mr-1" />
                            Inicializar imágenes
                          </Button>
                        )}
                      </div>
                      
                      {!hasImages && (
                        <div className="p-4 border border-dashed rounded-md text-center text-sm text-muted-foreground">
                          <IconPhoto className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Este componente usa imágenes por defecto.</p>
                          <p>Haz clic en "Inicializar imágenes" para personalizarlas.</p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {safeArrayData.map((item, index) => {
                          const currentSrc = (item.src as string) || "";
                          const currentAlt = (item.alt as string) || "";
                          const displaySrc = imageRegistry?.images?.[currentSrc]?.src || currentSrc;

                          return (
                            <Collapsible key={index} className="border rounded-md">
                              <CollapsibleTrigger asChild>
                                <button
                                  type="button"
                                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                                  data-testid={`props-image-style-${index}-trigger`}
                                >
                                  <div className="w-10 h-10 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                                    {currentSrc ? (
                                      <img
                                        src={displaySrc}
                                        alt={currentAlt || `Imagen ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <IconPhoto className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="flex-1 text-left text-sm font-medium">
                                    Imagen {index + 1}
                                  </span>
                                  <IconChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-3 pt-0 space-y-3 border-t">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setImagePickerTarget({
                                          arrayPath,
                                          index,
                                          srcField: "src",
                                          currentSrc,
                                          currentAlt,
                                          tagFilter: variant,
                                        });
                                        setImagePickerOpen(true);
                                      }}
                                      className="relative w-16 h-16 rounded-md border border-input bg-muted/50 hover:bg-muted transition-colors overflow-hidden group"
                                      data-testid={`props-image-style-${index}-picker`}
                                      title="Cambiar imagen"
                                    >
                                      {currentSrc ? (
                                        <>
                                          <img
                                            src={displaySrc}
                                            alt={currentAlt}
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <IconPhoto className="h-5 w-5 text-white" />
                                          </div>
                                        </>
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <IconPhoto className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                      )}
                                    </button>
                                    <div className="flex-1 space-y-1">
                                      <Label className="text-xs text-muted-foreground">Alt text</Label>
                                      <Input
                                        value={currentAlt}
                                        onChange={(e) => updateArrayItemField(arrayPath, index, "alt", e.target.value)}
                                        placeholder="Descripción de la imagen"
                                        className="h-8 text-sm"
                                        data-testid={`props-image-style-${index}-alt`}
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeArrayItem(arrayPath, index)}
                                      className="text-muted-foreground hover:text-destructive"
                                      data-testid={`props-image-style-${index}-delete`}
                                      title="Eliminar imagen"
                                    >
                                      <IconTrash className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground">Object Fit</Label>
                                      <Select
                                        value={(item.object_fit as string) || "cover"}
                                        onValueChange={(value) => updateArrayItemField(arrayPath, index, "object_fit", value)}
                                      >
                                        <SelectTrigger className="h-8 text-sm" data-testid={`props-image-style-${index}-object-fit`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="cover">Cover</SelectItem>
                                          <SelectItem value="contain">Contain</SelectItem>
                                          <SelectItem value="fill">Fill</SelectItem>
                                          <SelectItem value="none">None</SelectItem>
                                          <SelectItem value="scale-down">Scale Down</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground">Object Position</Label>
                                      <Input
                                        value={(item.object_position as string) || "center top"}
                                        onChange={(e) => updateArrayItemField(arrayPath, index, "object_position", e.target.value)}
                                        placeholder="center top"
                                        className="h-8 text-sm"
                                        data-testid={`props-image-style-${index}-object-position`}
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground">Border Radius</Label>
                                      <Input
                                        value={(item.border_radius as string) || "0.5rem"}
                                        onChange={(e) => updateArrayItemField(arrayPath, index, "border_radius", e.target.value)}
                                        placeholder="0.5rem"
                                        className="h-8 text-sm"
                                        data-testid={`props-image-style-${index}-border-radius`}
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-xs text-muted-foreground">Opacidad</Label>
                                      <Input
                                        type="number"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={(item.opacity as number) ?? 1}
                                        onChange={(e) => updateArrayItemField(arrayPath, index, "opacity", parseFloat(e.target.value) || 1)}
                                        placeholder="1"
                                        className="h-8 text-sm"
                                        data-testid={`props-image-style-${index}-opacity`}
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">CSS Filter</Label>
                                    <Input
                                      value={(item.filter as string) || ""}
                                      onChange={(e) => updateArrayItemField(arrayPath, index, "filter", e.target.value)}
                                      placeholder="grayscale(50%) brightness(1.1)"
                                      className="h-8 text-sm"
                                      data-testid={`props-image-style-${index}-filter`}
                                    />
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}

                        {safeArrayData.length > 0 && safeArrayData.length < MAX_IMAGES && (
                          <button
                            type="button"
                            onClick={() => {
                              const defaultItem: Record<string, unknown> = {
                                src: "",
                                alt: `Student ${safeArrayData.length + 1}`,
                                object_fit: "cover",
                                object_position: "center top",
                                border_radius: "0.5rem",
                              };
                              addArrayItem(arrayPath, defaultItem);
                            }}
                            className="w-full py-2 rounded-md border border-dashed border-muted-foreground/50 bg-transparent hover:bg-muted/30 hover:border-muted-foreground transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground"
                            data-testid="props-image-style-add"
                            title="Añadir imagen"
                          >
                            <IconPlus className="h-4 w-4" />
                            Añadir imagen ({safeArrayData.length}/{MAX_IMAGES})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              },
            )}
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

      {/* Icon Picker Modal */}
      <IconPickerModal
        open={iconPickerOpen}
        onOpenChange={setIconPickerOpen}
        currentValue={iconPickerTarget?.currentIcon || ""}
        itemLabel={iconPickerTarget?.label}
        onSelect={handleIconSelect}
      />

      {/* Image Picker Modal */}
      <Dialog open={imagePickerOpen} onOpenChange={(open) => {
        setImagePickerOpen(open);
        if (!open) setImageGallerySearch("");
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {imagePickerTarget?.tagFilter 
                ? `Select ${imagePickerTarget.tagFilter.charAt(0).toUpperCase() + imagePickerTarget.tagFilter.slice(1)}` 
                : "Select Image"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col gap-4 py-2">
            {/* Search bar */}
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search images..."
                value={imageGallerySearch}
                onChange={(e) => setImageGallerySearch(e.target.value)}
                className="pl-10"
                data-testid="input-image-gallery-search"
              />
            </div>

            {/* Gallery grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="columns-4 sm:columns-5 md:columns-6 gap-2">
                {filteredGalleryImages.slice(0, visibleImageCount).map(([id, img]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (imagePickerTarget) {
                        // For fields ending in _id (like image_id), save the registry ID
                        // Otherwise save the full path
                        const fieldName = imagePickerTarget.srcField || imagePickerTarget.fieldPath || "";
                        const isIdField = fieldName.endsWith("_id");
                        setImagePickerTarget({
                          ...imagePickerTarget,
                          currentSrc: isIdField ? id : img.src,
                          currentAlt: img.alt,
                        });
                      }
                    }}
                    className={`mb-2 rounded-md overflow-hidden bg-muted border-2 transition-colors block w-full ${
                      imagePickerTarget?.currentSrc === img.src || imagePickerTarget?.currentSrc === id
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                    title={img.alt}
                    data-testid={`gallery-image-${id}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              {/* Load more button */}
              {visibleImageCount < filteredGalleryImages.length && (
                <div className="py-3 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVisibleImageCount((prev) => Math.min(prev + 24, filteredGalleryImages.length))}
                    data-testid="button-load-more-images"
                  >
                    Load more ({filteredGalleryImages.length - visibleImageCount} remaining)
                  </Button>
                </div>
              )}
              {filteredGalleryImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No images found
                </div>
              )}
            </div>

            {/* Selected image preview and fields */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-muted border flex-shrink-0">
                  {imagePickerTarget?.currentSrc ? (
                    <img
                      src={
                        // If currentSrc is an ID, look up the actual src from registry
                        imageRegistry?.images?.[imagePickerTarget.currentSrc]?.src || imagePickerTarget.currentSrc
                      }
                      alt={imagePickerTarget.currentAlt || "Preview"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      None
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={imagePickerTarget?.currentSrc || ""}
                    onChange={(e) => {
                      if (imagePickerTarget) {
                        setImagePickerTarget({
                          ...imagePickerTarget,
                          currentSrc: e.target.value,
                        });
                      }
                    }}
                    placeholder="Image URL"
                    className="text-sm"
                    data-testid="input-image-url"
                  />
                  <Input
                    value={imagePickerTarget?.currentAlt || ""}
                    onChange={(e) => {
                      if (imagePickerTarget) {
                        setImagePickerTarget({
                          ...imagePickerTarget,
                          currentAlt: e.target.value,
                        });
                      }
                    }}
                    placeholder="Alt text"
                    className="text-sm"
                    data-testid="input-image-alt"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (imagePickerTarget) {
                  if (imagePickerTarget.fieldPath) {
                    // Simple field - clear the value
                    updateProperty(imagePickerTarget.fieldPath, "");
                  } else if (imagePickerTarget.arrayPath && imagePickerTarget.index !== undefined) {
                    // Array field - remove this item
                    const pathParts = imagePickerTarget.arrayPath.split(".");
                    let current: Record<string, unknown> | null = parsedSection;
                    for (let i = 0; i < pathParts.length - 1 && current; i++) {
                      current = current[pathParts[i]] as Record<string, unknown> | null;
                    }
                    const arrayField = pathParts[pathParts.length - 1];
                    const array = current?.[arrayField] as Record<string, unknown>[] || [];
                    const newArray = [...array];
                    newArray.splice(imagePickerTarget.index, 1);
                    updateArrayField(imagePickerTarget.arrayPath, newArray);
                  }
                }
                setImagePickerOpen(false);
                setImagePickerTarget(null);
              }}
              data-testid="button-image-remove"
            >
              <IconX className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImagePickerOpen(false);
                  setImagePickerTarget(null);
                }}
                data-testid="button-image-cancel"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (imagePickerTarget) {
                    if (imagePickerTarget.fieldPath) {
                      // Simple field - update directly
                      updateProperty(imagePickerTarget.fieldPath, imagePickerTarget.currentSrc);
                    } else if (imagePickerTarget.arrayPath !== undefined && imagePickerTarget.index !== undefined && imagePickerTarget.srcField) {
                      // Array field - update both src and alt in a single operation
                      updateArrayItemFields(
                        imagePickerTarget.arrayPath,
                        imagePickerTarget.index,
                        {
                          [imagePickerTarget.srcField]: imagePickerTarget.currentSrc,
                          alt: imagePickerTarget.currentAlt,
                        },
                      );
                    }
                  }
                  setImagePickerOpen(false);
                  setImagePickerTarget(null);
                }}
                data-testid="button-image-save"
              >
                <IconCheck className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
