export interface KeyValuePair {
  key: string;
  value: any;
}

export function isObjectWithKeys(item: any): item is Record<string, any> {
  return (
    item &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    Object.keys(item).every((key) => typeof key === 'string')
  );
}

export function flattenObject(obj: Record<string, any> | null | undefined, prefix = ''): KeyValuePair[] {
  if (obj == null) {
    return [];
  }

  return Object.entries(obj).flatMap(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      return { key: newKey, value: value.join('') };
    } else if (Array.isArray(value)) {
      return value.flatMap((item, index) => flattenObject(item, `${newKey}[${index}]`));
    } else if (isObjectWithKeys(value)) {
      return flattenObject(value, newKey);
    } else {
      return { key: newKey, value };
    }
  });
}
