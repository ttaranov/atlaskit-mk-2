// @flow

export const noop = () => {};

export const range = (n: number): Array<number> =>
  Array.from(new Array(n).keys());

export const oneOf = <T>(a: T, b: T): T => (typeof a !== 'undefined' ? a : b);
