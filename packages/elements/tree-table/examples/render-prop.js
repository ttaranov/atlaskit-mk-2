// @flow
import React from 'react';
import {
  TreeTable,
  TreeHeads,
  TreeHead,
  TreeRows,
  TreeRow,
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
        <TreeRow key={id} hasChildren={hasChildren}>
          <TreeCell width={200}>{title}</TreeCell>
          <TreeCell width={100}>{numbering}</TreeCell>
        </TreeRow>
      )}
    />
  </TreeTable>
);
