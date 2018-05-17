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
}
