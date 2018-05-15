// @flow
import get from 'lodash.get';
import set from 'lodash.set';

export default class createTableTreeDataHelper {
  key: string;
  keysCache: Object;
  constructor(key: string = 'key') {
    this.key = key;
    this.keysCache = {};
  }

  updateObjectWithChildren(
    objectPath: string,
    items: Array<Object>,
    allItems: Array<Object>,
  ) {
    let newObject = [...allItems];
    let toChangeObject = get(newObject, objectPath);
    toChangeObject.children = items;
    return set(newObject, objectPath, toChangeObject);
  }

  rootItems(rootItems: Array<Object>) {
    rootItems.forEach((rootItem, index) => {
      this.keysCache[rootItem[this.key]] = index;
    });

    return rootItems;
  }

  addItem(items: Array<Object>, parentItem: Object, allItems: Array<Object>) {
    const parentLocation = this.keysCache[parentItem[this.key]];
    items.forEach((item, index) => {
      this.keysCache[item[this.key]] = `${parentLocation}.children[${index++}]`;
    });

    return this.updateObjectWithChildren(parentLocation, items, allItems);
  }
}
