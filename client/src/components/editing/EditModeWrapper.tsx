import { lazy, Suspense, useState, useCallback } from "react";
import { useDebugAuth } from "@/hooks/useDebugAuth";
import { useEditModeOptional } from "@/contexts/EditModeContext";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { SyncConflictBanner } from "@/components/SyncConflictBanner";
import type { Section } from "@shared/schema";

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

// Sync wrapper that only renders when edit mode is active
// This ensures no GitHub API calls happen until user explicitly enters edit mode
function SyncWrapper({ children }: { children: React.ReactNode }) {
  const editMode = useEditModeOptional();
  
  // Only mount SyncProvider when edit mode is actually active
  // Regular browsers (even with debug capabilities) won't trigger any sync API calls
  if (!editMode?.isEditMode) {
    return <>{children}</>;
  }
  
  return (
    <SyncProvider>
      <SyncConflictBanner />
      {children}
    </SyncProvider>
  );
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
  
  // If not in edit mode, just render children (no editor panel)
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
// Edit capabilities are checked but sync is deferred until edit mode is toggled on
export function EditModeWrapper({ 
  children, 
  sections, 
  contentType, 
  slug, 
  locale 
}: EditModeWrapperProps) {
  const { canEdit, isDebugMode, isLoading } = useDebugAuth();
  
  // Non-debug users: render children directly (no overhead)
  if (!isDebugMode) {
    return <>{children}</>;
  }
  
  // While auth is loading, provide EditModeProvider so the toggle can appear
  // Once loaded, if user has no edit capabilities, they still see the toggle but can't edit
  if (isLoading) {
    // Provide context while loading so DebugBubble can show the toggle
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
  
  // No edit capability: render children directly
  if (!canEdit) {
    return <>{children}</>;
  }
  
  // Has edit capability: provide EditModeProvider for toggle UI
  // SyncWrapper only activates when user actually enters edit mode
  return (
    <EditModeProvider>
      <SyncWrapper>
        <EditModeInner 
          sections={sections} 
          contentType={contentType} 
          slug={slug} 
          locale={locale}
        >
          {children}
        </EditModeInner>
      </SyncWrapper>
    </EditModeProvider>
  );
}
