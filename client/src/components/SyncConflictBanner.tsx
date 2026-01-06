import { IconAlertTriangle, IconRefresh, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSyncOptional } from "@/contexts/SyncContext";

export function SyncConflictBanner() {
  const sync = useSyncOptional();
  
  if (!sync || !sync.isBehind || !sync.syncStatus?.syncEnabled) {
    return null;
  }

  const behindBy = sync.conflictInfo?.behindBy || 1;
  const commitText = behindBy === 1 ? 'commit' : 'commits';

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
              Remote repository has {behindBy} new {commitText}
            </p>
            <p className="text-xs text-muted-foreground">
              Editing is disabled until you sync. Your local changes may conflict with remote updates.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sync.setShowConflictModal(true)}
            data-testid="button-view-conflicts"
          >
            View Changes
            <IconChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              await sync.syncWithRemote();
              window.location.reload();
            }}
            data-testid="button-sync-now"
          >
            <IconRefresh className="h-4 w-4 mr-1" />
            Sync & Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
