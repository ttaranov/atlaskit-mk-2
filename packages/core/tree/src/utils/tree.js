//@flow

import type {
  FlattenedItem,
  TreeItem,
  Path,
  TreeData,
  TreeItemData,
} from '../types';
import { oneOf } from './handy';

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
  mutation: TreeMutation,
): TreeItem => {
  if (path.length === 0) {
    return {
      id: tree.id,
      isExpanded: oneOf(mutation.isExpanded, tree.isExpanded),
      hasChildren: oneOf(mutation.hasChildren, tree.hasChildren),
      children:
        typeof mutation.children !== 'undefined'
          ? mutation.children
          : tree.children,
      isChildrenLoading: oneOf(
        mutation.isChildrenLoading,
        tree.isChildrenLoading,
      ),
      data: oneOf(mutation.data, tree.data),
    };
  }
  const newTree: TreeItem = cloneTree(tree);
  const [currentIndex, ...restPath] = path;
  newTree.children[currentIndex] = mutateTree(
    tree.children[currentIndex],
    restPath,
    mutation,
  );
  return newTree;
};

export const getItem = (tree: TreeData, path: Path): TreeItem => {
  let cursor: TreeItem = tree;
  for (const i of path) {
    cursor = cursor.children[i];
  }
  return cursor;
};

export const isSamePath = (a: Path, b: Path): boolean => {
  if (!a || !b) {
    return false;
  }
  return a.length === b.length && a.every((v, i) => v === b[i]);
};
