// @flow

export default function toTableTreeData(
  addedRowsData: Array<Object>,
  parentItem: ?Object = null,
  oldItemsById: ?Object,
  {
    idKey = 'id',
    childIdkey = 'childIds',
  }: { idKey?: string, childIdkey?: string } = {},
): {
  itemsById: Object,
  rootIds?: Array<number | string>,
} {
  const newItemsById = {};
  for (const rowData of addedRowsData) {
    newItemsById[rowData[idKey]] = rowData;
  }

  if (parentItem === null || parentItem === undefined) {
    return {
      itemsById: newItemsById,
      rootIds: addedRowsData.map(rowData => rowData[idKey]),
    };
  }

  const updatedParentItem = {
    ...parentItem,
    [childIdkey]: addedRowsData.map(child => child[idKey]),
  };

  return {
    itemsById: {
      ...oldItemsById,
      ...newItemsById,
      [parentItem[idKey]]: updatedParentItem,
    },
  };
}
