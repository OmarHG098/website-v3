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
  
  // Validate config
  if (!config.token || !config.owner || !config.repo) {
    // In production, return an error if not configured
    if (process.env.NODE_ENV === "production") {
      return { 
        success: false, 
        error: "GitHub integration not configured (missing GITHUB_TOKEN or GITHUB_REPO_URL)" 
      };
    }
    // In development, silently skip
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
  return !!(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_REPO_OWNER &&
    process.env.GITHUB_REPO_NAME
  );
}
