// @flow
import React from 'react';
import { Presence } from '../src';
import { Block, Dot } from './helpers';

export default () => (
  <Block>
    <Dot>
      <Presence presence="online" />
    </Dot>
    <Dot>
      <Presence presence="busy" />
    </Dot>
    <Dot>
      <Presence presence="offline" />
    </Dot>
  </Block>
);
