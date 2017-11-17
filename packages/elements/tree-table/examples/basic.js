// @flow
import React from 'react';

import { TreeTable } from '../src';

const staticData = {
  children: [
    {
      title: '1',
      description: 'First top-level entry',
      children: [
        {
          title: '1.1',
          description: 'First child',
        },
        {
          title: '1.2',
          description: 'Second child',
          children: [
            {
              title: '1.2.1',
              description: 'First grandchild',
            },
          ],
        },
      ],
    },
    {
      title: 'Root 2',
      description: 'Second top-level entry',
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
  return parent.children;
}

export default () => (
  <TreeTable
    columns={[Title, Description]}
    headers={['Title', 'Description']}
    data={getChildrenData}
  />
);
