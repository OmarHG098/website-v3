import { useState, useCallback, useEffect, useRef, lazy, Suspense, useMemo } from "react";
import { IconPencil, IconArrowsExchange, IconTrash, IconArrowUp, IconArrowDown, IconChevronLeft, IconChevronRight, IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import type { Section } from "@shared/schema";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { useToast } from "@/hooks/use-toast";
import { renderSection } from "@/components/SectionRenderer";
import yaml from "js-yaml";

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
  const [examplesWithVariants, setExamplesWithVariants] = useState<{filename: string, variant: string, name: string, yaml: string}[]>([]);
  const [previewSection, setPreviewSection] = useState<Section | null>(null);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedVariant = variants[selectedVariantIndex] || "";

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

  // Update preview when variant changes - parse YAML content locally
  useEffect(() => {
    if (!swapPopoverOpen || !sectionType || examplesWithVariants.length === 0 || variants.length === 0) {
      setPreviewSection(null);
      return;
    }
    const variantSlug = variants[selectedVariantIndex];
    // Find first example with this variant
    const example = examplesWithVariants.find(e => e.variant === variantSlug);
    if (!example || !example.yaml) {
      setPreviewSection(null);
      return;
    }
    
    // Parse YAML content locally
    try {
      const parsed = yaml.load(example.yaml);
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
  }, [swapPopoverOpen, sectionType, examplesWithVariants, variants, selectedVariantIndex]);

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

  const handleConfirmSwap = useCallback(async () => {
    if (!previewSection || !contentType || !slug) return;
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
          sectionData: previewSection
        })
      });
      if (!res.ok) throw new Error('Failed to swap section');
      setCurrentSection(previewSection);
      setSwapPopoverOpen(false);
      toast({ title: "Section swapped", description: "The section variant has been updated. Refresh the page to see changes." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to swap section variant.", variant: "destructive" });
    } finally {
      setIsConfirming(false);
    }
  }, [previewSection, contentType, slug, locale, variant, version, index, toast]);
  
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
          <PopoverContent className="w-72" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Choose another variant or example for {sectionType} {selectedVersion || versions[0] || ""}</h4>
              {isLoadingSwap ? (
                <div className="flex items-center justify-center py-4" data-testid={`loader-swap-section-${index}`}>
                  <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : versions.length === 0 ? (
                <p className="text-sm text-muted-foreground" data-testid={`text-no-variants-${index}`}>No versions available for this component.</p>
              ) : (
                <>
                  {versions.length > 1 ? (
                    <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                      <SelectTrigger className="w-full" data-testid={`select-version-${index}`}>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map(ver => (
                          <SelectItem key={ver} value={ver} data-testid={`option-version-${ver}-${index}`}>v{ver}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-1" data-testid={`text-version-${index}`}>
                      Version: v{versions[0]}
                    </div>
                  )}
                  {variants.length > 0 ? (
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <Button size="icon" variant="ghost" onClick={() => cycleVariant(-1)} disabled={variants.length <= 1} data-testid={`button-variant-prev-${index}`}>
                        <IconChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium flex-1 text-center truncate" data-testid={`text-variant-${index}`}>
                        {selectedVariant || "default"}
                      </span>
                      <Button size="icon" variant="ghost" onClick={() => cycleVariant(1)} disabled={variants.length <= 1} data-testid={`button-variant-next-${index}`}>
                        <IconChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-2">No variants found</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSwapPopoverOpen(false)} data-testid={`button-cancel-swap-${index}`}>
                      <IconX className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleConfirmSwap} disabled={!previewSection || isConfirming} data-testid={`button-confirm-swap-${index}`}>
                      {isConfirming ? (
                        <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <IconCheck className="h-4 w-4 mr-2" />
                      )}
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </div>
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
            <div className="absolute top-0 left-0 right-0 z-30 bg-primary/90 text-primary-foreground text-xs px-3 py-1.5">
              <span className="font-medium flex items-center gap-2">
                {isLoadingSwap ? (
                  <>
                    <IconLoader2 className="h-3 w-3 animate-spin" />
                    Loading preview...
                  </>
                ) : (
                  <>Preview: {selectedVariant || "default"}</>
                )}
              </span>
            </div>
            {/* Render the preview section or original with loading overlay */}
            <div className="pt-8 relative">
              {previewSection ? (
                renderSection(previewSection, index)
              ) : (
                <>
                  {children}
                  {isLoadingSwap && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
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
