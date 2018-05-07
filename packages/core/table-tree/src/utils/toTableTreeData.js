// @flow

export default function toTableTreeData(
  rowsData: Array<Object> | Object,
  parentItem: ?Object = null,
  oldItemsById: ?Object,
  keyId: string = 'id',
  customChildId: string = 'childIds',
): {
  itemsById: Object,
  rootIds?: Array<mixed>,
} {
  let newItemsById = {};
  for (const rowData of rowsData) {
    newItemsById[rowData.id] = rowData;
  }

  if (parentItem === null || parentItem === undefined) {
    return {
      itemsById: newItemsById,
      rootIds: rowsData.map(rowData => rowData[keyId]),
    };
  }

  let updatedParentItem = {
    ...parentItem,
    [customChildId]: rowsData.map(child => child.id),
  };

  return {
    itemsById: {
      ...oldItemsById,
      ...newItemsById,
      [parentItem[keyId]]: updatedParentItem,
    },
  };
}
