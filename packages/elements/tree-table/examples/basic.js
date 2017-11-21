// @flow
import React from 'react';

import { TreeTable } from '../src';

const staticData = {
  children: [
    {
      id: '1',
      content: {
        title: '1',
        description: 'First top-level entry',
      },
      hasChildren: true,
      children: [
        {
          id: '1.1.',
          content: {
            title: '1.1',
            description: 'First child',
          },
          hasChildren: false,
        },
        {
          id: '1.2',
          content: {
            title: '1.2',
            description: 'Second child',
          },
          hasChildren: true,
          children: [
            {
              id: '1.2.1',
              content: {
                title: '1.2.1',
                description: 'First grandchild',
              },
            },
          ],
        },
      ],
    },
    {
      id: '2',
      content: {
        title: '2',
        description: 'Second top-level entry',
      },
      hasChildren: false,
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
    data={getChildrenData}
  />
);
