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

/*
  Constructs a new FlattenedItem
 */
const createFlattenedItem = (
  item: TreeItem,
  currentPath: Path,
): FlattenedItem => {
  return {
    item,
    path: currentPath,
  };
};

/*
  Flatten the children of the given subtree
*/
const flattenChildren = (tree: TreeData, item: TreeItem, currentPath: Path) => {
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

/*
  Mutate one TreeItem with a given mutation.
  Required to satisfy Flow
 */
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

/*
  Checking if two given path are equal
 */
export const isSamePath = (a: Path, b: Path): boolean => {
  if (a === b) {
    return true;
  }
  return a.length === b.length && a.every((v, i) => v === b[i]);
};

/*
  Checks if the two paths have the same parent
 */
export const hasSameParent = (a: Path, b: Path): boolean =>
  a &&
  b &&
  a.length === b.length &&
  isSamePath(getParentPath(a), getParentPath(b));

/*
  Calculates the parent path for a path
 */
export const getParentPath = (child: Path): Path => {
  return child.slice(0, child.length - 1);
};

/*
  Calculates the source path after drag&drop ends
 */
export const getSourcePath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
): Path => flattenedTree[sourceIndex].path;

/*
  Calculates the destination path after drag&drop ends

  During dragging the items are being displaced based on the location of the dragged item.
  Displacement depends on which direction the item is coming from.

  index
        -----------        -----------
  0     | item 0           | item 1 (displaced)
        -----------        -----------
  1     | item 1           | item 2 (displaced)
        -----------  --->  -----------      -----------
  2     | item 2                            | item 0 (dragged)
        -----------        -----------      -----------
  3     | item 3           | item 3
        -----------        -----------

 */
export const getDestinationPath = (
  flattenedTree: FlattenedTree,
  sourceIndex: number,
  destinationIndex: number,
): Path => {
  // Moving down
  const down = destinationIndex > sourceIndex;
  // Stayed at the same place
  const samePlace = destinationIndex === sourceIndex;
  // Path of the source location
  const sourcePath = getSourcePath(flattenedTree, sourceIndex);
  // Path of the upper item where the item was dropped
  const upperPath = down
    ? flattenedTree[destinationIndex].path
    : flattenedTree[destinationIndex - 1] &&
      flattenedTree[destinationIndex - 1].path;
  // Path of the lower item where the item was dropped
  const lowerPath =
    down || samePlace
      ? flattenedTree[destinationIndex + 1] &&
        flattenedTree[destinationIndex + 1].path
      : flattenedTree[destinationIndex].path;

  if (samePlace) {
    // We do nothing
    return sourcePath;
  }

  /*
    We are going to differentiate between 3 cases:
      - item moved to the top of a list
      - item moved between two items on the same level
      - item moved to the end of list. This is an ambiguous case.
   */

  // Top of the list
  if (isTopOfTheList(upperPath, lowerPath)) {
    return lowerPath;
  }

  // Between two items on the same level
  if (hasSameParent(upperPath, lowerPath)) {
    if (down && hasSameParent(upperPath, sourcePath)) {
      // if item was moved down within the list, it will replace the displaced item
      return upperPath;
    }
    return lowerPath;
  }

  // End of list
  // this means that the upper item is deeper in the tree.

  const lowerLevel = lowerPath ? lowerPath.length : 1;
  const upperLevel = upperPath ? upperPath.length : 1;
  const sourceLevel = sourcePath.length;
  // Disambiguation of the level.
  const finalLevel = sourceLevel <= lowerLevel ? lowerLevel : upperLevel;

  if (finalLevel === upperLevel) {
    // Insert to the upper list
    const newPath = [...upperPath];
    if (!hasSameParent(upperPath, sourcePath)) {
      newPath[newPath.length - 1] += 1;
    }
    return newPath;
  }

  // Insert to the lower list
  const itemAfterWeInsert = upperPath.slice(0, finalLevel);
  const newPath = [...itemAfterWeInsert];
  if (!hasSameParent(itemAfterWeInsert, sourcePath) || !down) {
    newPath[newPath.length - 1] += 1;
  }
  return newPath;
};

const isTopOfTheList = (upperPath: Path, lowerPath: Path) =>
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
