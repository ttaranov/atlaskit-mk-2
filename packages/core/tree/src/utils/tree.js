//@flow

import type {
  FlattenedItem,
  Path,
  TreeData,
  TreeItemData,
  ItemId,
  TreeItem,
  FlattenedTree,
} from '../types';
import { oneOf } from './handy';
import type { DragPosition } from '../components/Tree-types';

export type TreeItemMutation = {|
  id?: ItemId,
  children?: Array<ItemId>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: TreeItemData,
|};

/*
  Transforms tree structure into flat list of items for rendering purposes.
  We recursively go through all the elements and its children first on each level
 */
export const flattenTree = (tree: TreeData, path: Path = []): FlattenedItem[] =>
  tree.items[tree.rootId]
    ? tree.items[tree.rootId].children.reduce((flat, itemId, index) => {
        // iterating through all the children on the given level
        const item = tree.items[itemId];
        const currentPath = [...path, index];
        // we create a flattened item for the current item
        const currentItem = createFlattenedItem(item, currentPath);
        // we flatten its children
        const children = flattenChildren(tree, item, currentPath);
        // append to the accumulator
        return [...flat, currentItem, ...children];
      }, [])
    : [];

const createFlattenedItem = function(item: TreeItem, currentPath: Path) {
  return {
    item,
    path: currentPath,
  };
};

const flattenChildren = function(
  tree: TreeData,
  item: TreeItem,
  currentPath: Path,
) {
  return item.isExpanded
    ? flattenTree({ rootId: item.id, items: tree.items }, currentPath)
    : [];
};

/*
  Changes the tree data structure with minimal reference changes.
 */
export const mutateTree = (
  tree: TreeData,
  itemId: ItemId,
  mutation: TreeItemMutation,
): TreeData => {
  const itemToChange = tree.items[itemId];
  if (!itemToChange) {
    // Item not found
    return tree;
  }
  // Returning a clone of the tree structure and overwriting the field coming in mutation
  return {
    // rootId should not change
    rootId: tree.rootId,
    items: {
      // copy all old items
      ...tree.items,
      // overwriting only the item being changed
      [itemId]: mutateTreeItem(itemToChange, mutation),
    },
  };
};

export const mutateTreeItem = (
  treeItem: TreeItem,
  mutation: TreeItemMutation,
): TreeItem => {
  return {
    id: oneOf(mutation.id, treeItem.id),
    isExpanded: oneOf(mutation.isExpanded, treeItem.isExpanded),
    hasChildren: oneOf(mutation.hasChildren, treeItem.hasChildren),
    children:
      typeof mutation.children !== 'undefined'
        ? mutation.children
        : treeItem.children,
    isChildrenLoading: oneOf(
      mutation.isChildrenLoading,
      treeItem.isChildrenLoading,
    ),
    data: oneOf(mutation.data, treeItem.data),
  };
};

export const isSamePath = (a: Path, b: Path): boolean => {
  if (a === b) {
    return true;
  }
  return a.length === b.length && a.every((v, i) => v === b[i]);
};

export const getPath = (tree: FlattenedTree, index: number) => tree[index].path;

export const getParentOfFlattenedIndex = (
  tree: FlattenedTree,
  index: number,
): ?TreeItem => {
  const path: Path = getPath(tree, index);

  for (let i = index - 1; i >= 0; i--) {
    if (tree[i].path.length < path.length) {
      return tree[i].item;
    }
  }
  return null;
};

export const hasSameParent = (a: Path, b: Path): boolean => {
  return (
    a &&
    b &&
    a.length === b.length &&
    getParentPath(a).every((v, i) => v === b[i])
  );
};

export const getParentPath = (child: Path): Path => {
  return child.slice(0, child.length - 1);
};

export const getSourcePath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
) => flattenedTree[sourceIndex].path;

export const getDestinationPath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
  destinationIndex: number,
) => {
  const down = destinationIndex > sourceIndex;
  const samePlace = destinationIndex === sourceIndex;
  const sourcePath = getSourcePath(flattenedTree, sourceIndex);
  const upperPath = down
    ? flattenedTree[destinationIndex].path
    : flattenedTree[destinationIndex - 1] &&
      flattenedTree[destinationIndex - 1].path;
  const lowerPath =
    down || samePlace
      ? flattenedTree[destinationIndex + 1] &&
        flattenedTree[destinationIndex + 1].path
      : flattenedTree[destinationIndex].path;

  console.log('Upperpath: ', upperPath);
  console.log('Lowerpath: ', lowerPath);

  if (samePlace) {
    return sourcePath;
  }

  // Inserting between 2 items on the same level
  if (hasSameParent(upperPath, lowerPath)) {
    if ((samePlace || down) && !hasSameParent(upperPath, sourcePath)) {
      return lowerPath;
    }
    return flattenedTree[destinationIndex].path;
  }

  // Beginning of the list
  if (isBeginningOfTheList(upperPath, lowerPath)) {
    return lowerPath;
  }

  // End of list

  const lowerLevel = lowerPath ? lowerPath.length : 1;
  const upperLevel = upperPath ? upperPath.length : 1;
  const sourceLevel = sourcePath.length;
  const finalLevel = sourceLevel <= lowerLevel ? lowerLevel : upperLevel;

  if (finalLevel === upperLevel) {
    // Insert to the upper list
    const newPath = [...upperPath];
    if (!hasSameParent(upperPath, sourcePath)) {
      newPath[newPath.length - 1] += 1;
    }
    return newPath;
  }

  const afterItem = upperPath.slice(0, finalLevel);
  const newPath = [...afterItem];
  if (!hasSameParent(afterItem, sourcePath) || !down) {
    newPath[newPath.length - 1] += 1;
  }
  return newPath;
};

const isBeginningOfTheList = (upperPath: Path, lowerPath: Path) =>
  !upperPath || isParentOf(upperPath, lowerPath);

export const getItem = (tree: TreeData, path: Path): TreeItem => {
  let cursor: TreeItem = tree.items[tree.rootId];
  for (const i of path) {
    cursor = tree.items[cursor.children[i]];
  }
  return cursor;
};

const isParentOf = (parent: Path, child: Path): boolean =>
  parent && child && isSamePath(parent, getParentPath(child));

export const getDragPosition = (tree: TreeData, path: Path): ?DragPosition => {
  const parentPath = path.slice(0, -1);
  const parent = getItem(tree, parentPath);
  if (parent) {
    return {
      parentId: parent.id,
      index: path.slice(-1)[0],
    };
  }
  return null;
};
