/**
 * Compares if the properties of the first object are equal to the second object
 *  - Only work for simple types
 *  - Doesn't perform deep comparison
 */
export const isObjectEqual = (a: Object = {}, b: Object = {}): boolean => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return true;

  return aKeys.reduce((hasChanged, key) => {
    if (hasChanged) return hasChanged;

    return a[key] !== b[key];
  }, false);
};
