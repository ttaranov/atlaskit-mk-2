// @flow
import React from 'react';

import TreeTable from '../src';
import staticData from './data-structured-nodes.json';

function dataCellFromProp(propName) {
  return function DataCell(props) {
    return <span>{props[propName]}</span>;
  };
}

const Title = dataCellFromProp('title');
const Numbering = dataCellFromProp('numbering');

function getChildrenData(parent = staticData) {
  return parent.children || [];
}

export default () => (
  <TreeTable columns={[Title, Numbering]} data={getChildrenData} />
);
