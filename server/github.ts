/**
 * GitHub API utility for committing content changes directly to the repository.
 * Used in production to sync content edits back to the main branch.
 * 
 * IMPORTANT: This module does NOT use git CLI commands.
 * All operations use GitHub's REST API to work in production environments
 * where git CLI may not be available (e.g., Replit deployments).
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  detectPendingChanges,
  getLastSyncedCommit,
  updateSyncStateAfterCommit,
  markFileAsModified,
  loadSyncState,
  saveSyncState,
  computeFileSha,
  type PendingChange,
} from './sync-state';

interface GitHubCommitOptions {
  filePath: string;
  content: string;
  message: string;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

interface GitHubFileResponse {
  sha?: string;
  content?: string;
}

export { PendingChange, markFileAsModified };

/**
 * Get the current file's SHA (required for updates)
 */
async function getFileSha(config: GitHubConfig, filePath: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}?ref=${config.branch}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    if (response.status === 404) {
      return null; // File doesn't exist yet
    }
    
    if (!response.ok) {
      console.error('GitHub API error getting file SHA:', response.status, await response.text());
      return null;
    }
    
    const data: GitHubFileResponse = await response.json();
    return data.sha || null;
  } catch (error) {
    console.error('Error getting file SHA from GitHub:', error);
    return null;
  }
}

/**
 * Parse GitHub repo URL to extract owner and repo name
 * Supports formats like:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Remove .git suffix if present
    const cleanUrl = url.replace(/\.git$/, '');
    
    // Try to extract owner/repo from the URL
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Commit a file to the GitHub repository
 */
export async function commitToGitHub(options: GitHubCommitOptions): Promise<{ success: boolean; error?: string; commitUrl?: string }> {
  // Get config from environment variables
  const token = process.env.GITHUB_TOKEN || '';
  const repoUrl = process.env.GITHUB_REPO_URL || '';
  const branch = process.env.GITHUB_BRANCH || 'main';
  
  // Parse owner/repo from URL
  const parsed = parseGitHubUrl(repoUrl);
  
  const config: GitHubConfig = {
    token,
    owner: parsed?.owner || '',
    repo: parsed?.repo || '',
    branch,
  };
  
  // Check if GitHub sync is enabled (defaults to false)
  const syncEnabled = process.env.GITHUB_SYNC_ENABLED === "true";
  
  // Validate config
  if (!config.token || !config.owner || !config.repo) {
    // If sync is enabled but not configured, return an error
    if (syncEnabled) {
      return { 
        success: false, 
        error: "GitHub integration not configured (missing GITHUB_TOKEN or GITHUB_REPO_URL)" 
      };
    }
    // If sync is disabled, silently skip
    return { success: true };
  }
  
  // If sync is disabled, skip even if configured
  if (!syncEnabled) {
    return { success: true };
  }
  
  try {
    // Get current file SHA (required for updating existing files)
    const sha = await getFileSha(config, options.filePath);
    
    // Prepare the request body
    const body: Record<string, string> = {
      message: options.message,
      content: Buffer.from(options.content).toString('base64'),
      branch: config.branch,
    };
    
    // Include SHA if file exists (for update)
    if (sha) {
      body.sha = sha;
    }
    
    // Make the commit via GitHub Contents API
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${options.filePath}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', response.status, errorText);
      return { 
        success: false, 
        error: `GitHub API error: ${response.status}` 
      };
    }
    
    const data = await response.json();
    const commitUrl = data.commit?.html_url;
    
    console.log(`Content committed to GitHub: ${options.filePath}`);
    if (commitUrl) {
      console.log(`Commit URL: ${commitUrl}`);
    }
    
    return { success: true, commitUrl };
  } catch (error) {
    console.error('Error committing to GitHub:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Check if GitHub integration is configured
 */
export function isGitHubConfigured(): boolean {
  const repoUrl = process.env.GITHUB_REPO_URL || '';
  const parsed = parseGitHubUrl(repoUrl);
  return !!(process.env.GITHUB_TOKEN && parsed?.owner && parsed?.repo);
}

/**
 * Get GitHub config from environment variables
 */
export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN || '';
  const repoUrl = process.env.GITHUB_REPO_URL || '';
  const branch = process.env.GITHUB_BRANCH || 'main';
  
  const parsed = parseGitHubUrl(repoUrl);
  if (!token || !parsed) return null;
  
  return {
    token,
    owner: parsed.owner,
    repo: parsed.repo,
    branch,
  };
}

interface GitHubBranchRef {
  ref: string;
  object: {
    sha: string;
    type: string;
  };
}

export interface GitHubSyncStatus {
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

/**
 * Get list of pending changes in marketing-content directory
 * Uses file hash comparison instead of git status
 */
export async function getPendingChanges(): Promise<PendingChange[]> {
  return detectPendingChanges();
}

/**
 * Create a blob in the GitHub repository
 */
async function createBlob(config: GitHubConfig, content: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/blobs`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64',
      }),
    });
    
    if (!response.ok) {
      console.error('GitHub API error creating blob:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error creating blob:', error);
    return null;
  }
}

/**
 * Get the current tree SHA for a commit
 */
async function getTreeSha(config: GitHubConfig, commitSha: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/commits/${commitSha}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    if (!response.ok) {
      console.error('GitHub API error getting commit:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.tree?.sha || null;
  } catch (error) {
    console.error('Error getting tree SHA:', error);
    return null;
  }
}

/**
 * Create a new tree with updated files
 */
async function createTree(
  config: GitHubConfig,
  baseTreeSha: string,
  files: Array<{ path: string; blobSha: string | null; mode?: string }>
): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees`;
  
  const tree = files.map(file => ({
    path: file.path,
    mode: file.mode || '100644',
    type: 'blob' as const,
    sha: file.blobSha,
  }));
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree,
      }),
    });
    
    if (!response.ok) {
      console.error('GitHub API error creating tree:', response.status, await response.text());
      return null;
    }
    
    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error creating tree:', error);
    return null;
  }
}

