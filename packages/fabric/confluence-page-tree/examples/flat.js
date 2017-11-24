// @flow
import React from 'react';

import { TreeTable } from '../src';

const staticData = {
  children: [
    {
      id: 'root1',
      content: {
        title: 'Root 1',
        description: 'First top-level entry',
      },
      hasChildren: false,
      children: [],
    },
    {
      id: 'root2',
      content: {
        title: 'Root 2',
        description: 'Second top-level entry',
      },
      hasChildren: false,
      children: [],
    },
  ],
};

function treeCellFromProp(propName) {
  return function TreeCell(props) {
    return <span>{props[propName]}</span>;
  };
}

const Title = treeCellFromProp('title');
const Description = treeCellFromProp('description');

function getChildrenData(parent = staticData) {
  return parent.children || [];
}

export default () => (
  <TreeTable
    columns={[Title, Description]}
    headers={['Title', 'Description']}
    columnWidths={['100px', '300px']}
    data={getChildrenData}
  />
);
