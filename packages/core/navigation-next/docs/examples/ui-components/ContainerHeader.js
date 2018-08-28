// @flow

import React from 'react';
import { ContainerHeader, ItemAvatar } from '../../../src';

export default () => (
  <div style={{ width: 270 }}>
    <ContainerHeader
      before={s => <ItemAvatar appearance="square" itemState={s} />}
      subText="Container description"
      text="Container name"
    />
  </div>
);
