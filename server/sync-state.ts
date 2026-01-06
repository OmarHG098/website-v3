/**
 * Sync State Management
 * 
 * Tracks the synchronization state between local content files and GitHub.
 * Uses a .sync-state.json file to persist state across deployments.
 * Works without git CLI - uses file hashes and GitHub API for comparison.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const SYNC_STATE_PATH = path.join(process.cwd(), 'marketing-content', '.sync-state.json');
const MARKETING_CONTENT_DIR = path.join(process.cwd(), 'marketing-content');

/**
 * Check if a file should be tracked by the sync system.
 * Only tracks YAML files in marketing-content directory.
 * Excludes component-registry (version schemas/examples are managed separately).
 */
export function shouldTrackFile(filePath: string): boolean {
  if (!filePath.startsWith('marketing-content/')) {
    return false;
  }
  
  // Exclude component-registry (managed separately, too many versioned files)
  if (filePath.includes('component-registry/')) {
    return false;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== '.yml' && ext !== '.yaml') {
    return false;
  }
  
  return true;
}

export interface FileSyncInfo {
  sha: string;
  lastModified: number;
  remoteSha?: string;
}

export interface SyncState {
  lastSyncedCommit: string | null;
  lastSyncedAt: string | null;
  files: Record<string, FileSyncInfo>;
}

export interface PendingChange {
  file: string;
  status: 'modified' | 'added' | 'deleted';
  source: 'local' | 'incoming' | 'conflict';
  contentType: string;
  slug: string;
  localSha: string;
  remoteSha?: string;
  author?: string;
}

const DEFAULT_SYNC_STATE: SyncState = {
  lastSyncedCommit: null,
  lastSyncedAt: null,
  files: {},
};

/**
 * Compute SHA-256 hash of file content (matches GitHub's blob SHA computation style)
 */
export function computeFileSha(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Load sync state from .sync-state.json
 * Automatically prunes any non-YAML files from the state
 */
export function loadSyncState(): SyncState {
  try {
    if (fs.existsSync(SYNC_STATE_PATH)) {
      const content = fs.readFileSync(SYNC_STATE_PATH, 'utf-8');
      const state = JSON.parse(content) as SyncState;
      
      // Prune non-YAML files from state
      const prunedFiles: Record<string, FileSyncInfo> = {};
      let pruned = false;
      for (const [filePath, info] of Object.entries(state.files)) {
        if (shouldTrackFile(filePath)) {
          prunedFiles[filePath] = info;
        } else {
          pruned = true;
        }
      }
      
      if (pruned) {
        state.files = prunedFiles;
        saveSyncState(state);
      }
      
      return state;
    }
  } catch (error) {
    console.error('Error loading sync state:', error);
  }
  return { ...DEFAULT_SYNC_STATE };
}

/**
 * Save sync state to .sync-state.json
 */
export function saveSyncState(state: SyncState): void {
  try {
    const dir = path.dirname(SYNC_STATE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SYNC_STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving sync state:', error);
  }
}

/**
 * Mark a file as modified (dirty) after an edit
 * Only tracks YAML files in marketing-content directory
 */
export function markFileAsModified(filePath: string): void {
  const relativePath = filePath.startsWith('marketing-content/') 
    ? filePath 
    : `marketing-content/${filePath}`;
  
  // Only track YAML files
  if (!shouldTrackFile(relativePath)) {
    return;
  }
  
  const state = loadSyncState();
  const fullPath = path.join(process.cwd(), relativePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const sha = computeFileSha(content);
    const stats = fs.statSync(fullPath);
    
    state.files[relativePath] = {
      sha,
      lastModified: stats.mtimeMs,
      remoteSha: state.files[relativePath]?.remoteSha,
    };
    
    saveSyncState(state);
  }
}

/**
 * Get all YAML files in marketing-content directory
 */
function getAllContentFiles(): string[] {
  const files: string[] = [];
  
  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.')) {
          walkDir(fullPath);
        }
      } else if (entry.name.endsWith('.yml') || entry.name.endsWith('.yaml')) {
        const relativePath = path.relative(process.cwd(), fullPath);
        files.push(relativePath);
      }
    }
  }
  
  walkDir(MARKETING_CONTENT_DIR);
  return files;
}

/**
 * Extract content type and slug from file path
 */
function parseContentPath(filePath: string): { contentType: string; slug: string } {
  const pathMatch = filePath.match(/marketing-content\/(programs|landings|locations|pages|component-registry)\/([^\/]+)/);
  return {
    contentType: pathMatch?.[1] || 'unknown',
    slug: pathMatch?.[2] || path.basename(filePath, path.extname(filePath)),
  };
}

