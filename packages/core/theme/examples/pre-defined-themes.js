// @flow

import React, { type Node } from 'react';
import { Theme } from '../src';

type CustomThemeProps = {
  children: Node,
  values: {
    backgroundColor: string,
    color: string,
    padding: number,
  },
};

const CustomTheme = ({ children, values }: CustomThemeProps) => (
  <Theme
    values={{ backgroundColor: '#333', color: '#eee', padding: 10, ...values }}
  >
    {children}
  </Theme>
);

export default () => (
  <CustomTheme backgroundColor="rebeccapurple">
    {theme => <div style={theme}>I am themed.</div>}
  </CustomTheme>
);
