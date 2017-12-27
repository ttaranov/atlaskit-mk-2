// @flow
import React from 'react';
import TreeTable, { Rows, Row, Cell } from '../src';
import staticData from './data-cleancode-toc.json';

function fetchRoots() {
  return Promise.resolve(staticData.children);
}

function fetchChildrenOf(node) {
  return Promise.resolve(node.children);
}

function getChildrenData(parent) {
  return parent ? fetchChildrenOf(parent) : fetchRoots();
}

export default () => (
  <TreeTable>
    <Rows
      items={getChildrenData}
      render={({ title, numbering, page, children }) => (
        <Row key={numbering} hasChildren={children.length > 0}>
          <Cell width={300}>{title}</Cell>
          <Cell width={50}>{page}</Cell>
        </Row>
      )}
    />
  </TreeTable>
);