/**
 * Detect pending changes by comparing current file hashes against stored state
 * Only tracks YAML files in marketing-content, deduplicates results
 */
export function detectPendingChanges(): PendingChange[] {
  const state = loadSyncState();
  const changesMap = new Map<string, PendingChange>();
  const currentFiles = getAllContentFiles();
  const processedFiles = new Set<string>();
  
  for (const filePath of currentFiles) {
    // Double-check file should be tracked
    if (!shouldTrackFile(filePath)) {
      continue;
    }
    
    processedFiles.add(filePath);
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const currentSha = computeFileSha(content);
      const storedInfo = state.files[filePath];
      
      const { contentType, slug } = parseContentPath(filePath);
      
      if (!storedInfo) {
        changesMap.set(filePath, {
          file: filePath,
          status: 'added',
          source: 'local',
          contentType,
          slug,
          localSha: currentSha,
        });
      } else if (storedInfo.remoteSha && storedInfo.remoteSha !== currentSha) {
        changesMap.set(filePath, {
          file: filePath,
          status: 'modified',
          source: 'local',
          contentType,
          slug,
          localSha: currentSha,
          remoteSha: storedInfo.remoteSha,
        });
      } else if (storedInfo.sha !== currentSha) {
        changesMap.set(filePath, {
          file: filePath,
          status: 'modified',
          source: 'local',
          contentType,
          slug,
          localSha: currentSha,
          remoteSha: storedInfo.remoteSha,
        });
      }
    } catch (error) {
      console.error(`Error checking file ${filePath}:`, error);
    }
  }
  
  // Check for deleted files (in state but not on disk)
  for (const [filePath, info] of Object.entries(state.files)) {
    if (!processedFiles.has(filePath) && shouldTrackFile(filePath) && info.remoteSha) {
      const { contentType, slug } = parseContentPath(filePath);
      changesMap.set(filePath, {
        file: filePath,
        status: 'deleted',
        source: 'local',
        contentType,
        slug,
        localSha: '',
        remoteSha: info.remoteSha,
      });
    }
  }
  
  return Array.from(changesMap.values());
}

/**
 * Update sync state after a successful commit
 * Only tracks YAML files in marketing-content directory
 */
export function updateSyncStateAfterCommit(
  commitSha: string,
  committedFiles: string[]
): void {
  const state = loadSyncState();
  
  state.lastSyncedCommit = commitSha;
  state.lastSyncedAt = new Date().toISOString();
  
  for (const filePath of committedFiles) {
    // Only track YAML files
    if (!shouldTrackFile(filePath)) {
      continue;
    }
    
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const sha = computeFileSha(content);
      const stats = fs.statSync(fullPath);
      
      state.files[filePath] = {
        sha,
        lastModified: stats.mtimeMs,
        remoteSha: sha,
      };
    } else {
      delete state.files[filePath];
    }
  }
  
  saveSyncState(state);
}

/**
 * Initialize sync state from GitHub remote
 * Call this when syncing with remote for the first time or after pulling changes
 * Only tracks YAML files in marketing-content directory
 */
export function initializeSyncStateFromRemote(
  commitSha: string,
  remoteFiles: Array<{ path: string; sha: string }>
): void {
  const state: SyncState = {
    lastSyncedCommit: commitSha,
    lastSyncedAt: new Date().toISOString(),
    files: {},
  };
  
  for (const file of remoteFiles) {
    // Only track YAML files in marketing-content
    if (!shouldTrackFile(file.path)) {
      continue;
    }
    
    const fullPath = path.join(process.cwd(), file.path);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const localSha = computeFileSha(content);
      const stats = fs.statSync(fullPath);
      
      state.files[file.path] = {
        sha: localSha,
        lastModified: stats.mtimeMs,
        remoteSha: file.sha,
      };
    }
  }
  
  saveSyncState(state);
}

/**
 * Rebuild sync state from current local files after syncing with remote.
 * Sets both sha and remoteSha to the current local hash (since local = remote after sync).
 * This prevents all files from appearing as "added" after a sync.
 */
export function rebuildSyncStateFromLocal(commitSha: string): void {
  const currentFiles = getAllContentFiles();
  const state: SyncState = {
    lastSyncedCommit: commitSha,
    lastSyncedAt: new Date().toISOString(),
    files: {},
  };
  
  for (const filePath of currentFiles) {
    if (!shouldTrackFile(filePath)) {
      continue;
    }
    
    const fullPath = path.join(process.cwd(), filePath);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const sha = computeFileSha(content);
      const stats = fs.statSync(fullPath);
      
      state.files[filePath] = {
        sha,
        lastModified: stats.mtimeMs,
        remoteSha: sha, // Local = remote after sync
      };
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }
  
  saveSyncState(state);
}

