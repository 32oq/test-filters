// Gets a value from an object using dot-notation path
// e.g. getNestedValue(employee, 'address.city') → 'San Francisco'
export function getNestedValue(obj: any, path: string): any {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}
