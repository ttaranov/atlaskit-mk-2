// @flow
import React from 'react';
import {
  TreeTable,
  TreeHeads,
  TreeHead,
  TreeRows,
  RowData,
  TreeCell,
} from '../src/index';
import staticData from './nested-data.json';

function getChildrenData(parent = staticData) {
  return parent.children || [];
}

export default () => (
  <TreeTable>
    <TreeHeads>
      <TreeHead width={200}>Title</TreeHead>
      <TreeHead width={100}>Numbering</TreeHead>
    </TreeHeads>
    <TreeRows
      data={getChildrenData}
      render={({ id, title, numbering, hasChildren }) => (
        <RowData key={id} hasChildren={hasChildren}>
          <TreeCell width={200}>{title}</TreeCell>
          <TreeCell width={100}>{numbering}</TreeCell>
        </RowData>
      )}
    />
  </TreeTable>
);
