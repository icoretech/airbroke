export interface KeyValuePair {
  key: string;
  value: unknown;
}

export function isObjectWithKeys(
  item: unknown,
): item is Record<string, unknown> {
  return (
    item !== null &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    Object.keys(item).every((key) => typeof key === "string")
  );
}

function isPrimitive(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function flattenObject(obj: unknown, prefix = ""): KeyValuePair[] {
  if (obj == null) {
    return [];
  }

  if (Array.isArray(obj)) {
    if (obj.every(isPrimitive)) {
      return [
        {
          key: prefix || "(root)",
          value: obj,
        },
      ];
    } else {
      return obj.flatMap((item, index) => {
        const newKey = prefix ? `${prefix}[${index}]` : `[${index}]`;
        if (isObjectWithKeys(item) || Array.isArray(item)) {
          return flattenObject(item, newKey);
        } else {
          return [{ key: newKey, value: item }];
        }
      });
    }
  }

  if (isObjectWithKeys(obj)) {
    return Object.entries(obj).flatMap(([k, val]) => {
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (Array.isArray(val) || isObjectWithKeys(val)) {
        return flattenObject(val, newKey);
      } else {
        return { key: newKey, value: val };
      }
    });
  }

  return [{ key: prefix || "(root)", value: obj }];
}
