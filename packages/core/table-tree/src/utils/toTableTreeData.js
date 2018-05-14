// @flow

export default function toTableTreeData(
  addedRowsData: Array<Object>,
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
  for (const rowData of addedRowsData) {
    newItemsById[rowData[keyId]] = rowData;
  }

  if (parentItem === null || parentItem === undefined) {
    return {
      itemsById: newItemsById,
      rootIds: addedRowsData.map(rowData => rowData[keyId]),
    };
  }

  const updatedParentItem = {
    ...parentItem,
    [childId]: addedRowsData.map(child => child[keyId]),
  };

  return {
    itemsById: {
      ...oldItemsById,
      ...newItemsById,
      [parentItem[keyId]]: updatedParentItem,
    },
  };
}