/**
 * Create a new commit
 */
async function createCommitObject(
  config: GitHubConfig,
  message: string,
  treeSha: string,
  parentSha: string
): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/commits`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
      }),
    });
    
    if (!response.ok) {
      console.error('GitHub API error creating commit:', response.status, await response.text());
      return null;
    }
    
    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error creating commit:', error);
    return null;
  }
}

/**
 * Update branch ref to point to new commit
 */
async function updateBranchRef(
  config: GitHubConfig,
  commitSha: string,
  force: boolean = false
): Promise<boolean> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        sha: commitSha,
        force,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error updating ref:', response.status, errorText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating branch ref:', error);
    return false;
  }
}

/**
 * Get the current branch HEAD SHA
 */
async function getBranchHeadSha(config: GitHubConfig): Promise<string | null> {
  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/ref/heads/${config.branch}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    if (!response.ok) {
      console.error('GitHub API error getting branch head:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data.object?.sha || null;
  } catch (error) {
    console.error('Error getting branch head:', error);
    return null;
  }
}

/**
 * Commit all pending changes with a custom message using GitHub API
 * This method uses the Git Data API: create blobs → create tree → create commit → update ref
 */
export async function commitAndPush(
  message: string,
  options?: { force?: boolean }
): Promise<{ success: boolean; error?: string; commitHash?: string }> {
  const syncEnabled = process.env.GITHUB_SYNC_ENABLED === "true";
  
  if (!syncEnabled) {
    return { success: false, error: "GitHub sync is not enabled" };
  }
  
  const config = getGitHubConfig();
  if (!config) {
    return { success: false, error: "GitHub not configured (missing GITHUB_TOKEN or GITHUB_REPO_URL)" };
  }
  
  try {
    const pendingChanges = await getPendingChanges();
    if (pendingChanges.length === 0) {
      return { success: false, error: "No pending changes to commit" };
    }
    
    const currentHeadSha = await getBranchHeadSha(config);
    if (!currentHeadSha) {
      return { success: false, error: "Could not get current branch HEAD" };
    }
    
    const lastSyncedCommit = getLastSyncedCommit();
    if (lastSyncedCommit && lastSyncedCommit !== currentHeadSha && !options?.force) {
      return { 
        success: false, 
        error: "Remote has new commits. Please sync before committing, or use force commit." 
      };
    }
    
    const baseTreeSha = await getTreeSha(config, currentHeadSha);
    if (!baseTreeSha) {
      return { success: false, error: "Could not get base tree" };
    }
    
    const treeEntries: Array<{ path: string; blobSha: string | null }> = [];
    const committedFiles: string[] = [];
    
    for (const change of pendingChanges) {
      if (change.status === 'deleted') {
        treeEntries.push({ path: change.file, blobSha: null });
        committedFiles.push(change.file);
      } else {
        const fullPath = path.join(process.cwd(), change.file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const blobSha = await createBlob(config, content);
          if (!blobSha) {
            return { success: false, error: `Failed to create blob for ${change.file}` };
          }
          treeEntries.push({ path: change.file, blobSha });
          committedFiles.push(change.file);
        }
      }
    }
    
    const newTreeSha = await createTree(config, baseTreeSha, treeEntries);
    if (!newTreeSha) {
      return { success: false, error: "Failed to create tree" };
    }
    
    const newCommitSha = await createCommitObject(config, message, newTreeSha, currentHeadSha);
    if (!newCommitSha) {
      return { success: false, error: "Failed to create commit" };
    }
    
    const updated = await updateBranchRef(config, newCommitSha, options?.force);
    if (!updated) {
      return { success: false, error: "Failed to update branch ref" };
    }
    
    updateSyncStateAfterCommit(newCommitSha, committedFiles);
    
    console.log(`Committed and pushed to GitHub via API: ${newCommitSha}`);
    return { success: true, commitHash: newCommitSha };
  } catch (error) {
    console.error('Error committing and pushing:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Get the sync status between local and remote GitHub repository
 * Uses stored lastSyncedCommit from sync-state instead of git CLI
 */
export async function getGitHubSyncStatus(): Promise<GitHubSyncStatus> {
  const syncEnabled = process.env.GITHUB_SYNC_ENABLED === "true";
  const config = getGitHubConfig();
  
  if (!config) {
    return {
      configured: false,
      syncEnabled,
      localCommit: null,
      remoteCommit: null,
      status: 'not-configured',
    };
  }
  
  try {
    const localCommit = getLastSyncedCommit();
    
    const remoteCommit = await getBranchHeadSha(config);
    
    if (!remoteCommit) {
      return {
        configured: true,
        syncEnabled,
        localCommit,
        remoteCommit: null,
        status: 'unknown',
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    }
    
    if (!localCommit) {
      return {
        configured: true,
        syncEnabled,
        localCommit: null,
        remoteCommit,
        status: 'behind',
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    }
    
    if (localCommit === remoteCommit) {
      const pendingChanges = detectPendingChanges();
      const hasPendingChanges = pendingChanges.length > 0;
      
      return {
        configured: true,
        syncEnabled,
        localCommit,
        remoteCommit,
        status: hasPendingChanges ? 'ahead' : 'in-sync',
        aheadBy: hasPendingChanges ? pendingChanges.length : 0,
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    }
    
    return {
      configured: true,
      syncEnabled,
      localCommit,
      remoteCommit,
      status: 'behind',
      repoUrl: process.env.GITHUB_REPO_URL,
      branch: config.branch,
    };
  } catch (error) {
    console.error('Error checking GitHub sync status:', error);
    return {
      configured: true,
      syncEnabled,
      localCommit: null,
      remoteCommit: null,
      status: 'unknown',
      repoUrl: process.env.GITHUB_REPO_URL,
      branch: config?.branch,
    };
  }
}

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

/**
 * Get detailed conflict information including missed commits and changed files
 * Uses GitHub Compare API to fetch commits between lastSyncedCommit and current HEAD
 */
export async function getConflictInfo(): Promise<ConflictInfo> {
  const config = getGitHubConfig();
  
  if (!config) {
    return {
      hasConflict: false,
      behindBy: 0,
      commits: [],
      lastSyncedCommit: null,
      remoteCommit: null,
    };
  }
  
  const lastSyncedCommit = getLastSyncedCommit();
  const remoteCommit = await getBranchHeadSha(config);
  
  if (!remoteCommit) {
    return {
      hasConflict: false,
      behindBy: 0,
      commits: [],
      lastSyncedCommit,
      remoteCommit: null,
    };
  }
  
  if (!lastSyncedCommit || lastSyncedCommit === remoteCommit) {
    return {
      hasConflict: !lastSyncedCommit && !!remoteCommit,
      behindBy: !lastSyncedCommit ? 1 : 0,
      commits: [],
      lastSyncedCommit,
      remoteCommit,
    };
  }
  
  try {
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/compare/${lastSyncedCommit}...${remoteCommit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    if (!response.ok) {
      console.error('GitHub API error comparing commits:', response.status);
      return {
        hasConflict: true,
        behindBy: 1,
        commits: [],
        lastSyncedCommit,
        remoteCommit,
      };
    }
    
    const data = await response.json();
    
    const commits: RemoteCommit[] = (data.commits || []).map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit?.message || '',
      author: commit.commit?.author?.name || commit.author?.login || 'Unknown',
      date: commit.commit?.author?.date || '',
      files: [],
    }));
    
    const changedFiles = (data.files || []).map((f: any) => f.filename);
    if (commits.length > 0 && changedFiles.length > 0) {
      commits[commits.length - 1].files = changedFiles;
    }
    
    return {
      hasConflict: commits.length > 0,
      behindBy: data.behind_by || commits.length,
      commits,
      lastSyncedCommit,
      remoteCommit,
    };
  } catch (error) {
    console.error('Error getting conflict info:', error);
    return {
      hasConflict: true,
      behindBy: 1,
      commits: [],
      lastSyncedCommit,
      remoteCommit,
    };
  }
}

/**
 * Sync local state with remote by updating lastSyncedCommit
 * Call this after user chooses to "refresh" and accept remote changes
 */
export async function syncWithRemote(): Promise<{ success: boolean; error?: string }> {
  const config = getGitHubConfig();
  
  if (!config) {
    return { success: false, error: "GitHub not configured" };
  }
  
  try {
    const remoteCommit = await getBranchHeadSha(config);
    if (!remoteCommit) {
      return { success: false, error: "Could not get remote HEAD" };
    }
    
    const state = loadSyncState();
    state.lastSyncedCommit = remoteCommit;
    state.lastSyncedAt = new Date().toISOString();
    state.files = {};
    saveSyncState(state);
    
    return { success: true };
  } catch (error) {
    console.error('Error syncing with remote:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
