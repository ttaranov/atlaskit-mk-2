// @flow

import React from 'react';
import color from 'color';
import { Theme } from '../src';

export default () => (
  <Theme values={() => ({ backgroundColor: '#333', textColor: '#eee' })}>
    {theme =>
      Object.keys(theme).map(k => (
        <div
          style={{
            backgroundColor: theme[k],
            color: color(theme[k]).negate(),
            display: 'inline-block',
            marginBottom: 10,
            marginRight: 10,
            padding: 10,
          }}
        >
          {k}
        </div>
      ))
    }
  </Theme>
);
