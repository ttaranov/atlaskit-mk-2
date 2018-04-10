// @flow
import React from 'react';
import { AvatarGroup } from '../src';

const data = [
  {
    appearance: 'circle',
    enableTooltip: true,
    name: 'blah',
    size: 'medium',
    src: 'https://api.adorable.io/avatars/80/chak1233i@me.com.png',
    status: 'approved',
  },
  {
    appearance: 'circle',
    enableTooltip: true,
    name: 'blah',
    size: 'medium',
    src: 'https://api.adorable.io/avatars/80/chaasdf45ki@me.com.png',
    status: 'approved',
  },
  {
    appearance: 'circle',
    enableTooltip: true,
    name: 'blah',
    size: 'medium',
    src: 'https://api.adorable.io/avatars/80/chasdfaki@me.com.png',
    status: 'declined',
  },
  {
    appearance: 'circle',
    enableTooltip: true,
    name: 'blah',
    size: 'medium',
    src: 'https://api.adorable.io/avatars/80/c13243214has213dfaki@me.com.png',
    status: 'locked',
  },
];

export default () => (
  <div>
    <AvatarGroup
      appearance="grid"
      onAvatarClick={console.log}
      data={data}
      maxCount={2}
      size="large"
    />
  </div>
);
