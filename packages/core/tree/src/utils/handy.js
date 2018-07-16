// @flow

export const noop = () => {};

export const range = (n: number): Array<number> =>
  Array.from({ length: n }, (v, i) => i);

export const oneOf = <T>(a: T, b: T): T => (typeof a !== 'undefined' ? a : b);
