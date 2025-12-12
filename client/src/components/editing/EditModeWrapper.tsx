import { lazy, Suspense, useState, useCallback } from "react";
import { useDebugAuth } from "@/hooks/useDebugAuth";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { EditModeProvider } from "@/contexts/EditModeContext";
import type { Section } from "@shared/schema";

// Lazy load the section editor panel
const SectionEditorPanel = lazy(() => 
  import("./SectionEditorPanel").then(mod => ({ default: mod.SectionEditorPanel }))
);

interface EditModeWrapperProps {
  children: React.ReactNode;
  sections?: Section[];
  contentType?: "program" | "landing" | "location";
  slug?: string;
  locale?: string;
}

// Inner component that uses the edit mode context
function EditModeInner({ 
  children, 
  sections, 
  contentType, 
  slug, 
  locale 
}: EditModeWrapperProps) {
  const editMode = useEditModeOptional();
  const [localSections, setLocalSections] = useState<Section[]>(sections || []);
  
  const handleSectionUpdate = useCallback((index: number, updatedSection: Section) => {
    setLocalSections(prev => {
      const next = [...prev];
      next[index] = updatedSection;
      return next;
    });
  }, []);
  
  const handleCloseEditor = useCallback(() => {
    if (editMode) {
      editMode.setSelectedSectionIndex(null);
    }
  }, [editMode]);
  
  // If not in edit mode, just render children
  if (!editMode || !editMode.isEditMode) {
    return <>{children}</>;
  }
  
  const { selectedSectionIndex } = editMode;
  const selectedSection = selectedSectionIndex !== null ? localSections[selectedSectionIndex] : null;
  
  return (
    <>
      {children}
      
      {/* Section Editor Panel - slides in from right */}
      {selectedSection && selectedSectionIndex !== null && contentType && slug && locale && (
        <Suspense fallback={null}>
          <SectionEditorPanel
            section={selectedSection}
            sectionIndex={selectedSectionIndex}
            contentType={contentType}
            slug={slug}
            locale={locale}
            onUpdate={(updated) => handleSectionUpdate(selectedSectionIndex, updated)}
            onClose={handleCloseEditor}
          />
        </Suspense>
      )}
    </>
  );
}

// Main wrapper that provides the context
export function EditModeWrapper({ 
  children, 
  sections, 
  contentType, 
  slug, 
  locale 
}: EditModeWrapperProps) {
  const { canEdit } = useDebugAuth();
  
  // If user can't edit, don't wrap with provider (zero overhead)
  if (!canEdit) {
    return <>{children}</>;
  }
  
  return (
    <EditModeProvider>
      <EditModeInner 
        sections={sections} 
        contentType={contentType} 
        slug={slug} 
        locale={locale}
      >
        {children}
      </EditModeInner>
    </EditModeProvider>
  );
}
