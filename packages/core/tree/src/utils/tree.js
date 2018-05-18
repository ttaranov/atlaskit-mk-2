//@flow

import type { FlattenedItem, Path, TreeData } from '../types';

export const flattenTree = (
  tree: TreeData,
  path: Path = [],
): FlattenedItem[] => {
  if (
    tree.children &&
    Array.isArray(tree.children) &&
    tree.children.length > 0
  ) {
    return tree.children.reduce((flat, item) => {
      const currentPath = [...path, item.id];
      const currentItem = {
        item,
        path: currentPath,
      };
      const children = Array.isArray(item.children)
        ? flattenTree(item, currentPath)
        : [];
      return flat.concat([currentItem, ...children]);
    }, []);
  }
  return [];
};
