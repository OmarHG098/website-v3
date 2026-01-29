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
} from "@tabler/icons-react";
import { IconQuestionMark } from "@tabler/icons-react";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    arrayPath: string;
    index: number;
    srcField: string;
    currentSrc: string;
    currentAlt: string;
  } | null>(null);
  const [imageGallerySearch, setImageGallerySearch] = useState("");
  const [visibleImageCount, setVisibleImageCount] = useState(48);
  const gallerySentinelRef = useRef<HTMLDivElement>(null);

  // Fetch image registry for gallery picker
  const { data: imageRegistry } = useQuery<ImageRegistry>({
    queryKey: ["/api/image-registry"],
  });

  // Filter and sort gallery images by usage count (most used first)
  const filteredGalleryImages = useMemo(() => {
    if (!imageRegistry?.images) return [];
    const searchLower = imageGallerySearch.toLowerCase();
    return Object.entries(imageRegistry.images)
      .filter(([id, img]) => {
        if (!searchLower) return true;
        return (
          id.toLowerCase().includes(searchLower) ||
          img.alt.toLowerCase().includes(searchLower) ||
          img.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => (b[1].usage_count ?? 0) - (a[1].usage_count ?? 0));
  }, [imageRegistry, imageGallerySearch]);

  // Reset visible count when search changes or modal opens
  useEffect(() => {
    setVisibleImageCount(48);
  }, [imageGallerySearch, imagePickerOpen]);

  // Infinite scroll for image gallery
  useEffect(() => {
    const sentinel = gallerySentinelRef.current;
    if (!sentinel || !imagePickerOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleImageCount((prev) => Math.min(prev + 24, filteredGalleryImages.length));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [imagePickerOpen, filteredGalleryImages.length]);

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
    [onPreviewChange],
  );

  // Update a specific property in the YAML
  const updateProperty = useCallback(
    (key: string, value: string) => {
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
    },
    [yamlContent, onPreviewChange],
  );

  // Update an array property in the YAML (e.g., related_features)
  // For related_features, insert after title to maintain YAML structure
  const updateArrayProperty = useCallback(
    (key: string, value: string[]) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

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
    [yamlContent, onPreviewChange],
  );

  // Update a specific field in an array item (supports nested paths like "signup_card.features")
  const updateArrayItemField = useCallback(
    (arrayPath: string, index: number, field: string, value: string) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

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
    [yamlContent, onPreviewChange],
  );

  // Update multiple fields of an array item at once (avoids stale state issues)
  const updateArrayItemFields = useCallback(
    (arrayPath: string, index: number, updates: Record<string, string>) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

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
    [yamlContent, onPreviewChange],
  );

  // Add a new item to an array field
  const addArrayItem = useCallback(
    (arrayPath: string, defaultItem: Record<string, unknown>) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

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
    [yamlContent, onPreviewChange],
  );

  // Replace an entire array field
  const updateArrayField = useCallback(
    (arrayPath: string, newArray: Record<string, unknown>[]) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

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
    [yamlContent, onPreviewChange],
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
                                });
                                setImagePickerOpen(true);
                              }}
                              className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border hover:border-primary transition-colors flex-shrink-0 relative group"
                              data-testid={`props-image-${arrayFieldLabel}-${index}`}
                              title={altValue || `Image ${index + 1}`}
                            >
                              {currentValue ? (
                                <img
                                  src={currentValue}
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
            <DialogTitle>Select Image</DialogTitle>
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
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {filteredGalleryImages.slice(0, visibleImageCount).map(([id, img]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (imagePickerTarget) {
                        setImagePickerTarget({
                          ...imagePickerTarget,
                          currentSrc: img.src,
                          currentAlt: img.alt,
                        });
                      }
                    }}
                    className={`aspect-square rounded-md overflow-hidden bg-muted border-2 transition-colors ${
                      imagePickerTarget?.currentSrc === img.src
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/50"
                    }`}
                    title={img.alt}
                    data-testid={`gallery-image-${id}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              {/* Sentinel for infinite scroll */}
              {visibleImageCount < filteredGalleryImages.length && (
                <div ref={gallerySentinelRef} className="h-8 flex items-center justify-center text-muted-foreground text-sm">
                  Loading more...
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
                      src={imagePickerTarget.currentSrc}
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
                  // Get current array and remove this item
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
                    // Update both src and alt in a single operation to avoid stale state
                    updateArrayItemFields(
                      imagePickerTarget.arrayPath,
                      imagePickerTarget.index,
                      {
                        [imagePickerTarget.srcField]: imagePickerTarget.currentSrc,
                        alt: imagePickerTarget.currentAlt,
                      },
                    );
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
