//@flow

import type { TreeData } from '../src/types';

export const treeWithThreeLeaves: TreeData = {
  id: '1',
  children: [
    {
      id: '1-1',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: { title: 'one' },
    },
    {
      id: '1-2',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: { title: 'two' },
    },
    {
      id: '1-3',
      children: [],
      hasChildren: false,
      isExpanded: false,
      isLoading: false,
      data: { title: 'three' },
    },
  ],
  hasChildren: true,
  isExpanded: true,
  isLoading: false,
  data: {},
};
