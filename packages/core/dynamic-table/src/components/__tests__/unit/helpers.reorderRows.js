// @flow

import { computeIndex, reorderRows } from '../../../internal/helpers';
import { rowsWithKeys } from './_data';
import { type RankEnd } from '../../../types';

const getKey = rowIndex => rowsWithKeys[rowIndex].key;

const rankEnd = (sourceIndex, afterIndex): RankEnd => {
  return {
    sourceIndex,
    sourceKey: getKey(sourceIndex),
    destination: {
      index: afterIndex,
    },
  };
};

const extractKeys = rows => rows.map(row => row.key);
const getKeys = (...params) => Array.from(params).map(getKey);

test('computeIndex - if rowsPerPage are not passed, index is on first page', () => {
  const index = 5;
  expect(computeIndex(index, 1)).toBe(index);
});

test('computeIndex - if rowsPerPage are infinite, index is on first page', () => {
  const index = 40;
  expect(computeIndex(index, 4, Infinity)).toBe(index);
});

test('computeIndex - if afterKey is not provided and rowsPerPage are finite, target index is created based on page', () => {
  const page = 5;
  const rowsPerPage = 30;
  const index = 10;
  const targetIndex = (page - 1) * rowsPerPage + index;

  expect(computeIndex(index, page, rowsPerPage)).toBe(targetIndex);
});

test('original rows table is not mutated', () => {
  const rows = Array.from(rowsWithKeys);
  const reordered = reorderRows(rankEnd(1, 2), rowsWithKeys, 1);

  expect(reordered).not.toEqual(rows);
});

const testReordering = (fromIndex, toIndex, expectedOrder) => {
  const reordered = reorderRows(rankEnd(fromIndex, toIndex), rowsWithKeys, 1);
  const expected = getKeys(...expectedOrder);

  expect(extractKeys(reordered)).toEqual(expected);
};
test('user can reorder rows - multiple cases', () => {
  testReordering(1, 2, [0, 2, 1, 3]);
  testReordering(2, 1, [0, 2, 1, 3]);
  testReordering(3, 1, [0, 3, 1, 2]);
  testReordering(3, 0, [3, 0, 1, 2]);
  testReordering(0, 3, [1, 2, 3, 0]);
  testReordering(0, 2, [1, 2, 0, 3]);
});
