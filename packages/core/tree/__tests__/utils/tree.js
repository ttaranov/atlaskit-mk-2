//@flow

import {
  flattenTree,
  getDestinationPath,
  getDragPosition,
  getItem,
  getParentOfFlattenedIndex,
  getSourcePath,
  isSamePath,
  mutateTree,
} from '../../src/utils/tree';
import { treeWithThreeLeaves } from '../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../mockdata/treeWithTwoBranches';
import { complexTree } from '../../mockdata/complexTree';

const flatTreeWithTwoBranches = flattenTree(treeWithTwoBranches);
const flatComplexTree = flattenTree(complexTree);

describe('@atlaskit/tree - utils/tree', () => {
  describe('#flattenTree', () => {
    it('returns empty list if no children', () => {
      expect(flattenTree({ rootId: 'x', items: {} }).length).toBe(0);
    });

    it('returns a flat list with path for one level tree', () => {
      const flatResults = flattenTree(treeWithThreeLeaves);
      expect(flatResults.length).toBe(3);
      expect(flatResults[0]).toEqual({
        item: treeWithThreeLeaves.items['1-1'],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithThreeLeaves.items['1-2'],
        path: [1],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithThreeLeaves.items['1-3'],
        path: [2],
      });
    });

    it('returns a flat list with path for branches', () => {
      const flatResults = flattenTree(treeWithTwoBranches);
      expect(flatResults.length).toBe(6);
      expect(flatResults[0]).toEqual({
        item: treeWithTwoBranches.items['1-1'],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithTwoBranches.items['1-1-1'],
        path: [0, 0],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithTwoBranches.items['1-1-2'],
        path: [0, 1],
      });
      expect(flatResults[3]).toEqual({
        item: treeWithTwoBranches.items['1-2'],
        path: [1],
      });
      expect(flatResults[4]).toEqual({
        item: treeWithTwoBranches.items['1-2-1'],
        path: [1, 0],
      });
      expect(flatResults[5]).toEqual({
        item: treeWithTwoBranches.items['1-2-2'],
        path: [1, 1],
      });
    });

    it("doesn't show collapsed subtrees", () => {
      const collapsedTree = {
        rootId: treeWithTwoBranches.rootId,
        items: {
          ...treeWithTwoBranches.items,
          '1-1': {
            ...treeWithTwoBranches.items['1-1'],
            isExpanded: false,
          },
        },
      };
      const flatResults = flattenTree(collapsedTree);
      expect(flatResults.length).toBe(4);
      expect(flatResults[0]).toEqual({
        item: collapsedTree.items['1-1'],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: collapsedTree.items['1-2'],
        path: [1],
      });
      expect(flatResults[2]).toEqual({
        item: collapsedTree.items['1-2-1'],
        path: [1, 0],
      });
      expect(flatResults[3]).toEqual({
        item: collapsedTree.items['1-2-2'],
        path: [1, 1],
      });
    });
  });

  describe('#mutateTree', () => {
    it('mutates the root', () => {
      const rootId = treeWithThreeLeaves.rootId;
      const mutatedTree = mutateTree(treeWithThreeLeaves, rootId, {
        children: [],
      });
      expect(mutatedTree).not.toBe(treeWithThreeLeaves);
      expect(mutatedTree.rootId).toBe(treeWithThreeLeaves.rootId);
      expect(mutatedTree.items).not.toBe(treeWithThreeLeaves.items);
      expect(mutatedTree.items[rootId].children.length).toBe(0);
      expect(mutatedTree.items[rootId].hasChildren).toBe(true);
      expect(mutatedTree.items[rootId].isExpanded).toBe(true);
      expect(mutatedTree.items[rootId].isChildrenLoading).toBe(false);
      expect(mutatedTree.items[rootId].data).toBe(
        treeWithThreeLeaves.items[rootId].data,
      );
      expect(treeWithThreeLeaves.items[rootId].children.length).toBe(3);
    });

    it('changes only the changed child', () => {
      const itemId = '1-2';
      const mutatedTree = mutateTree(treeWithThreeLeaves, itemId, {
        isChildrenLoading: true,
      });
      expect(mutatedTree).not.toBe(treeWithThreeLeaves);
      expect(mutatedTree.items['1-1']).toBe(treeWithThreeLeaves.items['1-1']);
      expect(mutatedTree.items['1-2']).not.toBe(
        treeWithThreeLeaves.items['1-2'],
      );
      expect(mutatedTree.items['1-2'].isChildrenLoading).toBe(true);
      expect(treeWithThreeLeaves.items['1-2'].isChildrenLoading).toBe(false);
    });

    it('changes only the changed item', () => {
      const itemId = '1-2-2';
      const mutatedTree = mutateTree(treeWithTwoBranches, itemId, {
        isChildrenLoading: true,
      });
      expect(mutatedTree).not.toBe(treeWithTwoBranches);
      expect(mutatedTree.items['1-1']).toBe(treeWithTwoBranches.items['1-1']);
      expect(mutatedTree.items['1-2']).toBe(treeWithTwoBranches.items['1-2']);
      expect(mutatedTree.items['1-2-1']).toBe(
        treeWithTwoBranches.items['1-2-1'],
      );
      expect(mutatedTree.items['1-2-2']).not.toBe(
        treeWithTwoBranches.items['1-2-2'],
      );
      expect(mutatedTree.items['1-2-2'].isChildrenLoading).toBe(true);
      expect(treeWithTwoBranches.items['1-2-2'].isChildrenLoading).toBe(false);
    });

    it('does not change if item not found', () => {
      expect(
        mutateTree(treeWithTwoBranches, 'notfound', { isExpanded: true }),
      ).toBe(treeWithTwoBranches);
    });
  });

  describe('#isSamePath', () => {
    it('returns true if for the same instances', () => {
      const path = [1, 1];
      expect(isSamePath(path, path)).toBe(true);
    });

    it("returns true if it's the same", () => {
      expect(isSamePath([1, 1], [1, 1])).toBe(true);
    });

    it("returns false if it's not", () => {
      expect(isSamePath([1, 1, 1], [1, 1])).toBe(false);
    });

    it('returns false if any of them is empty', () => {
      expect(isSamePath([], [1, 1])).toBe(false);
      expect(isSamePath([1], [])).toBe(false);
    });
  });

  describe('#getParentOfFlattenedIndex', () => {
    it('returns the parent of a given index', () => {
      expect(getParentOfFlattenedIndex(flatTreeWithTwoBranches, 1)).toEqual(
        treeWithTwoBranches.items['1-1'],
      );
    });

    it('returns null if if top level', () => {
      expect(getParentOfFlattenedIndex(flatTreeWithTwoBranches, 3)).toBe(null);
    });
  });

  describe('#getItem', () => {
    it('returns item from the first level of tree', () => {
      expect(getItem(treeWithThreeLeaves, [1])).toBe(
        treeWithThreeLeaves.items['1-2'],
      );
    });

    it('returns item from deep the tree', () => {
      expect(getItem(treeWithTwoBranches, [1, 1])).toBe(
        treeWithTwoBranches.items['1-2-2'],
      );
    });

    it('returns undefined if item does not exist', () => {
      expect(getItem(treeWithThreeLeaves, [100])).toBe(undefined);
    });
  });

  describe('#getSourcePath', () => {
    it('handles the top element', () => {
      expect(getSourcePath(flatTreeWithTwoBranches, 0)).toEqual([0]);
    });

    it('handles element deeper', () => {
      expect(getSourcePath(flatTreeWithTwoBranches, 1)).toEqual([0, 0]);
    });
  });

  describe('#getDestinationPath', () => {
    it('returns the same path if the index did not change', () => {
      expect(getDestinationPath(flatComplexTree, 1, 1)).toEqual([1]);
    });

    describe('moving down', () => {
      describe('same parent', () => {
        it('moves to the top of the list', () => {
          // not valid
        });
        it('moves to the middle of the list', () => {
          expect(getDestinationPath(flatComplexTree, 3, 4)).toEqual([2, 1]);
        });
        it('moves to the end of the list', () => {
          expect(getDestinationPath(flatComplexTree, 3, 6)).toEqual([2, 3]);
        });
      });

      describe('different parent', () => {
        describe('higher level', () => {
          it('moves to the top of the list', () => {
            // not valid
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 8)).toEqual([5]);
          });
          it('moves to the end of the list to the top level', () => {
            expect(getDestinationPath(flatComplexTree, 4, 20)).toEqual([9]);
          });
          it('moves to the end of the list to not top level', () => {
            expect(getDestinationPath(flatComplexTree, 15, 18)).toEqual([6, 5]);
          });
        });

        describe('same level', () => {
          it('moves to the top of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 10)).toEqual([6, 0]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 12)).toEqual([6, 2]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 18)).toEqual([6, 5]);
          });
        });

        describe('lower level', () => {
          it('moves to the top of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 13)).toEqual([
              6,
              2,
              0,
            ]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 14)).toEqual([
              6,
              2,
              1,
            ]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 16)).toEqual([6, 3]);
          });
        });
      });
    });

    describe('moving up', () => {
      describe('same parent', () => {
        it('moves to the top of the list', () => {
          expect(getDestinationPath(flatComplexTree, 4, 3)).toEqual([2, 0]);
        });
        it('moves to the middle of the list', () => {
          expect(getDestinationPath(flatComplexTree, 5, 4)).toEqual([2, 1]);
        });
        it('moves to the end of the list', () => {
          // not valid
        });
      });

      describe('different parent', () => {
        describe('higher level', () => {
          it('moves to the top of the list on the top level', () => {
            expect(getDestinationPath(flatComplexTree, 4, 0)).toEqual([0]);
          });
          it('moves to the top of the list not on the top level', () => {
            expect(getDestinationPath(flatComplexTree, 15, 11)).toEqual([6, 0]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 1)).toEqual([1]);
          });
          it('moves to the end of the list', () => {
            // not valid
          });
        });

        describe('same level', () => {
          it('moves to the top of the list on same level', () => {
            expect(getDestinationPath(flatComplexTree, 12, 3)).toEqual([2, 0]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 12, 4)).toEqual([2, 1]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 12, 7)).toEqual([2, 4]);
          });
        });

        describe('lower level', () => {
          it('moves to the top of the list', () => {
            expect(getDestinationPath(flatComplexTree, 18, 14)).toEqual([
              6,
              2,
              0,
            ]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 18, 15)).toEqual([
              6,
              2,
              1,
            ]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 18, 17)).toEqual([6, 3]);
          });
        });
      });
    });
  });

  describe('#getDragPosition', () => {
    it('returns the top element', () => {
      expect(getDragPosition(treeWithTwoBranches, [0])).toEqual({
        parentId: '1',
        index: 0,
      });
    });

    it('returns the top element of a sublist', () => {
      expect(getDragPosition(treeWithTwoBranches, [0, 0])).toEqual({
        parentId: '1-1',
        index: 0,
      });
    });

    it('returns the last element of a sublist', () => {
      expect(getDragPosition(treeWithTwoBranches, [0, 1])).toEqual({
        parentId: '1-1',
        index: 1,
      });
    });

    it('returns undefined for invalid', () => {
      expect(getDragPosition(treeWithTwoBranches, [100, 1])).toEqual(null);
    });
  });
});
