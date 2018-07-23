// @flow

import React from 'react';
import Badge from '@atlaskit/badge';
import CloseButton from '@atlaskit/icon/glyph/cross';
import { Item, ItemAvatar } from '../../../src';

export default () => (
  <div css={{ width: 270 }}>
    <Item
      after={({ isActive, isHover }) =>
        isActive || isHover ? (
          <CloseButton size="small" />
        ) : (
          <Badge appearance="primary" value={3} />
        )
      }
      before={s => <ItemAvatar itemState={s} presence="online" size="small" />}
      text="Item title"
      subText="Some kind of description"
    />
  </div>
);
