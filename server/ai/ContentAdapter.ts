/**
 * Content Adapter - Orchestrates AI-powered content adaptation
 * Uses OpenAI structured outputs for schema-enforced responses
 */

import * as yaml from "js-yaml";
import type { AdaptOptions, AdaptResult, FullContext } from "./types";
import { getContextManager, type ContextManager } from "./ContextManager";
import { getLLMService, type LLMService } from "./LLMService";
import { SYSTEM_PROMPT, buildAdaptationPrompt, buildContextBlock, buildTargetStructureBlock } from "./prompts";
import { componentToJsonSchema, validateContentAgainstSchema } from "./SchemaConverter";

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
   * Adapt content using AI with structured output enforcement
   * Primary method - uses JSON schema to enforce valid output structure
   */
  async adaptStructured(options: AdaptOptions): Promise<AdaptResult> {
    const model = "gpt-4o";
    
    // Build full context
    const context = await this.contextManager.buildAdaptationContext(options);

    // Generate JSON schema for the component
    const jsonSchema = componentToJsonSchema(context.component, context.targetVariant);

    // Build the prompt (simpler since structure is enforced by schema)
    const contextBlock = buildContextBlock(context);
    const structureBlock = buildTargetStructureBlock(context.component, context.targetVariant);
    
    // Build target example section if provided
    const targetExampleSection = options.targetExampleYaml 
      ? `## TARGET VARIANT EXAMPLE

This is a fully-populated example of the target variant. Your output MUST include ALL properties shown in this example:

\`\`\`yaml
${options.targetExampleYaml}
\`\`\`

IMPORTANT: Populate EVERY property present in this example. Do not omit any fields - generate appropriate content for any property that exists in the example but not in the source.
`
      : '';

    const prompt = `${contextBlock}

${structureBlock}

${targetExampleSection}
## SOURCE CONTENT TO ADAPT

This is the original content. Preserve its core message and value proposition while restructuring it to match the target variant:

\`\`\`yaml
${options.sourceYaml}
\`\`\`

## INSTRUCTIONS

Transform the source content to match the target component structure while:
1. Maintaining the core message and value proposition from the source
2. Adapting language to match brand voice guidelines
3. POPULATING ALL PROPERTIES shown in the target variant example - do not leave any optional fields empty
4. For properties that exist in the target but not the source, generate contextually appropriate content that matches the brand voice
5. Following the component's when_to_use guidance
6. If the target has arrays (like badges, logos, CTAs), populate them with the same number of items as the example

Respond with a JSON object that matches the target component structure with ALL properties populated.`;

    try {
      // Try structured output first
      const result = await this.llmService.adaptContentStructured(
        SYSTEM_PROMPT,
        prompt,
        {
          jsonSchema: jsonSchema as unknown as Record<string, unknown>,
          schemaName: `${options.targetComponent}_${options.targetVariant || 'default'}`.replace(/[^a-zA-Z0-9_]/g, '_'),
        }
      );

      // Validate the structured output against our schema (recursive validation)
      const validation = validateContentAgainstSchema(result.content, context.component, context.targetVariant);
      
      // Build warnings list
      const warnings: string[] = [];
      if (validation.errors.length > 0) {
        warnings.push(...validation.errors);
      }
      if (validation.unknownProps && validation.unknownProps.length > 0) {
        for (const prop of validation.unknownProps) {
          warnings.push(`Unknown property not in schema: "${prop}"`);
        }
      }
      
      // Merge cleaned properties with unknown properties (preserve AI output)
      const mergedContent: Record<string, unknown> = { ...validation.cleaned };
      for (const prop of validation.unknownProps || []) {
        if (result.content[prop] !== undefined) {
          mergedContent[prop] = result.content[prop];
        }
      }

      // Add variant if applicable
      const contentWithVariant = context.targetVariant 
        ? { ...mergedContent, variant: context.targetVariant }
        : mergedContent;

      // Convert to YAML
      const adaptedYaml = yaml.dump(contentWithVariant, { 
        indent: 2, 
        lineWidth: 120,
        noRefs: true,
        sortKeys: false,
      });

      return {
        adaptedYaml,
        context: this.buildContextSummary(context),
        model,
        tokens: result.usage
          ? {
              prompt: result.usage.prompt_tokens,
              completion: result.usage.completion_tokens,
              total: result.usage.total_tokens,
            }
          : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      // If structured output fails (e.g., schema too complex), fall back to text-based approach
      console.warn("Structured output failed, falling back to text-based adaptation:", error);
      return this.adapt(options);
    }
  }

  /**
   * Adapt content using AI (legacy text-based approach)
   * Fallback method when structured outputs aren't available
   */
  async adapt(options: AdaptOptions): Promise<AdaptResult> {
    const model = "gpt-4o";
    
    // Build full context
    const context = await this.contextManager.buildAdaptationContext(options);

    // Build the prompt with target example for complete property population
    const prompt = buildAdaptationPrompt(
      context,
      options.sourceYaml,
      options.targetStructure,
      options.targetExampleYaml
    );

    // Call LLM
    const result = await this.llmService.adaptContent(SYSTEM_PROMPT, prompt);

    // Clean and validate output
    const cleanedYaml = this.cleanYamlOutput(result.content);
    const validation = this.validateYaml(cleanedYaml);

    if (!validation.valid) {
      // Try to fix by resending full context with error information
      console.warn("Invalid YAML output, attempting to fix:", validation.error);
      
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

      // Additional schema validation for the retry
      // Handle case where AI returns YAML as an array (like `- headline: ...`)
      let parsedRetry: Record<string, unknown>;
      if (Array.isArray(retryValidation.parsed) && retryValidation.parsed.length > 0) {
        parsedRetry = retryValidation.parsed[0] as Record<string, unknown>;
      } else {
        parsedRetry = retryValidation.parsed as Record<string, unknown>;
      }
      
      // Validate and get cleaned content + unknown properties
      const schemaValidation = validateContentAgainstSchema(parsedRetry, context.component, context.targetVariant);
      
      // Build warnings list
      const warnings: string[] = [];
      if (schemaValidation.errors.length > 0) {
        warnings.push(...schemaValidation.errors);
      }
      if (schemaValidation.unknownProps && schemaValidation.unknownProps.length > 0) {
        for (const prop of schemaValidation.unknownProps) {
          warnings.push(`Unknown property not in schema: "${prop}"`);
        }
      }
      
      // Merge cleaned properties with unknown properties (preserve AI output)
      const mergedContent: Record<string, unknown> = { ...schemaValidation.cleaned };
      for (const prop of schemaValidation.unknownProps || []) {
        if (parsedRetry[prop] !== undefined) {
          mergedContent[prop] = parsedRetry[prop];
        }
      }
      
      // Add variant if applicable
      const retryContentWithVariant = context.targetVariant
        ? { ...mergedContent, variant: context.targetVariant }
        : mergedContent;
      
      const finalYaml = yaml.dump(retryContentWithVariant, { 
        indent: 2, 
        lineWidth: 120,
        noRefs: true,
        sortKeys: false,
      });

      return {
        adaptedYaml: finalYaml,
        context: this.buildContextSummary(context),
        model,
        tokens: result.usage
          ? {
              prompt: result.usage.prompt_tokens + (retryResult.usage?.prompt_tokens || 0),
              completion: result.usage.completion_tokens + (retryResult.usage?.completion_tokens || 0),
              total: result.usage.total_tokens + (retryResult.usage?.total_tokens || 0),
            }
          : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    }

    // Validate parsed YAML against component schema
    // Handle case where AI returns YAML as an array (like `- headline: ...`)
    let parsedContent: Record<string, unknown>;
    if (Array.isArray(validation.parsed) && validation.parsed.length > 0) {
      parsedContent = validation.parsed[0] as Record<string, unknown>;
    } else {
      parsedContent = validation.parsed as Record<string, unknown>;
    }
    
    // Validate and get cleaned content + unknown properties
    const schemaValidation = validateContentAgainstSchema(parsedContent, context.component, context.targetVariant);
    
    // Build warnings list
    const warnings: string[] = [];
    if (schemaValidation.errors.length > 0) {
      warnings.push(...schemaValidation.errors);
    }
    if (schemaValidation.unknownProps && schemaValidation.unknownProps.length > 0) {
      for (const prop of schemaValidation.unknownProps) {
        warnings.push(`Unknown property not in schema: "${prop}"`);
      }
    }
    
    // Merge cleaned properties with unknown properties (preserve AI output)
    const mergedContent: Record<string, unknown> = { ...schemaValidation.cleaned };
    for (const prop of schemaValidation.unknownProps || []) {
      if (parsedContent[prop] !== undefined) {
        mergedContent[prop] = parsedContent[prop];
      }
    }
    
    // Add variant if applicable
    const contentWithVariant = context.targetVariant
      ? { ...mergedContent, variant: context.targetVariant }
      : mergedContent;
    
    const finalYaml = yaml.dump(contentWithVariant, { 
      indent: 2, 
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });

    return {
      adaptedYaml: finalYaml,
      context: this.buildContextSummary(context),
      model,
      tokens: result.usage
        ? {
            prompt: result.usage.prompt_tokens,
            completion: result.usage.completion_tokens,
            total: result.usage.total_tokens,
          }
        : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
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
