import { getLLMService } from "./LLMService";

export interface TableColumnConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "image" | "link" | "boolean";
  template?: string;
}

export interface TableConfig {
  columns: TableColumnConfig[];
  title?: string;
}

export interface GenerateTableInput {
  sampleData: Record<string, unknown>[];
  availableKeys: string[];
  userPrompt: string;
  locale?: string;
}

export interface RefineTableInput {
  currentConfig: TableConfig;
  sampleData: Record<string, unknown>[];
  availableKeys: string[];
  userFeedback: string;
  locale?: string;
}

const SYSTEM_PROMPT = `You are a data table configuration assistant. Given a sample of data items and a user's description of what columns they want, produce a JSON configuration for a data table.

Rules:
- Available keys use dot notation for nested fields (e.g. "academy.name", "syllabus_version.duration_in_days"). Use these exact paths as the "key" value.
- Only use keys that exist in the available keys list provided.
- Map the user's natural language descriptions to the correct data keys by examining the sample data values.
- Infer the best column type based on the sample values: "text" for strings, "number" for numeric values, "date" for ISO date strings, "image" for URLs ending in image extensions, "link" for other URLs, "boolean" for true/false values.
- Use the user's desired labels for column headers. If the user doesn't specify labels, generate clean human-readable labels from the key names.
- Preserve the order the user specifies.
- If the user says something vague like "show all columns", include the most meaningful top-level and nested keys (skip internal IDs, slugs, and redundant fields).
- TEMPLATE SUPPORT: When a column should combine multiple fields or add formatting, use the "template" property with {dotted.path} placeholders. Examples:
  - Combining date range: { "key": "kickoff_date", "template": "{kickoff_date} - {ending_date}", "label": "Date", "type": "text" }
  - Combining location: { "key": "academy.name", "template": "{academy.name} ({academy.city.name})", "label": "Location", "type": "text" }
  - Adding units: { "key": "syllabus_version.duration_in_days", "template": "{syllabus_version.duration_in_days} days ({syllabus_version.duration_in_hours}h)", "label": "Duration", "type": "text" }
  When using a template, set the type to "text" since the result is a formatted string.
  Only use template when combining multiple fields or adding formatting. For simple single-field columns, omit template.
- When a date column uses a template (combining start + end dates), set type to "text" not "date", because the template produces a formatted string.
- Return ONLY valid JSON with this exact structure:
{
  "columns": [
    { "key": "field.path", "label": "Display Label", "type": "text|number|date|image|link|boolean", "template": "optional {field.path} template" }
  ],
  "title": "Optional Table Title"
}
Do not include any text outside the JSON object.`;

function parseTableConfigResponse(content: string): TableConfig {
  let cleaned = content.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  const parsed = JSON.parse(cleaned) as TableConfig;

  if (!parsed.columns || !Array.isArray(parsed.columns) || parsed.columns.length === 0) {
    throw new Error("AI returned invalid table config: missing columns array");
  }

  for (const col of parsed.columns) {
    if (!col.key || !col.label || !col.type) {
      throw new Error(`Invalid column config: ${JSON.stringify(col)}`);
    }
  }

  return parsed;
}

export async function generateTableFromPayload(input: GenerateTableInput): Promise<TableConfig> {
  const llm = getLLMService();

  const samplePreview = JSON.stringify(input.sampleData.slice(0, 3), null, 2);
  const langNote = input.locale === "es"
    ? "\nIMPORTANT: The page is in Spanish. Use Spanish for all column labels and the title."
    : "\nIMPORTANT: The page is in English. Use English for all column labels and the title.";

  const userPrompt = `Available data keys: ${JSON.stringify(input.availableKeys)}

Sample data (first 3 items):
${samplePreview}

User's request: "${input.userPrompt}"
${langNote}

Generate the table column configuration as JSON based on the user's request. Pay close attention to any formatting instructions the user provides (date formats, combinations, etc).`;

  const result = await llm.adaptContent(
    SYSTEM_PROMPT,
    userPrompt,
    {
      temperature: 0.3,
      maxTokens: 1000,
    }
  );

  return parseTableConfigResponse(result.content);
}

const REFINE_SYSTEM_PROMPT = `You are a data table configuration assistant. The user has an existing table configuration and wants to make changes to it. Apply their requested changes and return the updated configuration.

Rules:
- Start from the current configuration provided and modify it according to the user's feedback.
- Available keys use dot notation for nested fields (e.g. "academy.name", "syllabus_version.duration_in_days").
- Only use keys that exist in the available keys list provided.
- Columns can have an optional "template" property with {dotted.path} placeholders to combine fields or add formatting.
- When using a template, set the type to "text" since the result is a formatted string.
- Return ONLY valid JSON with this exact structure:
{
  "columns": [
    { "key": "field.path", "label": "Display Label", "type": "text|number|date|image|link|boolean", "template": "optional {field.path} template" }
  ],
  "title": "Optional Table Title"
}
Do not include any text outside the JSON object.`;

export async function refineTableConfig(input: RefineTableInput): Promise<TableConfig> {
  const llm = getLLMService();

  const samplePreview = JSON.stringify(input.sampleData.slice(0, 3), null, 2);
  const langNote = input.locale === "es"
    ? "\nIMPORTANT: The page is in Spanish. Use Spanish for all column labels and the title."
    : "\nIMPORTANT: The page is in English. Use English for all column labels and the title.";

  const userPrompt = `Current table configuration:
${JSON.stringify(input.currentConfig, null, 2)}

Available data keys: ${JSON.stringify(input.availableKeys)}

Sample data (first 3 items):
${samplePreview}

User's requested changes: "${input.userFeedback}"
${langNote}

Apply the user's requested changes to the current configuration and return the updated JSON.`;

  const result = await llm.adaptContent(
    REFINE_SYSTEM_PROMPT,
    userPrompt,
    {
      temperature: 0.3,
      maxTokens: 1000,
    }
  );

  return parseTableConfigResponse(result.content);
}
