// @flow
// eslint-disable-next-line import/prefer-default-export

import type { RowType } from '../types';

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
