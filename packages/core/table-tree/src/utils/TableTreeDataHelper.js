// @flow
import get from 'lodash.get';
import set from 'lodash.set';

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
    const addRootItems = (rootItems: Array<Object>) => {
      rootItems.forEach((rootItem, index) => {
        this.keysCache[rootItem[this.key]] = index;
      });
      return rootItems;
    };

    const addChildItems = (
      newitems: Array<Object>,
      allTableItems: Array<Object>,
      itemParent: Object,
    ) => {
      const parentLocation = this.keysCache[itemParent[this.key]];
      // Update cache
      newitems.forEach((item, index) => {
        this.keysCache[item[this.key]] = `${parentLocation}.children[${index}]`;
      });

      const allItemsCopy = [...allTableItems];
      const objectToChange = get(allItemsCopy, parentLocation);
      objectToChange.children = newitems;

      return set(allItemsCopy, parentLocation, objectToChange);
    };

    if (!parentItem) {
      return addRootItems(items);
    }

    return addChildItems(items, allItems, parentItem);
  }

  appendItems(
    items: Array<Object>,
    allItems: Array<Object> = [],
    parentItem: ?Object,
  ) {
    const appendRootItems = (rootItems: Array<Object>) => {
      rootItems.forEach((rootItem, index) => {
        const key = rootItem[this.key];
        if (key === undefined) {
          throw new Error(
            `No property '${this.key}' found in rootItem[${index}]`,
          );
        }
        this.keysCache[key] = index + allItems.length;
      });
      return allItems.concat(rootItems);
    };

    const appendChildItems = (
      newitems: Array<Object>,
      allTableItems: Array<Object>,
      itemParent: Object,
    ) => {
      const parentCacheKey = itemParent[this.key];
      if (parentCacheKey === undefined) {
        throw new Error(`No property '${this.key}' found in parent item`);
      }
      const parentLocation = this.keysCache[parentCacheKey];

      const allItemsCopy = [...allTableItems];
      const objectToChange = get(allItemsCopy, parentLocation);
      const existingChildren = objectToChange.children || [];
      objectToChange.children = existingChildren.concat(newitems);

      // Update cache
      newitems.forEach((item, index) => {
        this.keysCache[item[this.key]] = `${parentLocation}.children[${index +
          existingChildren.length}]`;
      });

      return set(allItemsCopy, parentLocation, objectToChange);
    };

    if (!parentItem) {
      return appendRootItems(items, allItems);
    }

    return appendChildItems(items, allItems, parentItem);
  }
}
