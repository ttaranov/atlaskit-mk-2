// @flow
import React from 'react';
import TreeTable, { Headers, Header, Rows, Row, Cell } from '../src';
import { type RowData as RowDataType } from '../src/types';
import staticData from './data-freeform-nodes.json';

function getChildrenData(
  parent: ?{ children: Array<RowDataType> } = staticData,
) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve((parent && parent.children) || []);
    }, 3000);
  });
}

export default () => (
  <TreeTable>
    <Headers>
      <Header width={200}>Title</Header>
      <Header width={100}>Numbering</Header>
    </Headers>
    <Rows
      items={getChildrenData}
      render={({ id, title, numbering, children }) => (
        <Row key={id} hasChildren={children.length > 0}>
          <Cell>{title}</Cell>
          <Cell>{numbering}</Cell>
        </Row>
      )}
    />
  </TreeTable>
);
