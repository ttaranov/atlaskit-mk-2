export type ElementDimension = 'height' | 'width';

export const getElementDimension = (
  element: Element,
  dimension: ElementDimension,
): number => {
  const { [dimension]: dimensionValue } = element.getBoundingClientRect();

  return Math.round(dimensionValue);
};
