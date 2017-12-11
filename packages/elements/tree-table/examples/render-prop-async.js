// @flow
import React from 'react';
import TreeTable, {
  TreeHeads,
  TreeHead,
  TreeRows,
  RowData,
  TreeCell,
} from '../src/index';
import staticData from './data-freeform-nodes.json';

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
    <TreeHeads>
      <TreeHead width={200}>Title</TreeHead>
      <TreeHead width={100}>Numbering</TreeHead>
    </TreeHeads>
    <TreeRows
      data={getChildrenData}
      render={({ id, title, numbering, children }) => (
        <RowData key={id} hasChildren={children.length > 0}>
          <TreeCell>{title}</TreeCell>
          <TreeCell>{numbering}</TreeCell>
        </RowData>
      )}
    />
  </TreeTable>
);
