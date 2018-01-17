// @flow
import React from 'react';
import { mount } from 'enzyme';
import TableTree, { Rows, Row, Cell } from '../index';

describe('TableTree', () => {
  it('renders a flat tree', () => {
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
          items={getFlatItems}
          render={({ title, page }) => (
            <Row key={title} hasChildren={false}>
              <Cell>{title}</Cell>
              <Cell>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>,
    );

    const tree = createTreeHarness(wrapper);
    expect(tree.rows()).toHaveLength(3);

    expect(tree.textOfCellsInRow(0)).toEqual(['Chapter One', '10']);
    expect(tree.textOfCellsInRow(1)).toEqual(['Chapter Two', '20']);
    expect(tree.textOfCellsInRow(2)).toEqual(['Chapter Three', '30']);
  });

  it('displays a chevron icon only next to items that have children', () => {
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
        <Rows
          items={getNestedItems}
          render={({ title, page, children }) => (
            <Row key={title} hasChildren={!!children}>
              <Cell className={'title'}>{title}</Cell>
              <Cell className={'page'}>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>,
    );
    const tree = createTreeHarness(wrapper);

    expect(tree.expandChevron(0)).toHaveLength(0);
    expect(tree.expandChevron(1)).toHaveLength(1);
  });

  it('expands and collapses nested tree items', () => {
    const c = (title, page, children) => ({ title, page, children });
    const nestedData = [
      c('Chapter 0', 10),
      c('Chapter 1', 20, [c('Chapter 1.1', 21, [c('Chapter 1.1.1', 22)])]),
      c('Chapter 2', 30),
    ];

    const getNestedItems = parent => (parent ? parent.children : nestedData);

    const wrapper = mount(
      <TableTree>
        <Rows
          items={getNestedItems}
          render={({ title, page, children }) => (
            <Row key={title} hasChildren={children && children.length}>
              <Cell>{title}</Cell>
              <Cell>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>,
    );

    const tree = createTreeHarness(wrapper);

    expect(tree.textOfCellsInColumn(0)).toEqual([
      'Chapter 0',
      'Chapter 1',
      'Chapter 2',
    ]);

    tree.expandChevron(1).simulate('click');

    expect(tree.textOfCellsInColumn(0)).toEqual([
      'Chapter 0',
      'Chapter 1',
      'Chapter 1.1',
      'Chapter 2',
    ]);

    tree.expandChevron(2).simulate('click');

    expect(tree.textOfCellsInColumn(0)).toEqual([
      'Chapter 0',
      'Chapter 1',
      'Chapter 1.1',
      'Chapter 1.1.1',
      'Chapter 2',
    ]);

    tree.collapseChevron(1).simulate('click');

    expect(tree.textOfCellsInColumn(0)).toEqual([
      'Chapter 0',
      'Chapter 1',
      'Chapter 2',
    ]);
  });

  function createTreeHarness(treeWrapper) {
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

    const expandChevron = rowIndex =>
      row(rowIndex).find('.title ChevronRightIcon');

    const collapseChevron = rowIndex =>
      row(rowIndex).find('.title ChevronDownIcon');

    return {
      textOfCellsInColumn,
      textOfCellsInRow,
      rows,
      row,
      cell,
      expandChevron,
      collapseChevron,
    };
  }
});
