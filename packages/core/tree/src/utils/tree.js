//@flow

import type {
  FlattenedItem,
  Path,
  TreeData,
  TreeItemData,
  ItemId,
  TreeItem,
} from '../types';
import { oneOf } from './handy';

export type TreeMutation = {|
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
  mutation: TreeMutation,
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
        id: itemId,
        isExpanded: oneOf(mutation.isExpanded, itemToChange.isExpanded),
        hasChildren: oneOf(mutation.hasChildren, itemToChange.hasChildren),
        children:
          typeof mutation.children !== 'undefined'
            ? mutation.children
            : itemToChange.children,
        isChildrenLoading: oneOf(
          mutation.isChildrenLoading,
          itemToChange.isChildrenLoading,
        ),
        data: oneOf(mutation.data, itemToChange.data),
      },
    },
  };
};

export const isSamePath = (a: Path, b: Path): boolean => {
  if (a === b) {
    return true;
  }
  return a.length === b.length && a.every((v, i) => v === b[i]);
};
