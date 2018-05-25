// @flow
import React from 'react';
import { AvatarGroup } from '../src';
import { Block } from '../examples-util/helpers';
import { RANDOM_USERS, getAdorableAvatar } from '../examples-util/data';

export default () => {
  const data = RANDOM_USERS.map(d => ({
    email: d.email,
    key: d.email,
    name: d.name,
    src: getAdorableAvatar(d.email),
    href: '#',
    appearance: 'circle',
    size: 'medium',
    enableTooltip: true,
  }));

  return (
    <div style={{ maxWidth: 270 }}>
      <Block heading="Stack">
        <AvatarGroup
          appearance="stack"
          onAvatarClick={console.log}
          data={data}
          size="large"
        />
      </Block>
      <Block heading="Grid">
        <AvatarGroup
          appearance="grid"
          onAvatarClick={console.log}
          data={data}
          maxCount={14}
          size="large"
        />
      </Block>
    </div>
  );
};
