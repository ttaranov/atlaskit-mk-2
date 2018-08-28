// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';
import { Group, Item } from '../../../src';

export default () => (
  <div
    css={{
      backgroundColor: colors.N20,
      boxSizing: 'border-box',
      padding: '8px',
      width: '270px ',
    }}
  >
    <Group heading="Group heading" hasSeparator>
      <Item text="Item" />
      <Item text="Item" />
      <Item text="Item" />
    </Group>
  </div>
);
