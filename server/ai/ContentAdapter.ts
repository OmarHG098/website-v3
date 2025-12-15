/**
 * Content Adapter - Orchestrates AI-powered content adaptation
 */

import * as yaml from "js-yaml";
import type { AdaptOptions, AdaptResult, FullContext } from "./types";
import { getContextManager, type ContextManager } from "./ContextManager";
import { getLLMService, type LLMService } from "./LLMService";
import { SYSTEM_PROMPT, buildAdaptationPrompt } from "./prompts";

// Singleton instance
let instance: ContentAdapter | null = null;

export class ContentAdapter {
  private contextManager: ContextManager;
  private llmService: LLMService;

  private constructor() {
    this.contextManager = getContextManager();
    this.llmService = getLLMService();
  }

  static getInstance(): ContentAdapter {
    if (!instance) {
      instance = new ContentAdapter();
    }
    return instance;
  }

  /**
   * Clean YAML output from LLM response
   * Removes markdown code blocks and extra whitespace
   */
  private cleanYamlOutput(content: string): string {
    let cleaned = content.trim();

    // Remove markdown code blocks
    if (cleaned.startsWith("```yaml")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }

    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }

    return cleaned.trim();
  }

  /**
   * Validate that the output is valid YAML
   */
  private validateYaml(content: string): { valid: boolean; parsed?: unknown; error?: string } {
    try {
      const parsed = yaml.load(content);
      if (typeof parsed !== "object" || parsed === null) {
        return { valid: false, error: "YAML must be an object" };
      }
      return { valid: true, parsed };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid YAML",
      };
    }
  }

  /**
   * Adapt content using AI
   */
  async adapt(options: AdaptOptions): Promise<AdaptResult> {
    const model = "gpt-4o";
    
    // Build full context
    const context = await this.contextManager.buildAdaptationContext(options);

    // Build the prompt
    const prompt = buildAdaptationPrompt(
      context,
      options.sourceYaml,
      options.targetStructure
    );

    // Call LLM
    const result = await this.llmService.adaptContent(SYSTEM_PROMPT, prompt);

    // Clean and validate output
    const cleanedYaml = this.cleanYamlOutput(result.content);
    const validation = this.validateYaml(cleanedYaml);

    if (!validation.valid) {
      // Try to fix by resending full context with error information
      console.warn("Invalid YAML output, attempting to fix:", validation.error);
      
      // Build a correction prompt that includes full context + the invalid output + error
      const fixPrompt = `${prompt}

---
CORRECTION REQUIRED:

Your previous response was:
\`\`\`
${result.content}
\`\`\`

This output is not valid YAML. Error: ${validation.error}

Please try again. Output ONLY valid YAML content that matches the ${options.targetComponent} component structure.
No explanations, no markdown code blocks, just the corrected YAML content:`;

      const retryResult = await this.llmService.adaptContent(SYSTEM_PROMPT, fixPrompt);
      const retryCleanedYaml = this.cleanYamlOutput(retryResult.content);
      const retryValidation = this.validateYaml(retryCleanedYaml);

      if (!retryValidation.valid) {
        throw new Error(`Failed to generate valid YAML: ${retryValidation.error}`);
      }

      return {
        adaptedYaml: retryCleanedYaml,
        context: this.buildContextSummary(context),
        model,
        tokens: result.usage
          ? {
              prompt: result.usage.prompt_tokens + (retryResult.usage?.prompt_tokens || 0),
              completion: result.usage.completion_tokens + (retryResult.usage?.completion_tokens || 0),
              total: result.usage.total_tokens + (retryResult.usage?.total_tokens || 0),
            }
          : undefined,
      };
    }

    return {
      adaptedYaml: cleanedYaml,
      context: this.buildContextSummary(context),
      model,
      tokens: result.usage
        ? {
            prompt: result.usage.prompt_tokens,
            completion: result.usage.completion_tokens,
            total: result.usage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Build a summary of the context used for the adaptation
   */
  private buildContextSummary(context: FullContext): AdaptResult["context"] {
    return {
      brand: `${context.brand.brand.name} - ${context.brand.voice.tone}`,
      content: `${context.content.type}/${context.content.slug}`,
      component: `${context.component.name} v${context.component.version}`,
    };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.contextManager.clearCache();
  }
}

// Export singleton getter
export function getContentAdapter(): ContentAdapter {
  return ContentAdapter.getInstance();
}
