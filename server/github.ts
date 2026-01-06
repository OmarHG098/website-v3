/**
 * GitHub API utility for committing content changes directly to the repository.
 * Used in production to sync content edits back to the main branch.
 */

interface GitHubCommitOptions {
  filePath: string;
  content: string;
  message: string;
}

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

interface GitHubFileResponse {
  sha?: string;
  content?: string;
}

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
  status: 'in-sync' | 'behind' | 'ahead' | 'diverged' | 'unknown' | 'not-configured';
  behindBy?: number;
  aheadBy?: number;
  repoUrl?: string;
  branch?: string;
}

/**
 * Get the sync status between local and remote GitHub repository
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
    // Get local HEAD commit using git
    const { execSync } = await import('child_process');
    let localCommit: string | null = null;
    
    try {
      localCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    } catch {
      // Not a git repo or git not available
      return {
        configured: true,
        syncEnabled,
        localCommit: null,
        remoteCommit: null,
        status: 'unknown',
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    }
    
    // Get remote branch ref from GitHub API
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/git/ref/heads/${config.branch}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    
    if (!response.ok) {
      console.error('GitHub API error getting branch ref:', response.status);
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
    
    const data: GitHubBranchRef = await response.json();
    const remoteCommit = data.object.sha;
    
    // Compare commits
    if (localCommit === remoteCommit) {
      return {
        configured: true,
        syncEnabled,
        localCommit,
        remoteCommit,
        status: 'in-sync',
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    }
    
    // Check if local is behind or ahead using git merge-base
    try {
      // Fetch to ensure we have remote refs
      execSync(`git fetch origin ${config.branch} --quiet 2>/dev/null || true`, { encoding: 'utf-8' });
      
      // Get merge base
      const mergeBase = execSync(`git merge-base HEAD origin/${config.branch} 2>/dev/null || echo ""`, { encoding: 'utf-8' }).trim();
      
      if (!mergeBase) {
        // Can't determine relationship
        return {
          configured: true,
          syncEnabled,
          localCommit,
          remoteCommit,
          status: 'unknown',
          repoUrl: process.env.GITHUB_REPO_URL,
          branch: config.branch,
        };
      }
      
      // Count commits ahead/behind
      const behindCount = execSync(`git rev-list --count HEAD..origin/${config.branch} 2>/dev/null || echo "0"`, { encoding: 'utf-8' }).trim();
      const aheadCount = execSync(`git rev-list --count origin/${config.branch}..HEAD 2>/dev/null || echo "0"`, { encoding: 'utf-8' }).trim();
      
      const behind = parseInt(behindCount) || 0;
      const ahead = parseInt(aheadCount) || 0;
      
      let status: GitHubSyncStatus['status'];
      if (behind > 0 && ahead > 0) {
        status = 'diverged';
      } else if (behind > 0) {
        status = 'behind';
      } else if (ahead > 0) {
        status = 'ahead';
      } else {
        status = 'in-sync';
      }
      
      return {
        configured: true,
        syncEnabled,
        localCommit,
        remoteCommit,
        status,
        behindBy: behind,
        aheadBy: ahead,
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    } catch {
      // Git comparison failed
      return {
        configured: true,
        syncEnabled,
        localCommit,
        remoteCommit,
        status: localCommit === remoteCommit ? 'in-sync' : 'unknown',
        repoUrl: process.env.GITHUB_REPO_URL,
        branch: config.branch,
      };
    }
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
