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
export default class CreateTableTreeDataHelper {
  key: string;
  keysCache: Object;
  constructor(key: string = 'key') {
    this.key = key;
    this.keysCache = {};
  }

  addRootItems(rootItems: Array<Object>) {
    // Create cache
    rootItems.forEach((rootItem, index) => {
      this.keysCache[rootItem[this.key]] = index;
    });

    return rootItems;
  }

  addChildItem(
    items: Array<Object>,
    allItems: Array<Object>,
    parentItem: Object,
  ) {
    const parentLocation = this.keysCache[parentItem[this.key]];
    // Update cache
    items.forEach((item, index) => {
      this.keysCache[item[this.key]] = `${parentLocation}.children[${index++}]`;
    });

    let allItemsCopy = [...allItems];
    let objectToChange = get(allItemsCopy, parentLocation);
    objectToChange.children = items;

    return set(allItemsCopy, parentLocation, objectToChange);
  }

  updateItems(
    items: Array<Object>,
    allItems?: Array<Object> = [],
    parentItem: ?Object,
  ) {
    if (!parentItem) {
      return this.addRootItems(items);
    }

    return this.addChildItem(items, allItems, parentItem);
  }
}
