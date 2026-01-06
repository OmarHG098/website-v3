import { useState } from "react";
import {
  IconAlertTriangle,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconChevronDown,
  IconChevronRight,
  IconGitCommit,
  IconFile,
  IconUser,
  IconClock,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSync, type RemoteCommit } from "@/contexts/SyncContext";

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommitItem({ commit, isLast }: { commit: RemoteCommit; isLast: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasFiles = commit.files && commit.files.length > 0;
  const firstLine = commit.message.split('\n')[0];

  return (
    <div className="border-b last:border-b-0 border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger 
          className="w-full p-3 flex items-start gap-3 hover-elevate text-left"
          disabled={!hasFiles}
        >
          <div className="mt-0.5">
            <IconGitCommit className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{firstLine}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconUser className="h-3 w-3" />
                {commit.author}
              </span>
              <span className="flex items-center gap-1">
                <IconClock className="h-3 w-3" />
                {formatDate(commit.date)}
              </span>
              <span className="font-mono text-xs">{commit.sha.substring(0, 7)}</span>
            </div>
          </div>
          {hasFiles && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{commit.files.length} files</span>
              {isOpen ? (
                <IconChevronDown className="h-4 w-4" />
              ) : (
                <IconChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </CollapsibleTrigger>
        
        {hasFiles && (
          <CollapsibleContent>
            <div className="px-3 pb-3 pl-10">
              <div className="bg-muted/50 rounded-md p-2 space-y-1">
                {commit.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <IconFile className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono truncate text-muted-foreground" title={file}>
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

export function SyncConflictModal() {
  const { 
    showConflictModal, 
    setShowConflictModal, 
    conflictInfo, 
    syncWithRemote,
    enableForceCommit,
  } = useSync();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!showConflictModal || !conflictInfo) {
    return null;
  }

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const success = await syncWithRemote();
      if (success) {
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceCommit = () => {
    if (!confirm('Are you sure? This will allow you to commit even though remote has newer changes. Your changes will overwrite remote.')) {
      return;
    }
    enableForceCommit();
  };

  const behindBy = conflictInfo.behindBy;
  const commitText = behindBy === 1 ? 'commit' : 'commits';
  const commits = conflictInfo.commits || [];

  return (
    <Dialog open={showConflictModal} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <IconAlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Remote Changes Detected</DialogTitle>
              <DialogDescription>
                The repository has {behindBy} new {commitText} since your last sync.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {commits.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Recent commits:</p>
            <ScrollArea className="h-[200px] border rounded-md">
              {commits.map((commit, idx) => (
                <CommitItem 
                  key={commit.sha} 
                  commit={commit} 
                  isLast={idx === commits.length - 1}
                />
              ))}
            </ScrollArea>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <Button
            className="w-full"
            onClick={handleRefresh}
            disabled={isLoading}
            data-testid="button-sync-refresh"
          >
            <IconRefresh className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync with Remote & Reload
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            This will update your local content to match the remote repository.
          </p>
        </div>

        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-4">
            {showAdvanced ? (
              <IconChevronDown className="h-3 w-3" />
            ) : (
              <IconChevronRight className="h-3 w-3" />
            )}
            Advanced options
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleForceCommit}
              disabled={isLoading}
              data-testid="button-force-overwrite"
            >
              <IconUpload className="h-4 w-4 mr-2" />
              Force Overwrite Remote
            </Button>
            <p className="text-xs text-destructive">
              Warning: This will overwrite remote changes with your local content.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </DialogContent>
    </Dialog>
  );
}
