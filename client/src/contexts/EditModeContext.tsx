import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { Section, EditOperation } from "@shared/schema";
import { getDebugUserName } from "@/hooks/useDebugAuth";

export type PreviewBreakpoint = 'desktop' | 'mobile';

const PREVIEW_BREAKPOINT_KEY = '4geeks_preview_breakpoint';

function getStoredPreviewBreakpoint(): PreviewBreakpoint {
  if (typeof localStorage === 'undefined') return 'desktop';
  const stored = localStorage.getItem(PREVIEW_BREAKPOINT_KEY);
  if (stored === 'mobile' || stored === 'desktop') return stored;
  return 'desktop';
}

interface EditModeContextValue {
  isEditMode: boolean;
  enableEditMode: () => void;
  disableEditMode: () => void;
  toggleEditMode: () => void;
  selectedSectionIndex: number | null;
  setSelectedSectionIndex: (index: number | null) => void;
  pendingChanges: Map<string, EditOperation[]>;
  addPendingChange: (pageKey: string, operation: EditOperation) => void;
  clearPendingChanges: (pageKey: string) => void;
  hasPendingChanges: boolean;
  isSaving: boolean;
  saveChanges: (pageKey: string, contentType: "program" | "landing" | "location", slug: string, locale: string) => Promise<boolean>;
  previewBreakpoint: PreviewBreakpoint;
  setPreviewBreakpoint: (breakpoint: PreviewBreakpoint) => void;
  togglePreviewBreakpoint: () => void;
}

const EditModeContext = createContext<EditModeContextValue | null>(null);

interface EditModeProviderProps {
  children: React.ReactNode;
}

// Check if edit_mode=true is in URL params
function shouldAutoEnableEditMode(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('edit_mode') === 'true';
}

export function EditModeProvider({ children }: EditModeProviderProps) {
  const [isEditMode, setIsEditMode] = useState(shouldAutoEnableEditMode);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, EditOperation[]>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [previewBreakpoint, setPreviewBreakpointState] = useState<PreviewBreakpoint>(getStoredPreviewBreakpoint);

  const setPreviewBreakpoint = useCallback((breakpoint: PreviewBreakpoint) => {
    setPreviewBreakpointState(breakpoint);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PREVIEW_BREAKPOINT_KEY, breakpoint);
    }
  }, []);

  const togglePreviewBreakpoint = useCallback(() => {
    setPreviewBreakpointState(prev => {
      const next = prev === 'desktop' ? 'mobile' : 'desktop';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PREVIEW_BREAKPOINT_KEY, next);
      }
      return next;
    });
  }, []);

  const enableEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const disableEditMode = useCallback(() => {
    setIsEditMode(false);
    setSelectedSectionIndex(null);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => {
      if (prev) {
        setSelectedSectionIndex(null);
      }
      return !prev;
    });
  }, []);

  const addPendingChange = useCallback((pageKey: string, operation: EditOperation) => {
    setPendingChanges(prev => {
      const next = new Map(prev);
      const existing = next.get(pageKey) || [];
      next.set(pageKey, [...existing, operation]);
      return next;
    });
  }, []);

  const clearPendingChanges = useCallback((pageKey: string) => {
    setPendingChanges(prev => {
      const next = new Map(prev);
      next.delete(pageKey);
      return next;
    });
  }, []);

  const hasPendingChanges = useMemo(() => {
    return pendingChanges.size > 0 && Array.from(pendingChanges.values()).some(ops => ops.length > 0);
  }, [pendingChanges]);

  const saveChanges = useCallback(async (
    pageKey: string,
    contentType: "program" | "landing" | "location",
    slug: string,
    locale: string
  ): Promise<boolean> => {
    const operations = pendingChanges.get(pageKey);
    if (!operations || operations.length === 0) {
      return true;
    }

    setIsSaving(true);
    try {
      const token = sessionStorage.getItem("debug_token");
      const author = getDebugUserName() || "Unknown";
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
          operations,
          author,
        }),
      });

      if (response.ok) {
        clearPendingChanges(pageKey);
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to save changes:", error);
        return false;
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [pendingChanges, clearPendingChanges]);

  const value = useMemo(() => ({
    isEditMode,
    enableEditMode,
    disableEditMode,
    toggleEditMode,
    selectedSectionIndex,
    setSelectedSectionIndex,
    pendingChanges,
    addPendingChange,
    clearPendingChanges,
    hasPendingChanges,
    isSaving,
    saveChanges,
    previewBreakpoint,
    setPreviewBreakpoint,
    togglePreviewBreakpoint,
  }), [
    isEditMode,
    enableEditMode,
    disableEditMode,
    toggleEditMode,
    selectedSectionIndex,
    pendingChanges,
    addPendingChange,
    clearPendingChanges,
    hasPendingChanges,
    isSaving,
    saveChanges,
    previewBreakpoint,
    setPreviewBreakpoint,
    togglePreviewBreakpoint,
  ]);

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
}

// Safe hook that returns null if not within provider (for lazy loading)
export function useEditModeOptional(): EditModeContextValue | null {
  return useContext(EditModeContext);
}
