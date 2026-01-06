import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSyncOptional } from "@/contexts/SyncContext";

export function SyncConflictBanner() {
  const sync = useSyncOptional();
  
  // Only show banner when there are actual file changes to sync
  // (not just when sync status is "behind" without specific files)
  const fileCount = sync?.pendingFileCount || 0;
  
  if (!sync || !sync.syncStatus?.syncEnabled || fileCount === 0) {
    return null;
  }

  const fileText = fileCount === 1 ? 'file' : 'files';

  return (
    <div 
      className="bg-destructive/10 border-b border-destructive/20 px-4 py-3"
      data-testid="sync-conflict-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-destructive/20">
            <IconAlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {fileCount} {fileText} need syncing with remote
            </p>
            <p className="text-xs text-muted-foreground">
              Sync changes before editing to avoid conflicts.
            </p>
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={() => sync.setSyncModalOpen(true)}
          data-testid="button-sync-now"
        >
          <IconRefresh className="h-4 w-4 mr-1" />
          Sync with remote
        </Button>
      </div>
    </div>
  );
}
