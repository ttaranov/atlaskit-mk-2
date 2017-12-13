export const isPixelUnit = (value: string): boolean =>
  value.substr(-2) === 'px' && !isNaN(+value.slice(0, -2));
