import { useState, useCallback, useEffect, useRef, lazy, Suspense, useMemo } from "react";
import { IconPencil, IconArrowsExchange, IconTrash, IconArrowUp, IconArrowDown, IconChevronLeft, IconChevronRight, IconCheck, IconLoader2, IconX, IconSparkles } from "@tabler/icons-react";
import type { Section } from "@shared/schema";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { useToast } from "@/hooks/use-toast";
import { refreshContent } from "@/lib/contentRefresh";
import { renderSection } from "@/components/SectionRenderer";
import yaml from "js-yaml";

// Convert slug/camelCase to human readable format
function deslugify(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

const SectionEditorPanel = lazy(() => 
  import("./SectionEditorPanel").then(mod => ({ default: mod.SectionEditorPanel }))
);

interface EditableSectionProps {
  children: React.ReactNode;
  section: Section;
  index: number;
  sectionType: string;
  contentType?: "program" | "landing" | "location" | "page";
  slug?: string;
  locale?: string;
  variant?: string;
  version?: number;
  totalSections?: number;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export function EditableSection({ children, section, index, sectionType, contentType, slug, locale, variant, version, totalSections = 0, onMoveUp, onMoveDown, onDelete }: EditableSectionProps) {
  const editMode = useEditModeOptional();
  const { toast } = useToast();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>(section);
  
  const canMoveUp = index > 0;
  const canMoveDown = totalSections > 0 && index < totalSections - 1;
  
  // Swap popover state
  const [swapPopoverOpen, setSwapPopoverOpen] = useState(false);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [variants, setVariants] = useState<string[]>([]); // Unique variant slugs from examples
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0); // Index within current variant's examples
  const [examplesWithVariants, setExamplesWithVariants] = useState<{filename: string, variant: string, name: string, yaml: string}[]>([]);
  const [previewSection, setPreviewSection] = useState<Section | null>(null);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showVersionPicker, setShowVersionPicker] = useState(false);
  
  // AI adaptation state
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptedSection, setAdaptedSection] = useState<Section | null>(null);
  const [hasAdapted, setHasAdapted] = useState(false);

  const selectedVariant = variants[selectedVariantIndex] || "";
  
  // Get examples for the currently selected variant
  const examplesForCurrentVariant = useMemo(() => {
    return examplesWithVariants.filter(e => e.variant === selectedVariant);
  }, [examplesWithVariants, selectedVariant]);
  
  const currentExample = examplesForCurrentVariant[selectedExampleIndex] || null;

  // Get current section's version from the section object
  const currentSectionVersion = (section as { version?: string }).version || "";
  
  // Ref to track active version for race condition prevention
  const activeVersionRef = useRef<string>("");

  // Fetch versions when popover opens
  useEffect(() => {
    if (!swapPopoverOpen || !sectionType) return;
    setIsLoadingSwap(true);
    const token = getDebugToken();
    fetch(`/api/component-registry/${sectionType}/versions`, {
      headers: token ? { 'X-Debug-Token': token } : {}
    })
      .then(res => res.json())
      .then(data => {
        const vers: string[] = data.versions || [];
        setVersions(vers);
        // Use current section's version if available, otherwise use latest
        if (currentSectionVersion && vers.includes(currentSectionVersion)) {
          setSelectedVersion(currentSectionVersion);
        } else if (vers.length > 0) {
          setSelectedVersion(vers[vers.length - 1]);
        }
      })
      .catch(() => setVersions([]))
      .finally(() => setIsLoadingSwap(false));
  }, [swapPopoverOpen, sectionType, currentSectionVersion]);

  // Fetch examples and extract variants when version changes
  useEffect(() => {
    if (!swapPopoverOpen || !sectionType || !selectedVersion) return;
    
    // Reset state immediately when version changes to prevent stale data
    setExamplesWithVariants([]);
    setVariants([]);
    setPreviewSection(null);
    setIsLoadingSwap(true);
    
    // Track this as the active version request
    const requestedVersion = selectedVersion;
    activeVersionRef.current = requestedVersion;
    
    const token = getDebugToken();
    
    fetch(`/api/component-registry/${sectionType}/${selectedVersion}/examples`, {
      headers: token ? { 'X-Debug-Token': token } : {}
    })
      .then(res => res.json())
      .then((data) => {
        // Bail if a newer version request has started
        if (activeVersionRef.current !== requestedVersion) return;
        
        // API returns examples with variant and yaml properties
        const exs: {name: string, filename?: string, variant?: string, yaml?: string}[] = data.examples || [];
        
        // Map examples to our format - include yaml for parsing
        const examplesData = exs.map(ex => ({
          filename: ex.filename || ex.name?.toLowerCase().replace(/\s+/g, '-') + '.yml',
          variant: ex.variant || "default",
          name: ex.name || "",
          yaml: ex.yaml || ""
        }));
        
        setExamplesWithVariants(examplesData);
        
        // Extract unique variants
        const uniqueVariants = Array.from(new Set(examplesData.map(e => e.variant)));
        setVariants(uniqueVariants);
        
        // Try to select current section's variant, or first available
        const currentVariant = (section as { variant?: string }).variant || "default";
        const currentIdx = uniqueVariants.indexOf(currentVariant);
        setSelectedVariantIndex(currentIdx >= 0 ? currentIdx : 0);
      })
      .catch(() => {
        if (activeVersionRef.current === requestedVersion) {
          setExamplesWithVariants([]);
          setVariants([]);
        }
      })
      .finally(() => {
        if (activeVersionRef.current === requestedVersion) {
          setIsLoadingSwap(false);
        }
      });
  }, [swapPopoverOpen, sectionType, selectedVersion, section]);

  // Reset example index and adaptation state when variant changes
  useEffect(() => {
    setSelectedExampleIndex(0);
    setAdaptedSection(null);
    setHasAdapted(false);
  }, [selectedVariantIndex]);
  
  // Reset adaptation state when example changes
  useEffect(() => {
    setAdaptedSection(null);
    setHasAdapted(false);
  }, [selectedExampleIndex]);

  // Update preview when variant or example changes - parse YAML content locally
  useEffect(() => {
    if (!swapPopoverOpen || !sectionType || !currentExample || !currentExample.yaml) {
      setPreviewSection(null);
      return;
    }
    
    // Parse YAML content locally
    try {
      const parsed = yaml.load(currentExample.yaml);
      // Handle both array format (sections list) and object format (single section)
      let sectionData: Record<string, unknown>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        sectionData = parsed[0] as Record<string, unknown>;
      } else if (parsed && typeof parsed === 'object') {
        sectionData = parsed as Record<string, unknown>;
      } else {
        setPreviewSection(null);
        return;
      }
      setPreviewSection({ type: sectionType, ...sectionData } as Section);
    } catch (err) {
      console.error("Failed to parse example YAML:", err);
      setPreviewSection(null);
    }
  }, [swapPopoverOpen, sectionType, currentExample]);

  // Cycle through variants
  const cycleVariant = useCallback((direction: number) => {
    if (variants.length === 0) return;
    setSelectedVariantIndex(prev => {
      let next = prev + direction;
      if (next < 0) next = variants.length - 1;
      if (next >= variants.length) next = 0;
      return next;
    });
  }, [variants.length]);

  // Cycle through examples within current variant
  const cycleExample = useCallback((direction: number) => {
    if (examplesForCurrentVariant.length <= 1) return;
    setSelectedExampleIndex(prev => {
      let next = prev + direction;
      if (next < 0) next = examplesForCurrentVariant.length - 1;
      if (next >= examplesForCurrentVariant.length) next = 0;
      return next;
    });
  }, [examplesForCurrentVariant.length]);

  // Handle AI adaptation of the selected variant
  const handleAdaptWithAI = useCallback(async () => {
    if (!currentExample?.yaml || !contentType || !slug || !sectionType) return;
    
    setIsAdapting(true);
    try {
      const token = getDebugToken();
      
      // Map contentType prop format to API format
      const contentTypeMap: Record<string, string> = {
        'program': 'programs',
        'landing': 'landings',
        'location': 'locations',
        'page': 'pages'
      };
      
      const res = await fetch('/api/content/adapt-with-ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'X-Debug-Token': token } : {})
        },
        body: JSON.stringify({
          contentType: contentTypeMap[contentType] || contentType,
          contentSlug: slug,
          targetComponent: sectionType,
          targetVersion: selectedVersion || 'v1.0',
          targetVariant: selectedVariant || currentExample.variant || 'default',
          sourceYaml: currentExample.yaml
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to adapt content with AI');
      }
      
      const data = await res.json();
      
      // Parse the adapted YAML
      const adaptedYaml = data.adaptedYaml || data.yaml;
      if (!adaptedYaml) {
        throw new Error('No adapted content returned');
      }
      
      const parsed = yaml.load(adaptedYaml);
      let sectionData: Record<string, unknown>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        sectionData = parsed[0] as Record<string, unknown>;
      } else if (parsed && typeof parsed === 'object') {
        sectionData = parsed as Record<string, unknown>;
      } else {
        throw new Error('Invalid adapted content format');
      }
      
      const adapted = { type: sectionType, ...sectionData } as Section;
      setAdaptedSection(adapted);
      setHasAdapted(true);
      toast({ title: "Content adapted", description: "AI has adapted the content to match your brand. Review and confirm." });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to adapt content';
      toast({ title: "AI Adaptation Error", description: message, variant: "destructive" });
    } finally {
      setIsAdapting(false);
    }
  }, [currentExample, contentType, slug, sectionType, selectedVersion, toast]);

  const handleConfirmSwap = useCallback(async () => {
    // Use adapted section if available, otherwise use preview section
    const sectionToSave = hasAdapted && adaptedSection ? adaptedSection : previewSection;
    if (!sectionToSave || !contentType || !slug) return;
    
    setIsConfirming(true);
    try {
      const token = getDebugToken();
      const res = await fetch('/api/content/edit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'X-Debug-Token': token } : {})
        },
        body: JSON.stringify({
          operation: 'update_section',
          contentType,
          slug,
          locale: locale || 'en',
          variant: variant || 'default',
          version: version || 1,
          sectionIndex: index,
          sectionData: sectionToSave
        })
      });
      if (!res.ok) throw new Error('Failed to swap section');
      setCurrentSection(sectionToSave);
      setSwapPopoverOpen(false);
      setAdaptedSection(null);
      setHasAdapted(false);
      // Refresh content to update the page
      await refreshContent(contentType, slug, locale || 'en');
      toast({ title: "Section swapped", description: "The section variant has been updated." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to swap section variant.", variant: "destructive" });
    } finally {
      setIsConfirming(false);
    }
  }, [previewSection, adaptedSection, hasAdapted, contentType, slug, locale, variant, version, index, toast]);
  
  const handleOpenEditor = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditorOpen(true);
  }, []);
  
  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);
  
  const handleUpdate = useCallback((updatedSection: Section) => {
    setCurrentSection(updatedSection);
  }, []);
  
  // If not in edit mode context or edit mode is not active, render children directly
  if (!editMode || !editMode.isEditMode) {
    return <>{children}</>;
  }
  
  return (
    <div 
      className="relative group"
      data-edit-section-index={index}
      data-edit-section-type={sectionType}
    >
      {/* Edit overlay - only visible on hover when in edit mode */}
      <div 
        className={`
          absolute inset-0 z-40 pointer-events-none transition-all duration-150
          ${isEditorOpen 
            ? "ring-2 ring-primary ring-offset-2" 
            : swapPopoverOpen
              ? "border-l-2 border-r-2 border-b-2 border-primary"
              : "group-hover:ring-2 group-hover:ring-primary/50 group-hover:ring-offset-1"
          }
        `}
      />
      
      {/* Edit controls - visible on hover */}
      <div 
        className={`
          absolute top-2 right-2 z-50 flex items-center gap-1 
          transition-opacity duration-150
          ${isEditorOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        <button
          onClick={handleOpenEditor}
          className="p-2 bg-primary text-primary-foreground rounded-md shadow-lg hover-elevate flex items-center gap-1.5"
          data-testid={`button-edit-section-${index}`}
        >
          <IconPencil className="h-4 w-4" />
          <span className="text-xs font-medium">{sectionType}</span>
        </button>
        {onMoveUp && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(index); }}
            disabled={!canMoveUp}
            className={`p-2 bg-muted text-muted-foreground rounded-md shadow-lg hover-elevate ${!canMoveUp ? 'opacity-40 cursor-not-allowed' : ''}`}
            data-testid={`button-move-up-section-${index}`}
            title="Move section up"
          >
            <IconArrowUp className="h-4 w-4" />
          </button>
        )}
        {onMoveDown && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(index); }}
            disabled={!canMoveDown}
            className={`p-2 bg-muted text-muted-foreground rounded-md shadow-lg hover-elevate ${!canMoveDown ? 'opacity-40 cursor-not-allowed' : ''}`}
            data-testid={`button-move-down-section-${index}`}
            title="Move section down"
          >
            <IconArrowDown className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(index); }}
            className="p-2 bg-destructive text-destructive-foreground rounded-md shadow-lg hover-elevate"
            data-testid={`button-delete-section-${index}`}
            title="Delete section"
          >
            <IconTrash className="h-4 w-4" />
          </button>
        )}
        <Popover open={swapPopoverOpen} onOpenChange={setSwapPopoverOpen}>
          <PopoverTrigger asChild>
            <button 
              className="p-2 bg-muted text-muted-foreground rounded-md shadow-lg hover-elevate" 
              title="Swap variant"
              data-testid={`button-swap-section-${index}`}
            >
              <IconArrowsExchange className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-[500px] max-w-[700px] p-2" onClick={(e) => e.stopPropagation()}>
            {isLoadingSwap ? (
              <div className="flex items-center justify-center py-2 px-4" data-testid={`loader-swap-section-${index}`}>
                <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                <span className="text-xs text-muted-foreground">Loading variants...</span>
              </div>
            ) : versions.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2" data-testid={`text-no-variants-${index}`}>No versions available</p>
            ) : (
              <div className="flex items-center gap-3">
                {/* Left: Component + Version badges */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-muted"
                    data-testid={`badge-component-${index}`}
                  >
                    {sectionType}
                  </span>
                  <span 
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-muted ${versions.length > 1 ? 'cursor-pointer hover-elevate' : ''}`}
                    onClick={() => versions.length > 1 && setShowVersionPicker(!showVersionPicker)}
                    data-testid={`badge-version-${index}`}
                  >
                    {selectedVersion || versions[0] || ""}
                    {versions.length > 1 && <IconPencil className="h-3 w-3" />}
                  </span>
                </div>
                
                {/* Divider */}
                <div className="w-px h-6 bg-border shrink-0" />
                
                {/* Center: Variant navigation */}
                {variants.length > 0 ? (
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => cycleVariant(-1)} disabled={variants.length <= 1} data-testid={`button-variant-prev-${index}`}>
                      <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-medium truncate min-w-[80px] text-center" data-testid={`text-variant-${index}`}>
                      {deslugify(selectedVariant || "default")}
                      {examplesForCurrentVariant.length > 1 && (
                        <span className="text-muted-foreground ml-1">({selectedExampleIndex + 1}/{examplesForCurrentVariant.length})</span>
                      )}
                    </span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => cycleVariant(1)} disabled={variants.length <= 1} data-testid={`button-variant-next-${index}`}>
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                    {/* Example navigation (only if multiple examples in variant) */}
                    {examplesForCurrentVariant.length > 1 && (
                      <>
                        <div className="w-px h-4 bg-border/50 shrink-0" />
                        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={() => cycleExample(-1)} data-testid={`button-example-prev-${index}`}>
                          <IconChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0" onClick={() => cycleExample(1)} data-testid={`button-example-next-${index}`}>
                          <IconChevronRight className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No variants</span>
                )}
                
                {/* Divider */}
                <div className="w-px h-6 bg-border shrink-0" />
                
                {/* Right: Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setSwapPopoverOpen(false); setAdaptedSection(null); setHasAdapted(false); }} data-testid={`button-cancel-swap-${index}`} title="Cancel">
                    <IconX className="h-4 w-4" />
                  </Button>
                  {hasAdapted ? (
                    <Button size="sm" className="h-7 px-3" onClick={handleConfirmSwap} disabled={!adaptedSection || isConfirming} data-testid={`button-confirm-swap-${index}`}>
                      {isConfirming ? (
                        <IconLoader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <IconCheck className="h-3 w-3 mr-1" />
                      )}
                      Confirm
                    </Button>
                  ) : (
                    <Button size="sm" className="h-7 px-3" onClick={handleAdaptWithAI} disabled={!previewSection || isAdapting} data-testid={`button-adapt-ai-${index}`}>
                      {isAdapting ? (
                        <IconLoader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <IconSparkles className="h-3 w-3 mr-1" />
                      )}
                      {isAdapting ? 'Adapting...' : 'Adapt'}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {/* Version picker dropdown (shown conditionally) */}
            {showVersionPicker && versions.length > 1 && (
              <div className="mt-2 pt-2 border-t">
                <Select value={selectedVersion} onValueChange={(val) => { setSelectedVersion(val); setShowVersionPicker(false); }}>
                  <SelectTrigger className="w-full h-8 text-xs" data-testid={`select-version-${index}`}>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map(ver => (
                      <SelectItem key={ver} value={ver} data-testid={`option-version-${ver}-${index}`}>{ver}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Section label - bottom left */}
      <div 
        className={`
          absolute bottom-2 left-2 z-50 
          px-2 py-1 bg-muted/90 backdrop-blur-sm rounded text-xs text-muted-foreground
          transition-opacity duration-150
          ${isEditorOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        Section {index + 1}
      </div>
      
      {/* Content with pointer events enabled - show preview section when cycling variants */}
      <div className="relative">
        {swapPopoverOpen ? (
          <>
            {/* Preview indicator banner */}
            <div className={`absolute top-0 left-0 right-0 z-30 text-xs px-3 py-1.5 ${hasAdapted ? 'bg-green-600' : 'bg-primary/90'} text-primary-foreground`}>
              <span className="font-medium flex items-center gap-2">
                {isLoadingSwap ? (
                  <>
                    <IconLoader2 className="h-3 w-3 animate-spin" />
                    Loading preview...
                  </>
                ) : isAdapting ? (
                  <>
                    <IconLoader2 className="h-3 w-3 animate-spin" />
                    Adapting content with AI...
                  </>
                ) : hasAdapted ? (
                  <>
                    <IconSparkles className="h-3 w-3" />
                    AI Adapted: {selectedVariant || "default"}{examplesForCurrentVariant.length > 1 && currentExample?.name ? ` - ${currentExample.name}` : ""}
                  </>
                ) : (
                  <>Preview: {selectedVariant || "default"}{examplesForCurrentVariant.length > 1 && currentExample?.name ? ` - ${currentExample.name}` : ""}</>
                )}
              </span>
            </div>
            {/* Render the preview section or original with loading overlay */}
            <div className="pt-8 relative">
              {hasAdapted && adaptedSection ? (
                renderSection(adaptedSection, index)
              ) : previewSection ? (
                renderSection(previewSection, index)
              ) : (
                <>
                  {children}
                  {(isLoadingSwap || isAdapting) && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
                        {isAdapting && <span className="text-sm text-muted-foreground">Adapting with AI...</span>}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          children
        )}
      </div>
      
      {/* Editor Panel - slides in when open */}
      {isEditorOpen && (
        <Suspense fallback={null}>
          <SectionEditorPanel
            section={currentSection}
            sectionIndex={index}
            contentType={contentType}
            slug={slug}
            locale={locale}
            variant={variant}
            version={version}
            onUpdate={handleUpdate}
            onClose={handleCloseEditor}
          />
        </Suspense>
      )}
    </div>
  );
}
