//@flow

import type {
  FlattenedItem,
  TreeItem,
  Path,
  TreeData,
  TreeItemData,
} from '../types';

export type TreeMutation = {|
  children?: Array<TreeItem>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: TreeItemData,
|};

export const cloneTree = (tree: TreeItem): TreeItem => {
  return {
    id: tree.id,
    children: [...tree.children],
    hasChildren: tree.hasChildren,
    isExpanded: tree.isExpanded,
    isChildrenLoading: tree.isChildrenLoading,
    data: { ...tree.data },
  };
};

export const flattenTree = (tree: TreeData, path: Path = []): FlattenedItem[] =>
  tree.children.reduce((flat, item, index) => {
    const currentPath = [...path, index];
    const currentItem = {
      item,
      path: currentPath,
    };
    const children = item.isExpanded ? flattenTree(item, currentPath) : [];
    return flat.concat([currentItem, ...children]);
  }, []);

export const mutateTree = (
  tree: TreeItem,
  path: Path,
  item: TreeMutation,
): TreeItem => {
  if (path.length === 0) {
    return tree;
  }
  const newTree: TreeItem = cloneTree(tree);
  const [currentIndex, ...restPath] = path;
  if (restPath.length === 0) {
    newTree.children[currentIndex] = {
      ...newTree.children[currentIndex],
      ...item,
    };
  } else {
    newTree.children[currentIndex] = mutateTree(
      tree.children[currentIndex],
      restPath,
      item,
    );
  }
  return newTree;
};

export const getItem = (tree: TreeData, path: Path): TreeItem => {
  let cursor: TreeItem = tree;
  for (let i of path) {
    cursor = cursor.children[i];
  }
  return cursor;
};
