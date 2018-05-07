// @flow
import React from 'react';
import { mount } from 'enzyme';
import TableTree, { Rows, Row, Cell, Header, Headers } from '../index';
import { Cell as StyledCell, Header as StyledHeader } from '../styled';

const settleImmediatePromises = () =>
  new Promise(resolve => setTimeout(resolve, 0));

test('flat tree', async () => {
  const getFlatItems = parent => {
    if (parent) {
      return [];
    }
    return [
      { title: 'Chapter One', page: 10 },
      { title: 'Chapter Two', page: 20 },
      { title: 'Chapter Three', page: 30 },
    ];
  };

  const wrapper = mount(
    <TableTree>
      <Rows
        rootItems={getFlatItems()}
        render={({ title, page }) => (
          <Row itemId={title} hasChildren={false}>
            <Cell>{title}</Cell>
            <Cell>{page}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  await settleImmediatePromises();
  wrapper.update();

  const tree = createTreeHarness(wrapper);
  expect(tree.rows()).toHaveLength(3);

  expect(tree.textOfCellsInRow(0)).toEqual(['Chapter One', '10']);
  expect(tree.textOfCellsInRow(1)).toEqual(['Chapter Two', '20']);
  expect(tree.textOfCellsInRow(2)).toEqual(['Chapter Three', '30']);
});

test('chevron next to items with children', async () => {
  const nestedData = [
    {
      title: 'Chapter One',
      page: 10,
    },
    {
      title: 'Chapter Two',
      page: 20,
      children: [
        {
          title: 'Chapter Two Subchapter One',
          page: 21,
        },
      ],
    },
  ];
  const getNestedItems = () => nestedData;
  const wrapper = mount(
    <TableTree>
      <Rows
        rootItems={getNestedItems()}
        render={({ title, page, children }) => (
          <Row itemId={title} hasChildren={!!children} childItems={children}>
            <Cell className={'title'}>{title}</Cell>
            <Cell className={'page'}>{page}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );
  const tree = createTreeHarness(wrapper);

  await settleImmediatePromises();
  wrapper.update();

  expect(tree.expandChevron(0)).toHaveLength(0);
  expect(tree.expandChevron(1)).toHaveLength(1);
});

test('expanding and collapsing', async () => {
  const c = (title, children) => ({ title, children });
  const nestedData = [
    c('Chapter 1'),
    c('Chapter 2', [c('Chapter 2.1', [c('Chapter 2.1.1')])]),
    c('Chapter 3'),
  ];

  const getNestedItems = parent => (parent ? parent.children : nestedData);

  const wrapper = mount(
    <TableTree>
      <Rows
        rootItems={getNestedItems()}
        render={({ title, children }) => (
          <Row
            itemId={title}
            childItems={children}
            hasChildren={children && children.length}
          >
            <Cell>{title}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );

  const tree = createTreeHarness(wrapper);

  await settleImmediatePromises();
  wrapper.update();

  expect(tree.textOfCellsInColumn(0)).toEqual([
    'Chapter 1',
    'Chapter 2',
    'Chapter 3',
  ]);

  tree.expandChevron(1).simulate('click');

  await settleImmediatePromises();
  wrapper.update();

  expect(tree.textOfCellsInColumn(0)).toEqual([
    'Chapter 1',
    'Chapter 2',
    'Chapter 2.1',
    'Chapter 3',
  ]);

  tree.expandChevron(2).simulate('click');

  await settleImmediatePromises();
  wrapper.update();

  expect(tree.textOfCellsInColumn(0)).toEqual([
    'Chapter 1',
    'Chapter 2',
    'Chapter 2.1',
    'Chapter 2.1.1',
    'Chapter 3',
  ]);

  tree.collapseChevron(1).simulate('click');

  await settleImmediatePromises();
  wrapper.update();

  expect(tree.textOfCellsInColumn(0)).toEqual([
    'Chapter 1',
    'Chapter 2',
    'Chapter 3',
  ]);
});

test('headers and column widths', async () => {
  const nestedData = [
    {
      title: 'Chapter One',
      page: 10,
    },
    {
      title: 'Chapter Two',
      page: 20,
      children: [
        {
          title: 'Chapter Two Subchapter One',
          page: 21,
        },
      ],
    },
  ];
  const getNestedItems = parent => (parent ? parent.children : nestedData);

  const wrapper = mount(
    <TableTree>
      <Headers>
        <Header width={300}>Chapter title</Header>
        <Header width={100}>Page #</Header>
      </Headers>
      <Rows
        rootItems={getNestedItems()}
        render={({ title, page, children }) => (
          <Row itemId={title} childItems={children} hasChildren={!!children}>
            <Cell className={'title'}>{title}</Cell>
            <Cell className={'page'}>{page}</Cell>
          </Row>
        )}
      />
    </TableTree>,
  );
  const tree = createTreeHarness(wrapper);

  await settleImmediatePromises();
  wrapper.update();

  tree.expandChevron(1).simulate('click');
  await settleImmediatePromises();
  wrapper.update();

  const titleHeader = tree.header(0);
  expect(titleHeader.text()).toEqual('Chapter title');
  expect(titleHeader.find(StyledHeader).props()).toHaveProperty('width', 300);

  const pageHeader = tree.header(1);
  expect(pageHeader.text()).toEqual('Page #');
  expect(pageHeader.find(StyledHeader).props()).toHaveProperty('width', 100);

  expect(
    tree
      .cell(0, 0)
      .find(StyledCell)
      .props(),
  ).toHaveProperty('width', 300);
  expect(
    tree
      .cell(0, 1)
      .find(StyledCell)
      .props(),
  ).toHaveProperty('width', 100);
  expect(
    tree
      .cell(1, 0)
      .find(StyledCell)
      .props(),
  ).toHaveProperty('width', 300);
  expect(
    tree
      .cell(1, 1)
      .find(StyledCell)
      .props(),
  ).toHaveProperty('width', 100);
  expect(
    tree
      .cell(2, 0)
      .find(StyledCell)
      .props(),
  ).toHaveProperty('width', 300);
  expect(
    tree
      .cell(2, 1)
      .find(StyledCell)
      .props(),
  ).toHaveProperty('width', 100);
});

function createTreeHarness(treeWrapper) {
  const header = columnIndex =>
    treeWrapper.find('Headers Header').at(columnIndex);

  const rows = () => treeWrapper.find('Row');

  const row = index => rows().at(index);

  const cell = (rowIndex, cellIndex) =>
    row(rowIndex)
      .find('Cell')
      .at(cellIndex);

  const textOfCellsInColumn = (columnIndex = 0) =>
    treeWrapper.find('Row').map(rowWrapper =>
      rowWrapper
        .find('Cell')
        .at(columnIndex)
        .text(),
    );

  const textOfCellsInRow = rowIndex =>
    row(rowIndex)
      .find('Cell')
      .map(c => c.text());

  const expandChevron = rowIndex => row(rowIndex).find('ChevronRightIcon');

  const collapseChevron = rowIndex => row(rowIndex).find('ChevronDownIcon');

  return {
    header,
    rows,
    row,
    cell,
    textOfCellsInColumn,
    textOfCellsInRow,
    expandChevron,
    collapseChevron,
  };
}
