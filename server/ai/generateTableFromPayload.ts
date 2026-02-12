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
- Return ONLY valid JSON matching the schema.`;

const TABLE_CONFIG_SCHEMA = {
  type: "object" as const,
  properties: {
    columns: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          key: { type: "string" as const, description: "The property key from the data" },
          label: { type: "string" as const, description: "The display label for the column header" },
          type: { type: "string" as const, enum: ["text", "number", "date", "image", "link", "boolean"] },
        },
        required: ["key", "label", "type"] as const,
        additionalProperties: false,
      },
    },
    title: { type: "string" as const, description: "Optional table title suggested by context" },
  },
  required: ["columns"] as const,
  additionalProperties: false,
};

export async function generateTableFromPayload(input: GenerateTableInput): Promise<TableConfig> {
  const llm = getLLMService();

  const samplePreview = JSON.stringify(input.sampleData.slice(0, 3), null, 2);

  const userPrompt = `Available data keys: ${JSON.stringify(input.availableKeys)}

Sample data (first 3 items):
${samplePreview}

User's request: "${input.userPrompt}"

Generate the table column configuration based on the user's request.`;

  const result = await llm.adaptContentStructured(
    SYSTEM_PROMPT,
    userPrompt,
    {
      jsonSchema: TABLE_CONFIG_SCHEMA,
      schemaName: "table_config",
      temperature: 0.3,
      maxTokens: 1000,
    }
  );

  return result.content as unknown as TableConfig;
}
