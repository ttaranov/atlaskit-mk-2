// @flow

const range = (start, length) => [...Array(length)].map((_, i) => start + i);

/**
 * Returns an array that represents how the pagination should appear. This
 * array will contain page numbers and ellipsis. For example:
 *
 * pageRange(7, 5, 100) = [1, '...', 4, 5, 6, '...', 100]
 *
 * This method will throw an exception if visible is less than 7. With less
 * than 7 visible pages it can become impossible to navigate the range.
 */
const pageRange = (
  visible: number,
  current: number,
  total: number,
): Array<number | '...'> => {
  if (visible < 7) {
    throw new Error('cannot create range with visible pages less than 7');
  }
  // only need ellipsis if we have more pages than we can display
  const needEllipsis = total > visible;
  // show start ellipsis if the current page is further away than max - 3 from the first page
  const hasStartEllipsis = needEllipsis && visible - 3 < current;
  // show end ellipsis if the current page is further than total - max + 3 from the last page
  const hasEndEllipsis = needEllipsis && current < total - visible + 4;
  if (!needEllipsis) {
    return range(1, total);
  } else if (hasStartEllipsis && !hasEndEllipsis) {
    const pageCount = visible - 2;
    return [1, '...', ...range(total - pageCount + 1, pageCount)];
  } else if (!hasStartEllipsis && hasEndEllipsis) {
    const pageCount = visible - 2;
    return [...range(1, pageCount), '...', total];
  }
  // we have both start and end ellipsis
  const pageCount = visible - 4;
  return [
    1,
    '...',
    ...range(current - Math.floor(pageCount / 2), pageCount),
    '...',
    total,
  ];
};

export default pageRange;
