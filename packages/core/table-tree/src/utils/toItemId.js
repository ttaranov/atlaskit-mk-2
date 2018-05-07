// @flow

export default function toItemId(id: string) {
  return `tabletreeitem-${id}`.replace(/[^-_a-zA-Z0-9]/g, '');
}

export function toTableTreeData(
  rowsData: Array<Object> | Object,
  parentItem: ?Object = null,
  oldItemsById: ?Object,
  keyId: string = 'id',
  customChildId: string = 'childIds',
) {
  let itemsById = oldItemsById || {};
  if (parentItem === null || parentItem === undefined) {
    let rootIds = rowsData.map(rowData => rowData[keyId]);
    for (const rowData of rowsData) {
      itemsById[rowData.id] = rowData;
    }
    return {
      rootIds,
      itemsById,
    };
  }

  let updatedParentItem = {
    ...parentItem,
    [customChildId]: rowsData.map(child => child.id),
  };
  const addedChildItemsById = {};
  for (const child of rowsData) {
    addedChildItemsById[child.id] = child;
  }
  return {
    itemsById: {
      ...itemsById,
      ...addedChildItemsById,
      [parentItem[keyId]]: updatedParentItem,
    },
  };
}
