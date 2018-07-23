// @flow
import get from 'lodash.get';
import set from 'lodash.set';

type OperationsType = 'APPEND' | 'UPDATE';

type OptionsType = {
  key: string,
  keysCache: Object,
  operation: OperationsType,
};

function updateRootItems(
  rootItems: Array<Object>,
  allItems?: Array<Object> = [],
  { key, keysCache, operation }: OptionsType,
) {
  let newKeysCache = { ...keysCache };
  // If it is not an append operation we can ignore allItems as they will be swaped with new items
  let allBaseItems = operation === 'UPDATE' ? [] : [...allItems];
  let startIndexWith = allBaseItems.length;
  rootItems.forEach((rootItem, index) => {
    const rootItemKey = rootItem[key];
    if (rootItemKey == undefined) {
      throw new Error(
        `[ERROR] No property '${key}' found in rootItem[${index}]`,
      );
    } else {
      newKeysCache[rootItem[key]] = index + startIndexWith;
    }
  });

  return {
    keysCache: newKeysCache,
    items: allBaseItems.concat(rootItems),
  };
}

function updateChildItems(
  newitems: Array<Object>,
  allTableItems: Array<Object>,
  itemParent: Object,
  { key, keysCache, operation }: OptionsType,
) {
  let newKeysCache = { ...keysCache };
  const parentCacheKey = itemParent[key];

  if (parentCacheKey === undefined) {
    throw new Error(`[Table Tree] No property '${key}' found in parent item`);
  }
  const parentLocation = newKeysCache[parentCacheKey];
  const allItemsCopy = [...allTableItems];
  const objectToChange = get(allItemsCopy, parentLocation);
  const baseChildrenOfObjectToChange = objectToChange.children || [];
  objectToChange.children = baseChildrenOfObjectToChange.concat(newitems);

  // Update cache
  newitems.forEach((item, index) => {
    newKeysCache[item[key]] = `${parentLocation}.children[${index +
      baseChildrenOfObjectToChange.length}]`;
  });

  return {
    keysCache: newKeysCache,
    items: set(allItemsCopy, parentLocation, objectToChange),
  };
}

/**
 * This helper class will create a cache of all the id's in the items object and
 * path to the object.
 * Example:
 * [{
 *   // item 1,
 *   id: 1,
 *   children:[{
 *     // item 1.1,
 *     id: '2'
 *   }]
 * }]
 *
 * Cache will look something like:
 * {1: 0, 2: '0.children[0]'}
 */
export default class TableTreeDataHelper {
  key: string;
  keysCache: Object;
  constructor({ key = 'key' }: { key?: string } = {}) {
    this.key = key;
    this.keysCache = {};
  }

  updateItems(
    items: Array<Object>,
    allItems?: Array<Object> = [],
    parentItem: ?Object,
  ) {
    const options = {
      key: this.key,
      keysCache: this.keysCache,
      operation: 'UPDATE',
    };
    if (!parentItem) {
      let { keysCache, items: updatedRootItems } = updateRootItems(
        items,
        allItems,
        options,
      );
      this.keysCache = keysCache;
      return updatedRootItems;
    }

    let { keysCache, items: updatedItems } = updateChildItems(
      items,
      allItems,
      parentItem,
      options,
    );
    this.keysCache = keysCache;
    return updatedItems;
  }

  appendItems(
    items: Array<Object>,
    allItems: Array<Object> = [],
    parentItem: ?Object,
  ) {
    const options = {
      key: this.key,
      keysCache: this.keysCache,
      operation: 'APPEND',
    };
    if (!parentItem) {
      let { keysCache, items: updatedRootItems } = updateRootItems(
        items,
        allItems,
        options,
      );
      this.keysCache = keysCache;
      return updatedRootItems;
    }

    let { keysCache, items: updatedItems } = updateChildItems(
      items,
      allItems,
      parentItem,
      options,
    );
    this.keysCache = keysCache;
    return updatedItems;
  }
}
