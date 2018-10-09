//@flow

import type {
  FlattenedItem,
  Path,
  TreeData,
  TreeItemData,
  ItemId,
  TreeItem,
  TreeSourcePosition,
  TreeDestinationPosition,
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

export const getTreePosition = (
  tree: TreeData,
  path: Path,
): TreeSourcePosition => {
  const parent: TreeItem = getParent(tree, path);
  const index: number = getIndexAmongSiblings(path);
  return {
    parentId: parent.id,
    index,
  };
};

const hasLoadedChildren = (item: TreeItem): boolean =>
  !!item.hasChildren && item.children.length > 0;

const isLeafItem = (item: TreeItem): boolean => !item.hasChildren;

const removeItemFromTree = (
  tree: TreeData,
  position: TreeSourcePosition,
): { tree: TreeData, itemRemoved: TreeItem } => {
  const sourceParent: TreeItem = tree.items[position.parentId];
  const newSourceChildren = [...sourceParent.children];
  const itemRemoved: TreeItem = newSourceChildren.splice(position.index, 1)[0];
  const newTree = mutateTree(tree, position.parentId, {
    children: newSourceChildren,
    hasChildren: newSourceChildren.length > 0,
    isExpanded: newSourceChildren.length > 0 && sourceParent.isExpanded,
  });
  return {
    tree: newTree,
    itemRemoved,
  };
};

const addItemToTree = (
  tree: TreeData,
  position: TreeDestinationPosition,
  item: TreeItem,
): TreeData => {
  const destinationParent: TreeItem = tree.items[position.parentId];
  const newDestinationChildren = [...destinationParent.children];
  if (typeof position.index === 'undefined') {
    if (hasLoadedChildren(destinationParent) || isLeafItem(destinationParent)) {
      newDestinationChildren.push(item);
    }
  } else {
    newDestinationChildren.splice(position.index, 0, item);
  }
  return mutateTree(tree, position.parentId, {
    children: newDestinationChildren,
    hasChildren: true,
  });
};

export const moveItemOnTree = (
  tree: TreeData,
  from: TreeSourcePosition,
  to: TreeDestinationPosition,
): TreeData => {
  const { tree: treeWithoutSource, itemRemoved } = removeItemFromTree(
    tree,
    from,
  );
  return addItemToTree(treeWithoutSource, to, itemRemoved);
};
