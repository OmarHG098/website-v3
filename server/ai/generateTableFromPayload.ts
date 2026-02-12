import { getLLMService } from "./LLMService";

export interface TableColumnConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "image" | "link" | "boolean";
}

export interface TableConfig {
  columns: TableColumnConfig[];
  title?: string;
}

export interface GenerateTableInput {
  sampleData: Record<string, unknown>[];
  availableKeys: string[];
  userPrompt: string;
}

const SYSTEM_PROMPT = `You are a data table configuration assistant. Given a sample of data items and a user's description of what columns they want, produce a JSON configuration for a data table.

Rules:
- Only use keys that exist in the available keys list provided.
- Map the user's natural language descriptions to the correct data keys.
- Infer the best column type based on the sample values: "text" for strings, "number" for numeric values, "date" for date-like strings, "image" for URLs ending in image extensions, "link" for other URLs, "boolean" for true/false values.
- Use the user's desired labels for column headers. If the user doesn't specify labels, generate clean human-readable labels from the key names.
- Preserve the order the user specifies.
- If the user says something vague like "show all columns", include all available keys.
- Return ONLY valid JSON with this exact structure:
{
  "columns": [
    { "key": "field_name", "label": "Display Label", "type": "text|number|date|image|link|boolean" }
  ],
  "title": "Optional Table Title"
}
Do not include any text outside the JSON object.`;

export async function generateTableFromPayload(input: GenerateTableInput): Promise<TableConfig> {
  const llm = getLLMService();

  const samplePreview = JSON.stringify(input.sampleData.slice(0, 3), null, 2);

  const userPrompt = `Available data keys: ${JSON.stringify(input.availableKeys)}

Sample data (first 3 items):
${samplePreview}

User's request: "${input.userPrompt}"

Generate the table column configuration as JSON based on the user's request.`;

  const result = await llm.adaptContent(
    SYSTEM_PROMPT,
    userPrompt,
    {
      temperature: 0.3,
      maxTokens: 1000,
    }
  );

  let content = result.content.trim();
  const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    content = fenceMatch[1].trim();
  }

  const parsed = JSON.parse(content) as TableConfig;

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
