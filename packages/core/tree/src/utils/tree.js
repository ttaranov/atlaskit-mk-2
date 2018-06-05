//@flow

import type {
  FlattenedItem,
  Path,
  TreeData,
  TreeItemData,
  ItemId,
} from '../types';
import { oneOf } from './handy';

export type TreeMutation = {|
  children?: Array<ItemId>,
  hasChildren?: boolean,
  isExpanded?: boolean,
  isChildrenLoading?: boolean,
  data?: TreeItemData,
|};

export const flattenTree = (tree: TreeData, path: Path = []): FlattenedItem[] =>
  tree.items[tree.rootId]
    ? tree.items[tree.rootId].children.reduce((flat, itemId, index) => {
        const item = tree.items[itemId];
        const currentPath = [...path, index];
        const currentItem = {
          item,
          path: currentPath,
        };
        const children = item.isExpanded
          ? flattenTree({ rootId: itemId, items: tree.items }, currentPath)
          : [];
        return flat.concat([currentItem, ...children]);
      }, [])
    : [];

export const mutateTree = (
  tree: TreeData,
  itemId: ItemId,
  mutation: TreeMutation,
): TreeData => {
  const itemToChange = tree.items[itemId];
  if (!itemToChange) {
    return tree;
  }
  return {
    rootId: tree.rootId,
    items: {
      ...tree.items,
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
