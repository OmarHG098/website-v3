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
  contentType: string;
  slug: string;
  localSha: string;
  remoteSha?: string;
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
 */
export function loadSyncState(): SyncState {
  try {
    if (fs.existsSync(SYNC_STATE_PATH)) {
      const content = fs.readFileSync(SYNC_STATE_PATH, 'utf-8');
      return JSON.parse(content) as SyncState;
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
 */
export function markFileAsModified(filePath: string): void {
  const state = loadSyncState();
  const relativePath = filePath.startsWith('marketing-content/') 
    ? filePath 
    : `marketing-content/${filePath}`;
  
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
 */
export function detectPendingChanges(): PendingChange[] {
  const state = loadSyncState();
  const changes: PendingChange[] = [];
  const currentFiles = getAllContentFiles();
  const processedFiles = new Set<string>();
  
  for (const filePath of currentFiles) {
    processedFiles.add(filePath);
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const currentSha = computeFileSha(content);
      const storedInfo = state.files[filePath];
      
      const { contentType, slug } = parseContentPath(filePath);
      
      if (!storedInfo) {
        changes.push({
          file: filePath,
          status: 'added',
          contentType,
          slug,
          localSha: currentSha,
        });
      } else if (storedInfo.remoteSha && storedInfo.remoteSha !== currentSha) {
        changes.push({
          file: filePath,
          status: 'modified',
          contentType,
          slug,
          localSha: currentSha,
          remoteSha: storedInfo.remoteSha,
        });
      } else if (storedInfo.sha !== currentSha) {
        changes.push({
          file: filePath,
          status: 'modified',
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
  
  for (const [filePath, info] of Object.entries(state.files)) {
    if (!processedFiles.has(filePath) && info.remoteSha) {
      const { contentType, slug } = parseContentPath(filePath);
      changes.push({
        file: filePath,
        status: 'deleted',
        contentType,
        slug,
        localSha: '',
        remoteSha: info.remoteSha,
      });
    }
  }
  
  return changes;
}

/**
 * Update sync state after a successful commit
 */
export function updateSyncStateAfterCommit(
  commitSha: string,
  committedFiles: string[]
): void {
  const state = loadSyncState();
  
  state.lastSyncedCommit = commitSha;
  state.lastSyncedAt = new Date().toISOString();
  
  for (const filePath of committedFiles) {
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
 * Get the last synced commit SHA
 */
export function getLastSyncedCommit(): string | null {
  const state = loadSyncState();
  return state.lastSyncedCommit;
}
