// @flow
import React from 'react';
import TreeTable, {
  HeadersRow,
  Header,
  TreeRows,
  RowData,
  DataCell,
} from '../src';
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
    <HeadersRow>
      <Header width={200}>Chapter title</Header>
      <Header width={100}>Numbering</Header>
      <Header width={100}>Page</Header>
    </HeadersRow>
    <TreeRows
      data={getChildrenData}
      render={({ title, numbering, page, children }) => (
        <RowData key={numbering} hasChildren={children.length > 0}>
          <DataCell>{title}</DataCell>
          <DataCell>{numbering}</DataCell>
          <DataCell>{page}</DataCell>
        </RowData>
      )}
    />
  </TreeTable>
);
