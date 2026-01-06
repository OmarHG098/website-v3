import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { subscribeToContentUpdates } from "@/lib/contentEvents";

export interface RemoteCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  files: string[];
}

export interface ConflictInfo {
  hasConflict: boolean;
  behindBy: number;
  commits: RemoteCommit[];
  lastSyncedCommit: string | null;
  remoteCommit: string | null;
}

export interface SyncStatus {
  configured: boolean;
  syncEnabled: boolean;
  localCommit: string | null;
  remoteCommit: string | null;
  status: 'in-sync' | 'behind' | 'ahead' | 'diverged' | 'unknown' | 'not-configured' | 'invalid-credentials';
  behindBy?: number;
  aheadBy?: number;
  repoUrl?: string;
  branch?: string;
}

interface SyncContextValue {
  syncStatus: SyncStatus | null;
  conflictInfo: ConflictInfo | null;
  isLoading: boolean;
  isBehind: boolean;
  editingDisabled: boolean;
  forceCommitEnabled: boolean;
  checkForConflicts: () => Promise<void>;
  syncWithRemote: () => Promise<boolean>;
  enableForceCommit: () => void;
  refreshSyncStatus: () => void;
  // Sync modal state (shared between DebugBubble and SyncConflictBanner)
  syncModalOpen: boolean;
  setSyncModalOpen: (open: boolean) => void;
  pendingFileCount: number;
}

const SyncContext = createContext<SyncContextValue | null>(null);

interface SyncProviderProps {
  children: React.ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const queryClient = useQueryClient();
  const [conflictInfo, setConflictInfo] = useState<ConflictInfo | null>(null);
  const [forceCommitEnabled, setForceCommitEnabled] = useState(false);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncModalDismissed, setSyncModalDismissed] = useState(false);

  const { data: syncStatus, isLoading, refetch: refreshSyncStatus } = useQuery<SyncStatus>({
    queryKey: ['/api/github/sync-status'],
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  // Query pending changes to get file count
  interface PendingChange {
    file: string;
    source: 'local' | 'incoming' | 'conflict';
  }
  const { data: pendingChanges } = useQuery<PendingChange[]>({
    queryKey: ['/api/github/all-changes'],
    enabled: syncStatus?.syncEnabled === true,
    refetchInterval: 30000,
  });

  const pendingFileCount = pendingChanges?.length ?? 0;

  const isBehind = useMemo(() => {
    return syncStatus?.status === 'behind' || syncStatus?.status === 'diverged';
  }, [syncStatus]);

  const editingDisabled = useMemo(() => {
    if (forceCommitEnabled) return false;
    return isBehind && syncStatus?.syncEnabled === true;
  }, [isBehind, syncStatus?.syncEnabled, forceCommitEnabled]);

  const enableForceCommit = useCallback(() => {
    setForceCommitEnabled(true);
  }, []);

  const checkForConflicts = useCallback(async () => {
    try {
      const response = await fetch('/api/github/conflict-info');
      if (response.ok) {
        const info: ConflictInfo = await response.json();
        setConflictInfo(info);
      }
    } catch (error) {
      console.error('Error checking for conflicts:', error);
    }
  }, []);

  const syncWithRemote = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setConflictInfo(null);
        setForceCommitEnabled(false);
        await refreshSyncStatus();
        queryClient.invalidateQueries({ queryKey: ['/api/github/pending-changes'] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error syncing with remote:', error);
      return false;
    }
  }, [refreshSyncStatus, queryClient]);

  useEffect(() => {
    if (syncStatus?.syncEnabled && isBehind) {
      checkForConflicts();
    }
  }, [syncStatus?.syncEnabled, isBehind, checkForConflicts]);

  // Auto-open sync modal when there are pending changes (unless user dismissed it)
  useEffect(() => {
    if (pendingFileCount > 0 && !syncModalDismissed && syncStatus?.syncEnabled) {
      setSyncModalOpen(true);
    }
  }, [pendingFileCount, syncModalDismissed, syncStatus?.syncEnabled]);

  // Wrapper for setSyncModalOpen that tracks dismissal
  const handleSetSyncModalOpen = useCallback((open: boolean) => {
    setSyncModalOpen(open);
    if (!open) {
      setSyncModalDismissed(true);
    }
  }, []);

  // Subscribe to content updates and refresh sync status when content is edited
  useEffect(() => {
    const unsubscribe = subscribeToContentUpdates(() => {
      // Invalidate pending changes query to refresh the sync indicator
      queryClient.invalidateQueries({ queryKey: ['/api/github/pending-changes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/github/all-changes'] });
      // Also refresh the main sync status
      refreshSyncStatus();
    });
    return unsubscribe;
  }, [queryClient, refreshSyncStatus]);

  const value: SyncContextValue = {
    syncStatus: syncStatus ?? null,
    conflictInfo,
    isLoading,
    isBehind,
    editingDisabled,
    forceCommitEnabled,
    checkForConflicts,
    syncWithRemote,
    enableForceCommit,
    refreshSyncStatus: () => { refreshSyncStatus(); },
    syncModalOpen,
    setSyncModalOpen: handleSetSyncModalOpen,
    pendingFileCount,
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
}

export function useSyncOptional() {
  return useContext(SyncContext);
}
