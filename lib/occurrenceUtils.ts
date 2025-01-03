// lib/occurrenceUtils.ts

export interface KeyValuePair {
  key: string;
  value: unknown;
}

export function isObjectWithKeys(item: unknown): item is Record<string, unknown> {
  return (
    item !== null &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    Object.keys(item).every((key) => typeof key === 'string')
  );
}

/** Helper to detect if something is a primitive (string/number/boolean/null/undefined). */
function isPrimitive(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/**
 * Recursively flattens an object (or nested arrays) into a list of KeyValuePairs.
 *
 * @param obj  The object or array to flatten
 * @param prefix  Key prefix (for recursion)
 */
export function flattenObject(obj: unknown, prefix = ''): KeyValuePair[] {
  if (obj == null) {
    // null or undefined => no pairs
    return [];
  }

  // If it's an array
  if (Array.isArray(obj)) {
    // Check if all items are primitive
    if (obj.every(isPrimitive)) {
      // Store the entire array as one value
      return [
        {
          key: prefix || '(root)', // If prefix is empty, label it something like (root)
          // Could store as JSON or a string
          value: obj, // We'll let the UI JSON.stringify it
        },
      ];
    } else {
      // The array has some objects or nested arrays
      // We'll flatten each item individually
      return obj.flatMap((item, index) => {
        const newKey = prefix ? `${prefix}[${index}]` : `[${index}]`;
        if (isObjectWithKeys(item) || Array.isArray(item)) {
          return flattenObject(item, newKey);
        } else {
          // It's a primitive in a mixed array
          return [{ key: newKey, value: item }];
        }
      });
    }
  }

  // If it's an object with keys
  if (isObjectWithKeys(obj)) {
    return Object.entries(obj).flatMap(([k, val]) => {
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (Array.isArray(val) || isObjectWithKeys(val)) {
        // Recurse
        return flattenObject(val, newKey);
      } else {
        // Single pair
        return { key: newKey, value: val };
      }
    });
  }

  // If it's a single primitive at the root
  return [{ key: prefix || '(root)', value: obj }];
}
