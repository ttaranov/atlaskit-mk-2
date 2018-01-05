// @flow
// eslint-disable-next-line import/prefer-default-export
import type { HeadType, RowType } from '../types';

export const getPageRows = (
  pageNumber?: number,
  allRows: Array<RowType>,
  rowsPerPage?: number,
): Array<RowType> => {
  if (!pageNumber || !rowsPerPage || !allRows.length) {
    return [];
  }
  return allRows.slice(
    (pageNumber - 1) * rowsPerPage,
    pageNumber * rowsPerPage,
  );
};

export const assertIsSortable = (head?: HeadType) => {
  if (!head || !head.cells) return null;

  head.cells.forEach(cell => {
    if (cell.isSortable && !cell.key) {
      try {
        throw Error(
          "isSortable can't be set to true, if the 'key' prop is missing.",
        );
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });
  return null;
};

export const validateSortKey = (
  sortKey?: string | null,
  head?: HeadType | null,
) => {
  if (!sortKey) return null;
  const headHasKey = head && head.cells.map(cell => cell.key).includes(sortKey);

  if (!headHasKey) {
    try {
      throw Error(`Cell with ${sortKey} key not found in head.`);
    } catch (e) {
      console.error(e);
    }
  }
  return null;
};
