/**
 * Prompt templates for AI Content Adaptation
 */

import type { FullContext, ComponentContext } from "./types";

// System prompt establishing the AI's role and constraints
export const SYSTEM_PROMPT = `You are a content adaptation specialist for 4Geeks Academy, a coding bootcamp. Your role is to transform content from one format to another while maintaining brand voice and messaging guidelines.

CRITICAL RULES:
1. Output ONLY valid YAML - no markdown code blocks, no explanations
2. Preserve the semantic meaning while adapting to the target structure
3. Follow the brand voice: professional yet approachable, encouraging but not pushy
4. Never use forbidden phrases or make unrealistic promises
5. Add required disclaimers when mentioning job guarantees or salary claims
6. Keep content concise and action-oriented
7. Address the reader directly using "you" and "your"`;

/**
 * Build the context block that provides layered context to the LLM
 */
export function buildContextBlock(context: FullContext): string {
  const { brand, content, component, userOverrides } = context;
  
  let contextBlock = `## CONTEXT HIERARCHY (priority: brand > content > component)

### 1. BRAND CONTEXT (highest priority)
Brand: ${brand.brand.name}
Voice: ${brand.voice.tone}
Style: ${brand.voice.style}

Key Differentiators:
${brand.key_differentiators.map(d => `- ${d}`).join("\n")}

Messaging Priorities:
${brand.messaging_priorities.map(p => `- ${p.name} (priority ${p.weight}): ${p.examples[0]}`).join("\n")}

Forbidden Phrases: ${brand.forbidden_phrases.slice(0, 5).join(", ")}

### 2. CONTENT CONTEXT
Content Type: ${content.type}
Slug: ${content.slug}`;

  if (content.context?.when_to_use) {
    contextBlock += `\nPurpose: ${content.context.when_to_use}`;
  }
  if (content.context?.target_audience) {
    contextBlock += `\nTarget Audience: ${content.context.target_audience}`;
  }

  contextBlock += `

### 3. COMPONENT CONTEXT
Component: ${component.name} v${component.version}`;

  if (component.description) {
    contextBlock += `\nDescription: ${component.description}`;
  }
  if (component.when_to_use) {
    contextBlock += `\nWhen to Use: ${component.when_to_use}`;
  }

  if (userOverrides) {
    contextBlock += `

### 4. USER OVERRIDES (apply these modifications)`;
    if (userOverrides.tone) {
      contextBlock += `\nTone Override: ${userOverrides.tone}`;
    }
    if (userOverrides.targetAudience) {
      contextBlock += `\nTarget Audience Override: ${userOverrides.targetAudience}`;
    }
    if (userOverrides.additionalGuidelines?.length) {
      contextBlock += `\nAdditional Guidelines:\n${userOverrides.additionalGuidelines.map(g => `- ${g}`).join("\n")}`;
    }
  }

  return contextBlock;
}

/**
 * Build the target structure block describing the expected output format
 */
export function buildTargetStructureBlock(component: ComponentContext): string {
  const requiredProps = Object.entries(component.props)
    .filter(([_, prop]) => prop.required)
    .map(([name, prop]) => `  ${name}: # ${prop.type}${prop.description ? ` - ${prop.description}` : ""}`);

  const optionalProps = Object.entries(component.props)
    .filter(([_, prop]) => !prop.required)
    .map(([name, prop]) => `  ${name}: # ${prop.type} (optional)${prop.description ? ` - ${prop.description}` : ""}`);

  return `## TARGET STRUCTURE

The output must be valid YAML matching this structure:

Required properties:
${requiredProps.join("\n")}

Optional properties:
${optionalProps.join("\n")}`;
}

/**
 * Build the complete adaptation prompt
 */
export function buildAdaptationPrompt(
  context: FullContext,
  sourceYaml: string,
  targetStructure?: Record<string, unknown>
): string {
  const contextBlock = buildContextBlock(context);
  const structureBlock = buildTargetStructureBlock(context.component);

  let prompt = `${contextBlock}

${structureBlock}

## SOURCE CONTENT TO ADAPT

\`\`\`yaml
${sourceYaml}
\`\`\`

## INSTRUCTIONS

Transform the source content to match the target structure while:
1. Maintaining the core message and value proposition
2. Adapting language to match brand voice guidelines
3. Ensuring all required properties are filled
4. Using appropriate content from the source or generating contextually appropriate content
5. Following the component's when_to_use guidance`;

  if (targetStructure) {
    prompt += `

## ADDITIONAL TARGET STRUCTURE HINTS
\`\`\`json
${JSON.stringify(targetStructure, null, 2)}
\`\`\``;
  }

  prompt += `

## OUTPUT

Respond with ONLY the adapted YAML content. No explanations, no markdown code blocks, just valid YAML:`;

  return prompt;
}

/**
 * Build a validation prompt to check if output matches schema
 */
export function buildValidationPrompt(yamlContent: string, component: ComponentContext): string {
  return `Validate this YAML content against the ${component.name} component schema.

YAML to validate:
\`\`\`yaml
${yamlContent}
\`\`\`

Required properties: ${Object.entries(component.props)
    .filter(([_, prop]) => prop.required)
    .map(([name]) => name)
    .join(", ")}

Respond with ONLY "VALID" if the YAML is valid, or respond with a corrected version of the YAML if there are issues.`;
}
