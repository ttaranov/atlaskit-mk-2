// @flow
import React from 'react';

import TreeTable from '../src';
import staticData from './data-structured-nodes.json';

function treeCellFromProp(propName) {
  return function TreeCell(props) {
    return <span>{props[propName]}</span>;
  };
}

const Title = treeCellFromProp('title');
const Numbering = treeCellFromProp('numbering');

function getChildrenData(parent = staticData) {
  return parent.children || [];
}

export default () => (
  <TreeTable columns={[Title, Numbering]} data={getChildrenData} />
);
