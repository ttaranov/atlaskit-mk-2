// @flow

export default function toTableTreeData(
  rowsData: Array<Object>,
  parentItem: ?Object = null,
  oldItemsById: ?Object,
  {
    keyId = 'id',
    childId = 'childIds',
  }: { keyId?: string, childId?: string } = {},
): {
  itemsById: Object,
  rootIds?: Array<number | string>,
} {
  const newItemsById = {};
  for (const rowData of rowsData) {
    newItemsById[rowData[keyId]] = rowData;
  }

  if (parentItem === null || parentItem === undefined) {
    return {
      itemsById: newItemsById,
      rootIds: rowsData.map(rowData => rowData[keyId]),
    };
  }

  const updatedParentItem = {
    ...parentItem,
    [childId]: rowsData.map(child => child[keyId]),
  };

  return {
    itemsById: {
      ...oldItemsById,
      ...newItemsById,
      [parentItem[keyId]]: updatedParentItem,
    },
  };
}
