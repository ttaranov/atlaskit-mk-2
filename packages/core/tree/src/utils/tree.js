//@flow

import type {
  FlattenedItem,
  Path,
  TreeData,
  TreeItemData,
  ItemId,
  TreeItem,
  TreePosition,
} from '../types';

import { getParentPath, getIndexAmongSiblings } from './path';

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
      [itemId]: {
        ...itemToChange,
        ...mutation,
      },
    },
  };
};

export const getItem = (tree: TreeData, path: Path): TreeItem => {
  let cursor: TreeItem = tree.items[tree.rootId];
  for (const i: number of path) {
    cursor = tree.items[cursor.children[i]];
  }
  return cursor;
};

export const getParent = (tree: TreeData, path: Path): TreeItem => {
  const parentPath: Path = getParentPath(path);
  return getItem(tree, parentPath);
};

export const getTreePosition = (tree: TreeData, path: Path): TreePosition => {
  const parent: TreeItem = getParent(tree, path);
  const index: number = getIndexAmongSiblings(path);
  return {
    parentId: parent.id,
    index,
  };
};
