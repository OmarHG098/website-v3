import { useCallback, useState, useEffect, useMemo } from "react";
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
} from "@tabler/icons-react";
import { IconQuestionMark } from "@tabler/icons-react";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { useToast } from "@/hooks/use-toast";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { emitContentUpdated } from "@/lib/contentEvents";
import {
  parseEditorType,
  type ColorPickerVariant,
  type EditorType,
} from "@/lib/field-editor-registry";
import { IconPickerModal } from "./IconPickerModal";
import type { Section } from "@shared/schema";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import * as yamlParser from "js-yaml";
import {
  AVAILABLE_RELATED_FEATURES,
  MAX_RELATED_FEATURES,
  centralizedFaqs,
  filterFaqsByRelatedFeatures,
  type RelatedFeature,
} from "@/data/faqs";

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

interface RelatedFeaturesPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  locale?: string;
}

function RelatedFeaturesPicker({ value, onChange, locale = "en" }: RelatedFeaturesPickerProps) {
  const selectedFeatures = value || [];
  
  const faqCounts = useMemo(() => {
    const faqData = centralizedFaqs[locale as "en" | "es"] || centralizedFaqs.en;
    const counts: Record<string, number> = {};
    
    for (const feature of AVAILABLE_RELATED_FEATURES) {
      const filtered = filterFaqsByRelatedFeatures(faqData.faqs, {
        relatedFeatures: [feature],
      });
      counts[feature] = filtered.length;
    }
    
    return counts;
  }, [locale]);
  
  const totalFaqsForSelection = useMemo(() => {
    if (selectedFeatures.length === 0) return 0;
    const faqData = centralizedFaqs[locale as "en" | "es"] || centralizedFaqs.en;
    return filterFaqsByRelatedFeatures(faqData.faqs, {
      relatedFeatures: selectedFeatures,
    }).length;
  }, [selectedFeatures, locale]);

  const toggleFeature = (feature: RelatedFeature) => {
    if (selectedFeatures.includes(feature)) {
      onChange(selectedFeatures.filter(f => f !== feature));
    } else if (selectedFeatures.length < MAX_RELATED_FEATURES) {
      onChange([...selectedFeatures, feature]);
    }
  };

  const formatLabel = (feature: string) => {
    return feature
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">FAQ Topics</Label>
        <span className="text-xs text-muted-foreground">
          {selectedFeatures.length}/{MAX_RELATED_FEATURES} selected
          {totalFaqsForSelection > 0 && (
            <span className="ml-1 text-primary">({totalFaqsForSelection} FAQs)</span>
          )}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {AVAILABLE_RELATED_FEATURES.map((feature) => {
          const isSelected = selectedFeatures.includes(feature);
          const isDisabled = !isSelected && selectedFeatures.length >= MAX_RELATED_FEATURES;
          const count = faqCounts[feature] || 0;
          
          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              disabled={isDisabled}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isDisabled
                  ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              data-testid={`props-feature-${feature}`}
            >
              {isSelected && <IconCheck className="h-3 w-3" />}
              <span>{formatLabel(feature)}</span>
              <span className={`text-[10px] ${isSelected ? "opacity-75" : "opacity-50"}`}>
                ({count})
              </span>
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
  const updateArrayProperty = useCallback(
    (key: string, value: string[]) => {
      try {
        const parsed = yamlParser.load(yamlContent) as Record<string, unknown>;
        if (!parsed || typeof parsed !== "object") return;

        if (value && value.length > 0) {
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

  // Get configured field editors from the component registry API
  const sectionType = (section as { type: string }).type || "";

  // Fetch all field editors from component registry
  const { data: allFieldEditors } = useQuery<
    Record<string, Record<string, EditorType>>
  >({
    queryKey: ["/api/component-registry/field-editors"],
  });

  // Get configured fields for current section type
  const configuredFields = useMemo(
    () => allFieldEditors?.[sectionType] || {},
    [allFieldEditors, sectionType],
  );

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
          variant,
          version,
          operations: [
            {
              action: "update_section",
              index: sectionIndex,
              section: parsed as Record<string, unknown>,
            },
          ],
        }),
      });

      if (response.ok) {
        const result = (await response.json()) as {
          success: boolean;
          updatedSections?: unknown[];
          warning?: string;
        };

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
        const error = await response.json();
        setSaveError(error.error || "Failed to save changes");
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
              <RelatedFeaturesPicker
                value={(parsedSection?.related_features as string[]) || []}
                onChange={(value) => updateArrayProperty("related_features", value)}
                locale={locale}
              />
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

                if (!Array.isArray(arrayData) || arrayData.length === 0)
                  return null;
                
                // For display, use the last part of the path as the label
                const arrayFieldLabel = arrayPath.split(".").pop() || arrayPath;

                if (editorType === "icon-picker") {
                  return (
                    <div key={fieldPath} className="space-y-2">
                      <Label className="text-sm font-medium capitalize">
                        {arrayFieldLabel} Icons
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {arrayData.map((item, index) => {
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
                        {arrayData.map((item, index) => {
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
    </div>
  );
}
