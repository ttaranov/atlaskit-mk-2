//@flow

import { flattenTree } from '../../src/utils/tree';
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
        path: ['1-1'],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithThreeLeaves.children[1],
        path: ['1-2'],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithThreeLeaves.children[2],
        path: ['1-3'],
      });
    });

    it('returns a flat list with path for branches', () => {
      const flatResults = flattenTree(treeWithTwoBranches);
      expect(flatResults.length).toBe(6);
      expect(flatResults[0]).toEqual({
        item: treeWithTwoBranches.children[0],
        path: ['1-1'],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithTwoBranches.children[0].children[0],
        path: ['1-1', '1-1-1'],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithTwoBranches.children[0].children[1],
        path: ['1-1', '1-1-2'],
      });
      expect(flatResults[3]).toEqual({
        item: treeWithTwoBranches.children[1],
        path: ['1-2'],
      });
      expect(flatResults[4]).toEqual({
        item: treeWithTwoBranches.children[1].children[0],
        path: ['1-2', '1-2-1'],
      });
      expect(flatResults[5]).toEqual({
        item: treeWithTwoBranches.children[1].children[1],
        path: ['1-2', '1-2-2'],
      });
    });
  });
});
