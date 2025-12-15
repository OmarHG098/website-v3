/**
 * Schema Converter - Transforms component registry YAML schemas to JSON Schema format
 * for use with OpenAI structured outputs
 */

import type { ComponentContext, PropDefinition } from "./types";

export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  items?: JSONSchema;
  enum?: string[];
  description?: string;
  default?: unknown;
  additionalProperties?: boolean;
}

/**
 * Convert a PropDefinition to JSON Schema format
 */
function propToJsonSchema(prop: PropDefinition): JSONSchema {
  const schema: JSONSchema = { type: "string" };

  switch (prop.type) {
    case "string":
      schema.type = "string";
      break;
    case "number":
      schema.type = "number";
      break;
    case "boolean":
      schema.type = "boolean";
      break;
    case "array":
      schema.type = "array";
      if (prop.items) {
        schema.items = {
          type: "object",
          properties: {},
          required: [],
        };
        for (const [itemKey, itemProp] of Object.entries(prop.items)) {
          const itemSchema = propToJsonSchema(itemProp as PropDefinition);
          schema.items.properties![itemKey] = itemSchema;
          if ((itemProp as PropDefinition).required) {
            schema.items.required!.push(itemKey);
          }
        }
        if (schema.items.required!.length === 0) {
          delete schema.items.required;
        }
      } else {
        schema.items = { type: "string" };
      }
      break;
    case "object":
      schema.type = "object";
      if (prop.properties) {
        schema.properties = {};
        schema.required = [];
        for (const [propKey, propValue] of Object.entries(prop.properties)) {
          schema.properties[propKey] = propToJsonSchema(propValue as PropDefinition);
          if ((propValue as PropDefinition).required) {
            schema.required.push(propKey);
          }
        }
        if (schema.required.length === 0) {
          delete schema.required;
        }
      }
      break;
    default:
      schema.type = "string";
  }

  if (prop.description) {
    schema.description = prop.description;
  }
  if (prop.default !== undefined) {
    schema.default = prop.default;
  }

  return schema;
}

/**
 * Convert a ComponentContext to JSON Schema format
 * Merges common props with variant-specific props
 */
export function componentToJsonSchema(
  component: ComponentContext,
  targetVariant?: string
): JSONSchema {
  const schema: JSONSchema = {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  };

  // Add type property (always required for sections)
  schema.properties!["type"] = {
    type: "string",
    description: "Section type identifier",
  };
  schema.required!.push("type");

  // Add common props
  for (const [propName, propDef] of Object.entries(component.props)) {
    schema.properties![propName] = propToJsonSchema(propDef);
    if (propDef.required) {
      schema.required!.push(propName);
    }
  }

  // Add variant-specific props
  if (targetVariant && component.variant_props?.[targetVariant]) {
    const variantProps = component.variant_props[targetVariant];
    for (const [propName, propDef] of Object.entries(variantProps)) {
      schema.properties![propName] = propToJsonSchema(propDef);
      if (propDef.required) {
        if (!schema.required!.includes(propName)) {
          schema.required!.push(propName);
        }
      }
    }
  }

  // Clean up empty required array
  if (schema.required!.length === 0) {
    delete schema.required;
  }

  return schema;
}

/**
 * Create a simplified JSON Schema that OpenAI's structured outputs can handle
 * OpenAI has restrictions on schema complexity
 */
export function createOpenAICompatibleSchema(
  component: ComponentContext,
  targetVariant?: string
): JSONSchema {
  const fullSchema = componentToJsonSchema(component, targetVariant);
  
  // OpenAI structured outputs work best with simpler schemas
  // We'll create a flattened version that captures the essential structure
  return {
    type: "object",
    properties: fullSchema.properties,
    required: fullSchema.required,
    additionalProperties: false,
  };
}

/**
 * Get the list of all required properties for a component/variant
 */
export function getRequiredProperties(
  component: ComponentContext,
  targetVariant?: string
): string[] {
  const required: string[] = [];

  // Add common required props
  for (const [propName, propDef] of Object.entries(component.props)) {
    if (propDef.required) {
      required.push(propName);
    }
  }

  // Add variant-specific required props
  if (targetVariant && component.variant_props?.[targetVariant]) {
    for (const [propName, propDef] of Object.entries(component.variant_props[targetVariant])) {
      if (propDef.required && !required.includes(propName)) {
        required.push(propName);
      }
    }
  }

  return required;
}

/**
 * Get all valid property names for a component/variant
 */
export function getValidProperties(
  component: ComponentContext,
  targetVariant?: string
): string[] {
  const validProps = new Set<string>(["type", "version"]);

  // Add common props
  for (const propName of Object.keys(component.props)) {
    validProps.add(propName);
  }

  // Add variant-specific props
  if (targetVariant && component.variant_props?.[targetVariant]) {
    for (const propName of Object.keys(component.variant_props[targetVariant])) {
      validProps.add(propName);
    }
  }

  return Array.from(validProps);
}
