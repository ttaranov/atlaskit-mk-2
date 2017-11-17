// @flow
import React from 'react';

import { TreeTable } from '../src';

const staticData = [
  {
    title: 'Root 1',
    description: 'First top-level entry',
    children: [],
  },
  {
    title: 'Root 2',
    description: 'Second top-level entry',
  },
];

function treeCellFromProp(propName) {
  return function TreeCell(props) {
    return <span>{props[propName]}</span>;
  };
}

const Title = treeCellFromProp('title');
const Description = treeCellFromProp('description');

function getChildrenData(parent) {
  const isRoot = !parent;
  return isRoot ? staticData : [];
}

export default () => (
  <TreeTable
    columns={[Title, Description]}
    headers={['Title', 'Description']}
    data={getChildrenData}
  />
);
