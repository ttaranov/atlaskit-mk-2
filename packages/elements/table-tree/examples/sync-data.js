// @flow
import React from 'react';
import TableTree, { Headers, Header, Rows, Row, Cell } from '../src';
import staticData from './data-cleancode-toc.json';

function getItemsData(parent = staticData) {
  return parent.children;
}

export default () => (
  <TableTree>
    <Headers>
      <Header width={300}>Chapter title</Header>
      <Header width={100}>Numbering</Header>
      <Header width={100}>Page</Header>
    </Headers>
    <Rows
      items={getItemsData}
      render={({ title, numbering, page, children }) => (
        <Row key={numbering} hasChildren={children.length > 0}>
          <Cell singleLine>{title}</Cell>
          <Cell singleLine>{numbering}</Cell>
          <Cell singleLine>{page}</Cell>
        </Row>
      )}
    />
  </TableTree>
);
