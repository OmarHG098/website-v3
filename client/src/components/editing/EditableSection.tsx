import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { IconPencil, IconArrowsExchange, IconTrash, IconArrowUp, IconArrowDown, IconChevronLeft, IconChevronRight, IconCheck, IconLoader2 } from "@tabler/icons-react";
import type { Section } from "@shared/schema";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getDebugToken } from "@/hooks/useDebugAuth";
import { useToast } from "@/hooks/use-toast";

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
  const [variants, setVariants] = useState<string[]>([]); // All component types
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [versions, setVersions] = useState<string[]>([]);
  const [selectedExample, setSelectedExample] = useState("");
  const [previewSection, setPreviewSection] = useState<Section | null>(null);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedVariant = variants[selectedVariantIndex] || sectionType;

  // Fetch all component types (variants) when popover opens
  useEffect(() => {
    if (!swapPopoverOpen) return;
    setIsLoadingSwap(true);
    const token = getDebugToken();
    fetch(`/api/component-registry`, {
      headers: token ? { 'X-Debug-Token': token } : {}
    })
      .then(res => res.json())
      .then(data => {
        // API returns components as an array of {type: string, ...} objects
        const componentsArray = data.components || [];
        const componentTypes = componentsArray.map((c: { type: string }) => c.type);
        setVariants(componentTypes);
        // Start at the current section type
        const currentIdx = componentTypes.indexOf(sectionType);
        setSelectedVariantIndex(currentIdx >= 0 ? currentIdx : 0);
      })
      .catch(() => setVariants([]))
      .finally(() => setIsLoadingSwap(false));
  }, [swapPopoverOpen, sectionType]);

  // Fetch versions when variant changes, auto-select LAST (latest) version
  useEffect(() => {
    if (!swapPopoverOpen || variants.length === 0) return;
    const variantName = variants[selectedVariantIndex];
    if (!variantName || typeof variantName !== 'string') return;
    
    setIsLoadingSwap(true);
    const token = getDebugToken();
    fetch(`/api/component-registry/${variantName}/versions`, {
      headers: token ? { 'X-Debug-Token': token } : {}
    })
      .then(res => res.json())
      .then(data => {
        const vers = data.versions || [];
        setVersions(vers);
        // Auto-fetch examples using the LAST (latest) version
        if (vers.length > 0) {
          const latestVersion = vers[vers.length - 1];
          fetch(`/api/component-registry/${variantName}/${latestVersion}/examples`, {
            headers: token ? { 'X-Debug-Token': token } : {}
          })
            .then(res => res.json())
            .then(exData => {
              const exs = exData.examples || [];
              // Auto-select FIRST example (check for valid filename)
              const firstExample = exs[0];
              if (firstExample && firstExample.filename) {
                setSelectedExample(firstExample.filename);
                // Fetch example content for preview
                fetch(`/api/component-registry/${variantName}/${latestVersion}/examples/${firstExample.filename}`, {
                  headers: token ? { 'X-Debug-Token': token } : {}
                })
                  .then(res => res.json())
                  .then(contentData => {
                    if (contentData.content) {
                      setPreviewSection({ type: variantName, ...contentData.content } as Section);
                    }
                  })
                  .catch(() => setPreviewSection(null));
              } else {
                setSelectedExample("");
                setPreviewSection(null);
              }
            })
            .catch(() => {
              setSelectedExample("");
              setPreviewSection(null);
            });
        } else {
          setSelectedExample("");
          setPreviewSection(null);
        }
      })
      .catch(() => {
        setVersions([]);
        setSelectedExample("");
        setPreviewSection(null);
      })
      .finally(() => setIsLoadingSwap(false));
  }, [swapPopoverOpen, variants, selectedVariantIndex]);

  // Cycle through variants (component types)
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
              <h4 className="font-medium text-sm">Swap component variant</h4>
              {isLoadingSwap ? (
                <div className="flex items-center justify-center py-4" data-testid={`loader-swap-section-${index}`}>
                  <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : variants.length === 0 ? (
                <p className="text-sm text-muted-foreground" data-testid={`text-no-variants-${index}`}>No component variants available.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <Button size="icon" variant="ghost" onClick={() => cycleVariant(-1)} disabled={variants.length <= 1} data-testid={`button-variant-prev-${index}`}>
                      <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium flex-1 text-center truncate" data-testid={`text-variant-${index}`}>
                      {selectedVariant}
                    </span>
                    <Button size="icon" variant="ghost" onClick={() => cycleVariant(1)} disabled={variants.length <= 1} data-testid={`button-variant-next-${index}`}>
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {versions.length > 0 && (
                    <div className="text-xs text-muted-foreground text-center" data-testid={`text-version-${index}`}>
                      v{versions[versions.length - 1]}
                    </div>
                  )}
                  <Button className="w-full" onClick={handleConfirmSwap} disabled={!previewSection || isConfirming} data-testid={`button-confirm-swap-${index}`}>
                    {isConfirming ? (
                      <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <IconCheck className="h-4 w-4 mr-2" />
                    )}
                    Confirm
                  </Button>
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
      
      {/* Content with pointer events enabled */}
      <div className="relative">
        {children}
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
