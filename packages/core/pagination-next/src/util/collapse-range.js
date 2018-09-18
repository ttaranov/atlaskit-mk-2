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
const collapseRange = (
  visible: number,
  current: number,
  pageLinks: any,
): any => {
  if (visible < 7) {
    throw new Error('cannot create range with visible pages less than 7');
  }
  const total = pageLinks.length;
  // only need ellipsis if we have more pages than we can display
  const needEllipsis = total > visible;
  // show start ellipsis if the current page is further away than max - 3 from the first page
  const hasStartEllipsis = needEllipsis && visible - 3 < current;
  // show end ellipsis if the current page is further than total - max + 3 from the last page
  const hasEndEllipsis = needEllipsis && current < total - visible + 4;
  if (!needEllipsis) {
    return pageLinks;
  } else if (hasStartEllipsis && !hasEndEllipsis) {
    const pageCount = visible - 2;
    return [pageLinks[0], '...', ...pageLinks.slice(total - pageCount)];
  } else if (!hasStartEllipsis && hasEndEllipsis) {
    const pageCount = visible - 2;
    return [...pageLinks.slice(0, pageCount), '...', ...pageLinks.slice(-1)];
  }
  // we have both start and end ellipsis
  const pageCount = visible - 4;
  return [
    pageLinks[0],
    '...',
    ...pageLinks.slice(
      current - Math.floor(pageCount / 2),
      current + pageCount,
    ),
    '...',
    ...pageLinks.slice(-1),
  ];
};

export default collapseRange;
