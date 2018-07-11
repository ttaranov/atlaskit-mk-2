// @flow

import React, { type Node } from 'react';
import { Theme } from '../src';

type ColorThemeProps = {
  children: Node,
  values: {
    backgroundColor: string,
    color: string,
  },
};

type CustomThemeProps = {
  children: Node,
  values: {
    padding: number,
  },
};

const ColorTheme = ({ children, values }: ColorThemeProps) => (
  <Theme values={{ backgroundColor: '#333', color: '#eee', ...values }}>
    {children}
  </Theme>
);

const CustomTheme = ({ children, values }: CustomThemeProps) => (
  <ColorTheme values={{ padding: 10, ...values }}>{children}</ColorTheme>
);

export default () => (
  <CustomTheme values={{ backgroundColor: 'rebeccapurple' }}>
    {theme => <div style={theme}>I am themed.</div>}
  </CustomTheme>
);
