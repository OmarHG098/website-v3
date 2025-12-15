/**
 * Deep merge utility for combining YAML content files.
 * Recursively merges objects, with source values overriding target values.
 * Arrays are replaced (not concatenated).
 */

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep merges two objects. Properties from source override target.
 * Nested objects are recursively merged.
 * Arrays and primitives from source replace those in target.
 * 
 * @param target - Base object (e.g., _common.yml data)
 * @param source - Override object (e.g., locale variant data)
 * @returns Merged object with source values taking precedence
 */
export function deepMerge<T extends PlainObject>(target: T, source: Partial<T>): T {
  const result: PlainObject = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }

  return result as T;
}
