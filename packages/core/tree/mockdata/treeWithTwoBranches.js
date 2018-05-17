//@flow

import type { TreeData } from '../src/types';

export const treeWithTwoBranches: TreeData = {
  id: '1',
  children: [
    {
      id: '1-1',
      children: [
        {
          id: '1-1-1',
          children: [],
          hasChildren: false,
          isExpanded: false,
          isLoading: false,
          data: {
            title: 'Child one',
          },
        },
        {
          id: '1-1-2',
          children: [],
          hasChildren: false,
          isExpanded: false,
          isLoading: false,
          data: {
            title: 'Child two',
          },
        },
      ],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: {
        title: 'First parent',
      },
    },
    {
      id: '1-2',
      children: [
        {
          id: '1-2-1',
          children: [],
          hasChildren: false,
          isExpanded: false,
          isLoading: false,
          data: {
            title: 'Child three',
          },
        },
        {
          id: '1-2-2',
          children: [],
          hasChildren: false,
          isExpanded: false,
          isLoading: false,
          data: {
            title: 'Child four',
          },
        },
      ],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: {
        title: 'Second parent',
      },
    },
  ],
  hasChildren: true,
  isExpanded: true,
  isLoading: false,
  data: {
    title: 'root',
  },
};
