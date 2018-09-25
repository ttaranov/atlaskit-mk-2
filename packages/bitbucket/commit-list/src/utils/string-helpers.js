// @flow
export const defaultHashLength = 7;
export const getShortHash = (string: string, length?: number): string =>
  string.slice(0, length || defaultHashLength);
