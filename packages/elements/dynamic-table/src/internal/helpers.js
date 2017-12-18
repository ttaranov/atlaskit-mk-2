// eslint-disable-next-line import/prefer-default-export
export const getPageRows = (pageNumber, allRows, rowsPerPage) =>
  allRows.slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage);
