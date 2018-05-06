// @flow
import React, { Component } from 'react';
import TableTree, { Headers, Header, Rows, Row, Cell } from '../src';
import Data from './data-cleancode-toc.json';

const StaticData = ({ tableData }) => (
  <TableTree>
    <Headers>
      <Header width={300}>Chapter title</Header>
      <Header width={100}>Numbering</Header>
      <Header width={100}>Page</Header>
    </Headers>
    <Rows
      rootItems={tableData}
      render={({ title, numbering, page, hasChildren, children }) => (
        <Row
          expandLabel={'Expand'}
          collapseLabel={'Collapse'}
          itemId={numbering}
          childItems={children}
          hasChildren={children && !!children.length}
        >
          <Cell singleLine>{title}</Cell>
          <Cell singleLine>{numbering}</Cell>
          <Cell singleLine>{page}</Cell>
        </Row>
      )}
    />
  </TableTree>
);

export default () => <StaticData tableData={Data.children} />;
