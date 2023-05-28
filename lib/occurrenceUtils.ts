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
    if (Array.isArray(value)) {
      // If the array has only one value and it's a string, return it as is
      if (value.length === 1 && typeof value[0] === 'string') {
        return { key: newKey, value: value[0] };
      } else {
        return value.flatMap((item, index) => flattenObject(item, `${newKey}[${index}]`));
      }
    } else if (isObjectWithKeys(value)) {
      return flattenObject(value, newKey);
    } else {
      return { key: newKey, value };
    }
  });
}
