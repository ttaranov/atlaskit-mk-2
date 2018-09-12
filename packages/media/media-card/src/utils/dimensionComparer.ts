import { isValidPercentageUnit } from './isValidPercentageUnit';
import { containsPixelUnit } from './containsPixelUnit';
import { CardDimensionValue } from '../';

export const canCompareDimension = (
  current?: CardDimensionValue,
  next?: CardDimensionValue,
) => {
  if (!current || !next) {
    return false;
  }
  if (isValidPercentageUnit(current) && isValidPercentageUnit(next)) {
    return true;
  }
  if (containsPixelUnit(`${current}`) && containsPixelUnit(`${next}`)) {
    return true;
  }
  if (typeof current === 'number' && typeof next === 'number') {
    return true;
  }
  return false;
};
