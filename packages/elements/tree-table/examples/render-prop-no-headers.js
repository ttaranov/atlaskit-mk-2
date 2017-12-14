// @flow
import React from 'react';
import TreeTable, { TreeRows, RowData, DataCell } from '../src';
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
    <TreeRows
      data={getChildrenData}
      render={({ title, numbering, page, children }) => (
        <RowData key={numbering} hasChildren={children.length > 0}>
          <DataCell width={300}>{title}</DataCell>
          <DataCell width={50}>{page}</DataCell>
        </RowData>
      )}
    />
  </TreeTable>
);