/**
 * Get the last synced commit SHA
 */
export function getLastSyncedCommit(): string | null {
  const state = loadSyncState();
  return state.lastSyncedCommit;
}

/**
 * Get status for a single file (local sha, remote sha, conflict state)
 */
export function getFileStatus(filePath: string): {
  exists: boolean;
  localSha: string | null;
  remoteSha: string | null;
  hasConflict: boolean;
  status: 'synced' | 'modified' | 'added' | 'deleted' | 'conflict' | 'unknown';
} {
  const relativePath = filePath.startsWith('marketing-content/') 
    ? filePath 
    : `marketing-content/${filePath}`;
  
  if (!shouldTrackFile(relativePath)) {
    return { exists: false, localSha: null, remoteSha: null, hasConflict: false, status: 'unknown' };
  }
  
  const state = loadSyncState();
  const fullPath = path.join(process.cwd(), relativePath);
  const storedInfo = state.files[relativePath];
  
  // Check if file exists locally
  if (!fs.existsSync(fullPath)) {
    // File deleted locally but exists in remote
    if (storedInfo?.remoteSha) {
      return { exists: false, localSha: null, remoteSha: storedInfo.remoteSha, hasConflict: false, status: 'deleted' };
    }
    return { exists: false, localSha: null, remoteSha: null, hasConflict: false, status: 'unknown' };
  }
  
  // Compute current local SHA
  const content = fs.readFileSync(fullPath, 'utf-8');
  const localSha = computeFileSha(content);
  const remoteSha = storedInfo?.remoteSha || null;
  
  // Determine status
  if (!remoteSha) {
    // No remote SHA known - file is new/added
    return { exists: true, localSha, remoteSha: null, hasConflict: false, status: 'added' };
  }
  
  if (localSha === remoteSha) {
    return { exists: true, localSha, remoteSha, hasConflict: false, status: 'synced' };
  }
  
  // Local differs from remote - modified
  return { exists: true, localSha, remoteSha, hasConflict: false, status: 'modified' };
}

/**
 * Update a single file's remote SHA after pulling from remote
 */
export function updateFileAfterPull(filePath: string): void {
  const relativePath = filePath.startsWith('marketing-content/') 
    ? filePath 
    : `marketing-content/${filePath}`;
  
  if (!shouldTrackFile(relativePath)) {
    return;
  }
  
  const state = loadSyncState();
  const fullPath = path.join(process.cwd(), relativePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const sha = computeFileSha(content);
    const stats = fs.statSync(fullPath);
    
    state.files[relativePath] = {
      sha,
      lastModified: stats.mtimeMs,
      remoteSha: sha, // After pull, local = remote
    };
    
    saveSyncState(state);
  }
}

/**
 * Update a single file's sync state after committing to remote
 */
export function updateFileAfterCommit(filePath: string, commitSha: string): void {
  const relativePath = filePath.startsWith('marketing-content/') 
    ? filePath 
    : `marketing-content/${filePath}`;
  
  if (!shouldTrackFile(relativePath)) {
    return;
  }
  
  const state = loadSyncState();
  const fullPath = path.join(process.cwd(), relativePath);
  
  // Update last synced commit
  state.lastSyncedCommit = commitSha;
  state.lastSyncedAt = new Date().toISOString();
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const sha = computeFileSha(content);
    const stats = fs.statSync(fullPath);
    
    state.files[relativePath] = {
      sha,
      lastModified: stats.mtimeMs,
      remoteSha: sha, // After commit, local = remote
    };
  } else {
    // File was deleted
    delete state.files[relativePath];
  }
  
  saveSyncState(state);
}

/**
 * Discard local changes for a file by resetting its stored SHA to match current content
 * This marks the file as "synced" without actually reverting content
 */
export function discardLocalChanges(filePath: string): boolean {
  const relativePath = filePath.startsWith('marketing-content/') 
    ? filePath 
    : `marketing-content/${filePath}`;
  
  if (!shouldTrackFile(relativePath)) {
    return false;
  }
  
  const state = loadSyncState();
  const fullPath = path.join(process.cwd(), relativePath);
  
  if (!fs.existsSync(fullPath)) {
    // File doesn't exist, remove from state
    delete state.files[relativePath];
    saveSyncState(state);
    return true;
  }
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const sha = computeFileSha(content);
  const stats = fs.statSync(fullPath);
  
  // Reset both sha and remoteSha to current content
  state.files[relativePath] = {
    sha,
    lastModified: stats.mtimeMs,
    remoteSha: sha,
  };
  
  saveSyncState(state);
  return true;
}
