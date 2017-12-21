// @flow
import React from 'react';
import TreeTable, {
  HeadersRow,
  Header,
  TreeRows,
  RowData,
  DataCell,
} from '../src';
import staticData from './data-freeform-nodes.json';

function getChildrenData(parent = staticData) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(parent && parent.children);
    }, 3000);
  });
}

export default () => (
  <TreeTable>
    <HeadersRow>
      <Header width={200}>Title</Header>
      <Header width={100}>Numbering</Header>
    </HeadersRow>
    <TreeRows
      data={getChildrenData}
      render={({ id, title, numbering, children }) => (
        <RowData key={id} hasChildren={children.length > 0}>
          <DataCell>{title}</DataCell>
          <DataCell>{numbering}</DataCell>
        </RowData>
      )}
    />
  </TreeTable>
);
