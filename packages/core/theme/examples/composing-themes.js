// @flow

import React from 'react';
import color from 'color';
import { Theme } from '../src';

const DisplayThemeColors = () => (
  <Theme>
    {theme =>
      Object.keys(theme).map(k => (
        <div
          key={k}
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

export default () => (
  <Theme theme={() => ({ backgroundColor: '#333', textColor: '#eee' })}>
    <DisplayThemeColors />
    <Theme theme={t => ({ ...t, backgroundColor: 'palevioletred' })}>
      <DisplayThemeColors />
    </Theme>
  </Theme>
);
