// @flow
import TableTreeDataHelper from '../../../utils/TableTreeDataHelper';

test('to return rootIds and itemsById for root items with defaults', () => {
  const rootData = [
    { title: 'Chapter One', page: 10, id: 1 },
    { title: 'Chapter Two', page: 20, id: 2 },
    { title: 'Chapter Three', page: 30, id: 3 },
  ];
  const tableTreeDataHelper = new TableTreeDataHelper();
  const formatedData = tableTreeDataHelper.updateItems(rootData);
  expect(formatedData).toEqual([
    { title: 'Chapter One', page: 10, id: 1 },
    { title: 'Chapter Two', page: 20, id: 2 },
    { title: 'Chapter Three', page: 30, id: 3 },
  ]);
});

test('to return rootIds and itemsById for root items with custom id', () => {
  const rootData = [
    { title: 'Chapter One', page: 10, id: 1 },
    { title: 'Chapter Two', page: 20, id: 2 },
    { title: 'Chapter Three', page: 30, id: 3 },
  ];
  const tableTreeDataHelperInstance = new TableTreeDataHelper({ key: 'title' });
  const formatedData = tableTreeDataHelperInstance.updateItems(rootData);
  expect(formatedData).toEqual([
    { id: 1, page: 10, title: 'Chapter One' },
    { id: 2, page: 20, title: 'Chapter Two' },
    { id: 3, page: 30, title: 'Chapter Three' },
  ]);
});

test('to update the parent item with child ids', () => {
  const parentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
  const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
  const tableTreeDataHelperInstance = new TableTreeDataHelper();
  tableTreeDataHelperInstance.updateItems(parentItem);
  const formatedData = tableTreeDataHelperInstance.updateItems(
    childItem,
    parentItem,
    ...parentItem,
  );
  expect(formatedData).toEqual([
    {
      children: [{ id: 2, page: 20, title: 'Chapter Two' }],
      id: 1,
      page: 10,
      title: 'Chapter One',
    },
  ]);
});

test('to update the parent item with child ids - with custom ids', () => {
  const parentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
  const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
  const tableTreeDataHelperInstance = new TableTreeDataHelper({ key: 'title' });
  tableTreeDataHelperInstance.updateItems(parentItem);

  const formatedData = tableTreeDataHelperInstance.updateItems(
    childItem,
    parentItem,
    ...parentItem,
  );
  expect(formatedData).toEqual([
    {
      id: 1,
      page: 10,
      title: 'Chapter One',
      children: [{ id: 2, page: 20, title: 'Chapter Two' }],
    },
  ]);
});
