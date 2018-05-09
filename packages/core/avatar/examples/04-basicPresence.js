// @flow
import React from 'react';
import { Presence } from '../src';
import { Block, Dot } from '../examples-util/helpers';

const presenceArray = ['online', 'busy', 'focus', 'offline'];

export default () => (
  <Block>
    {presenceArray.map(presence => {
      return (
        <Dot>
          <Presence presence={presence} />
        </Dot>
      );
    })}
  </Block>
);
