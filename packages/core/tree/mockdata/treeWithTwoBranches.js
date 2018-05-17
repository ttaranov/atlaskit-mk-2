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
          data: {},
        },
        {
          id: '1-1-2',
          children: [],
          hasChildren: false,
          isExpanded: false,
          isLoading: false,
          data: {},
        },
      ],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: {},
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
          data: {},
        },
        {
          id: '1-2-2',
          children: [],
          hasChildren: false,
          isExpanded: false,
          isLoading: false,
          data: {},
        },
      ],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: { title: 'two' },
    },
  ],
  hasChildren: true,
  isExpanded: true,
  isLoading: false,
  data: {},
};
