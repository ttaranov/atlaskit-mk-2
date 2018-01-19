// @flow

import { inlineStylesIfRanking, computeIndex, reorderRows } from '../src/internal/helpers';
import { rowsWithKeys } from './_data';

describe('helpers/', () => {
  describe('inlineStylesIfRanking', () => {
    const width = 100;
    const height = 200;
  
    it('should return empty object if not in ranking state', () => {
      expect(inlineStylesIfRanking(false, width, height)).toEqual({});
    });
  
    it('should not add height prop if not passed', () => {
      expect(inlineStylesIfRanking(true, width)).toEqual({ width });
    });
  
    it('should add height if passed', () => {
      expect(inlineStylesIfRanking(true, width, height)).toEqual({ width, height });
    });
  });

  const getKey = (rowIndex) => rowsWithKeys[rowIndex].key;

  describe('computeIndex', () => {
    it('if rowsPerPage are not passed, index is on first page', () => {
      const index = 5;
      expect(computeIndex(index, 1, null)).toBe(index);
    });

    it('if rowsPerPage are inifnite, index is on first page', () => {
      const index = 40;
      expect(computeIndex(index, 4, Infinity)).toBe(index);
    });

    it('if afterKey is not provided and rowsPerPage are finite, target index is created based on page', () => {
      const page = 5;
      const rowsPerPage = 30;
      const index = 10;
      const targetIndex = (page - 1) * rowsPerPage + index;

      expect(computeIndex(index, page, rowsPerPage)).toBe(targetIndex);
    });
  });

  describe('reorderRows', () => {
    const rankEnd = (sourceIndex, afterIndex) => {
      return {
        sourceIndex,
        sourceKey: getKey(sourceIndex),
        destination: {
          index: afterIndex,
          beforeKey: undefined,
          afterKey: undefined,
        }
      }
    }

    const extractKeys = (rows) => rows.map(row => row.key); 
    const getKeys = (...params) => Array.from(params).map(getKey);

    it('original rows table is not mutated', () => {
      const rows = Array.from(rowsWithKeys);
      const reordered = reorderRows(rankEnd(1, 2), rowsWithKeys, 1);

      expect(reordered).not.toEqual(rows);
    });

    const testReordering = (fromIndex, toIndex, expectedOrder) => {
      const reordered = reorderRows(rankEnd(fromIndex, toIndex), rowsWithKeys, 1);
      const expected = getKeys(...expectedOrder);

      expect(extractKeys(reordered)).toEqual(expected);
    }
    it('user can reorder rows - multiple cases', () => {
      testReordering(1, 2, [0, 2, 1, 3]);
      testReordering(2, 1, [0, 2, 1, 3]);
      testReordering(3, 1, [0, 3, 1, 2]);
      testReordering(3, 0, [3, 0, 1, 2]);
      testReordering(0, 3, [1, 2, 3, 0]);
      testReordering(0, 2, [1, 2, 0, 3]);
    })
  });
});
