//@flow

import type { FlattenedItem, Path, TreeData } from '../types';

export const flattenTree = (tree: TreeData, path: Path = []): FlattenedItem[] =>
  tree.children.reduce((flat, item) => {
    const currentPath = [...path, item.id];
    const currentItem = {
      item,
      path: currentPath,
    };
    const children = flattenTree(item, currentPath);
    return flat.concat([currentItem, ...children]);
  }, []);
