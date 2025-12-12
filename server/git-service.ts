import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

interface GitStatus {
  hasChanges: boolean;
  files: {
    path: string;
    status: "modified" | "added" | "deleted" | "untracked";
  }[];
}

interface CommitResult {
  success: boolean;
  hash?: string;
  message?: string;
  error?: string;
}

const ALLOWED_PATHS = ["marketing-content/"];

class GitService {
  private workDir: string;
  private mutex: Promise<void> = Promise.resolve();

  constructor() {
    this.workDir = process.cwd();
  }

  private async runGit(...args: string[]): Promise<string> {
    try {
      const { stdout } = await execFileAsync("git", args, {
        cwd: this.workDir,
        maxBuffer: 10 * 1024 * 1024,
      });
      return stdout.trim();
    } catch (error: unknown) {
      const err = error as { stderr?: string; message?: string };
      throw new Error(err.stderr || err.message || "Git command failed");
    }
  }

  private isAllowedPath(filePath: string): boolean {
    const normalized = path.normalize(filePath);
    return ALLOWED_PATHS.some((allowed) => normalized.startsWith(allowed));
  }

  async getStatus(): Promise<GitStatus> {
    const output = await this.runGit("status", "--porcelain");

    if (!output) {
      return { hasChanges: false, files: [] };
    }

    const files = output
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const statusCode = line.substring(0, 2).trim();
        const filePath = line.substring(3);

        let status: "modified" | "added" | "deleted" | "untracked";
        switch (statusCode) {
          case "M":
          case "MM":
            status = "modified";
            break;
          case "A":
            status = "added";
            break;
          case "D":
            status = "deleted";
            break;
          case "??":
            status = "untracked";
            break;
          default:
            status = "modified";
        }

        return { path: filePath, status };
      })
      .filter((file) => this.isAllowedPath(file.path));

    return {
      hasChanges: files.length > 0,
      files,
    };
  }

  async commit(
    message: string,
    authorName?: string,
    authorEmail?: string
  ): Promise<CommitResult> {
    return new Promise((resolve) => {
      this.mutex = this.mutex.then(async () => {
        try {
          const status = await this.getStatus();

          if (!status.hasChanges) {
            resolve({
              success: false,
              error: "No changes to commit",
            });
            return;
          }

          for (const file of status.files) {
            if (file.status === "deleted") {
              await this.runGit("rm", file.path);
            } else {
              await this.runGit("add", file.path);
            }
          }

          const commitArgs = ["commit", "-m", message];

          if (authorName && authorEmail) {
            commitArgs.push("--author", `${authorName} <${authorEmail}>`);
          }

          const commitOutput = await this.runGit(...commitArgs);

          const hashMatch = commitOutput.match(/\[[\w-]+\s+([a-f0-9]+)\]/);
          const hash = hashMatch ? hashMatch[1] : undefined;

          resolve({
            success: true,
            hash,
            message,
          });
        } catch (error: unknown) {
          const err = error as Error;
          resolve({
            success: false,
            error: err.message || "Commit failed",
          });
        }
      });
    });
  }
}

export const gitService = new GitService();
