// @flow

import React from 'react';
import color from 'color';
import { Consumer, Theme } from '../src';

const DisplayThemeColors = () => (
  <Consumer>
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
  </Consumer>
);

export default () => (
  <Theme backgroundColor="#333" textColor="#eee">
    <DisplayThemeColors />
    <Theme backgroundColor="palevioletred">
      <DisplayThemeColors />
    </Theme>
  </Theme>
);
