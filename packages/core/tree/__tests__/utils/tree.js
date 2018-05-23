//@flow

import { flattenTree, mutateTree } from '../../src/utils/tree';
import { treeWithThreeLeaves } from '../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../mockdata/treeWithTwoBranches';

describe('@atlaskit/tree - utils/tree', () => {
  describe('#flattenTree', () => {
    it('returns empty list if no children', () => {
      expect(flattenTree({ id: '', children: [] }).length).toBe(0);
    });

    it('returns a flat list with path for one level tree', () => {
      const flatResults = flattenTree(treeWithThreeLeaves);
      expect(flatResults.length).toBe(3);
      expect(flatResults[0]).toEqual({
        item: treeWithThreeLeaves.children[0],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithThreeLeaves.children[1],
        path: [1],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithThreeLeaves.children[2],
        path: [2],
      });
    });

    it('returns a flat list with path for branches', () => {
      const flatResults = flattenTree(treeWithTwoBranches);
      expect(flatResults.length).toBe(6);
      expect(flatResults[0]).toEqual({
        item: treeWithTwoBranches.children[0],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithTwoBranches.children[0].children[0],
        path: [0, 0],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithTwoBranches.children[0].children[1],
        path: [0, 1],
      });
      expect(flatResults[3]).toEqual({
        item: treeWithTwoBranches.children[1],
        path: [1],
      });
      expect(flatResults[4]).toEqual({
        item: treeWithTwoBranches.children[1].children[0],
        path: [1, 0],
      });
      expect(flatResults[5]).toEqual({
        item: treeWithTwoBranches.children[1].children[1],
        path: [1, 1],
      });
    });

    it("doesn't show collapsed subtrees", () => {
      const collapsedTree = {
        ...treeWithTwoBranches,
        children: [
          {
            ...treeWithTwoBranches.children[0],
            isExpanded: false,
          },
          { ...treeWithTwoBranches.children[1] },
        ],
      };
      const flatResults = flattenTree(collapsedTree);
      expect(flatResults.length).toBe(4);
      expect(flatResults[0]).toEqual({
        item: collapsedTree.children[0],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: collapsedTree.children[1],
        path: [1],
      });
      expect(flatResults[2]).toEqual({
        item: collapsedTree.children[1].children[0],
        path: [1, 0],
      });
      expect(flatResults[3]).toEqual({
        item: collapsedTree.children[1].children[1],
        path: [1, 1],
      });
    });
  });

  describe('#mutateTree', () => {
    it('changes only the changed child', () => {
      const mutatedTree = mutateTree(treeWithThreeLeaves, [1], {
        isChildrenLoading: true,
      });
      expect(mutatedTree).not.toBe(treeWithThreeLeaves);
      expect(mutatedTree.children[0]).toBe(treeWithThreeLeaves.children[0]);
      expect(mutatedTree.children[1]).not.toBe(treeWithThreeLeaves.children[1]);
      expect(mutatedTree.children[1].isChildrenLoading).toBe(true);
      expect(treeWithThreeLeaves.children[1].isChildrenLoading).toBe(false);
    });

    it('changes only the changed path', () => {
      const mutatedTree = mutateTree(treeWithTwoBranches, [1, 1], {
        isChildrenLoading: true,
      });
      expect(mutatedTree).not.toBe(treeWithTwoBranches);
      expect(mutatedTree.children[0]).toBe(treeWithTwoBranches.children[0]);
      expect(mutatedTree.children[1]).not.toBe(treeWithTwoBranches.children[1]);
      expect(mutatedTree.children[1].children[0]).toBe(
        treeWithTwoBranches.children[1].children[0],
      );
      expect(mutatedTree.children[1].children[1]).not.toBe(
        treeWithTwoBranches.children[1].children[1],
      );
      expect(mutatedTree.children[1].children[1].isChildrenLoading).toBe(true);
      expect(
        treeWithTwoBranches.children[1].children[1].isChildrenLoading,
      ).toBe(false);
    });
  });
});
