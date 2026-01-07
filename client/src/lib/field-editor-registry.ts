/**
 * Field Editor Registry
 * 
 * Manual configuration for which YAML fields should use special editors.
 * No automatic detection - all field-to-editor mappings are explicit.
 */

export type EditorType = "icon-picker" | "color-picker" | "image-picker" | "link-picker";

/**
 * Global editors - apply to ALL components
 * Key is the field path (supports [] for array items)
 */
export const globalEditors: Record<string, EditorType> = {
  // Example: any field called "icon" at root level
  // "icon": "icon-picker",
};

/**
 * Component-specific editors
 * First level key is the component type (e.g., "pricing", "hero")
 * Second level key is the field path within that component
 * 
 * Path syntax:
 * - "fieldName" - direct field
 * - "parent.child" - nested field
 * - "items[].icon" - field inside array items
 */
export const componentEditors: Record<string, Record<string, EditorType>> = {
  pricing: {
    "features[].icon": "icon-picker",
  },
};

/**
 * Get the editor type for a specific field path in a component
 * Returns null if no special editor is configured
 */
export function getEditorType(
  componentType: string,
  fieldPath: string
): EditorType | null {
  // Check component-specific first
  const componentConfig = componentEditors[componentType];
  if (componentConfig && componentConfig[fieldPath]) {
    return componentConfig[fieldPath];
  }
  
  // Check global editors
  if (globalEditors[fieldPath]) {
    return globalEditors[fieldPath];
  }
  
  return null;
}

/**
 * Get all configured field paths for a component
 * Returns both global and component-specific editors
 */
export function getConfiguredFields(componentType: string): Record<string, EditorType> {
  const result: Record<string, EditorType> = { ...globalEditors };
  
  const componentConfig = componentEditors[componentType];
  if (componentConfig) {
    Object.assign(result, componentConfig);
  }
  
  return result;
}
