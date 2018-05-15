// @flow
import toTableTreeData from '../../utils/toTableTreeData';

test('to return rootIds and itemsById for root items with defaults', () => {
  const rootData = [
    { title: 'Chapter One', page: 10, id: 1 },
    { title: 'Chapter Two', page: 20, id: 2 },
    { title: 'Chapter Three', page: 30, id: 3 },
  ];

  const formatedData = toTableTreeData(rootData);

  expect(formatedData.rootIds).toEqual([1, 2, 3]);
  expect(formatedData.itemsById).toEqual({
    '1': { id: 1, page: 10, title: 'Chapter One' },
    '2': { id: 2, page: 20, title: 'Chapter Two' },
    '3': { id: 3, page: 30, title: 'Chapter Three' },
  });
});

test('to return rootIds and itemsById for root items with custom id', () => {
  const rootData = [
    { title: 'Chapter One', page: 10, id: 1 },
    { title: 'Chapter Two', page: 20, id: 2 },
    { title: 'Chapter Three', page: 30, id: 3 },
  ];

  const formatedData = toTableTreeData(
    rootData,
    undefined,
    {},
    { idKey: 'title' },
  );

  expect(formatedData.rootIds).toEqual([
    'Chapter One',
    'Chapter Two',
    'Chapter Three',
  ]);
  expect(formatedData.itemsById).toEqual({
    'Chapter One': { id: 1, page: 10, title: 'Chapter One' },
    'Chapter Two': { id: 2, page: 20, title: 'Chapter Two' },
    'Chapter Three': { id: 3, page: 30, title: 'Chapter Three' },
  });
});

test('to update the parent item with child ids', () => {
  const parentItem = { title: 'Chapter One', page: 10, id: 1 };
  const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
  const formatedData = toTableTreeData(childItem, parentItem);
  expect(formatedData).toEqual({
    itemsById: {
      '1': { title: 'Chapter One', page: 10, id: 1, childIds: [2] },
      '2': { title: 'Chapter Two', page: 20, id: 2 },
    },
  });
});

test('to update the parent item with child ids - with custom ids', () => {
  const parentItem = { title: 'Chapter One', page: 10, id: 1 };
  const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
  const formatedData = toTableTreeData(
    childItem,
    parentItem,
    {},
    { idKey: 'title' },
  );
  expect(formatedData).toEqual({
    itemsById: {
      'Chapter One': {
        title: 'Chapter One',
        page: 10,
        id: 1,
        childIds: ['Chapter Two'],
      },
      'Chapter Two': { title: 'Chapter Two', page: 20, id: 2 },
    },
  });
});
