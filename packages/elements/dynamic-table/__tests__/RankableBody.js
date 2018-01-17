// @flow
import React from 'react';
import { mount } from 'enzyme';
import Body from '../src/components/Body';
import RankableBody from '../src/components/rankable/Body';

import { name } from '../package.json';

const head = {
  cells: [
    {
      key: 'first_name',
      content: 'First name',
      isSortable: true,
    },
    {
      key: 'last_name',
      content: 'Last name',
    },
  ],
};

const rows = [
  {
    key: '0',
    cells: [
      {
        key: 'baob',
        content: 'Barak',
      },
      {
        content: 'Obama',
      },
    ],
  },
  {
    key: '1',
    cells: [
      {
        key: 'dotr',
        content: 'Donald',
      },
      {
        content: 'Trump',
      },
    ],
  },
  {
    key: '2',
    cells: [
      {
        key: 'hicl',
        content: 'Hillary',
      },
      {
        content: 'Clinton',
      },
    ],
  },
];

describe(name, () => {
  describe('rankable/Body', () => {
    it('should render RankableTableBody if table is rankable', () => {
      const wrapper = mount(
        <DynamicTableStateless
          rowsPerPage={2}
          page={2}
          head={head}
          rows={rows}
          isRankable
        />,
      );
      
      const body = wrapper.find(Body);
      const rankableBody = wrapper.find(RankableBody);
      expect(body.length).toBe(0);
      expect(rankableBody.length).toBe(1);
    });
  });
});
