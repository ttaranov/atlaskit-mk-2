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
      <TreeHead>Title</TreeHead>
      <TreeHead>Numbering</TreeHead>
    </TreeHeads>
    <TreeRows
      data={getChildrenData}
      render={({ id, title, numbering, hasChildren }) => (
        <TreeRow id={id} hasChildren={hasChildren}>
          <TreeCell>{title}</TreeCell>
          <TreeCell>{numbering}</TreeCell>
        </TreeRow>
      )}
    />
  </TreeTable>
);
