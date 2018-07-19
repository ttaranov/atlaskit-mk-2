// @flow

import React from 'react';
import { Theme } from '../src';
import type { ThemeDefinition } from '../src/types';

const CustomTheme = ({
  children,
  values,
}: ThemeDefinition<{
  backgroundColor?: string,
  color?: string,
  padding?: number,
}>) => (
  <Theme
    values={{ backgroundColor: '#333', color: '#eee', padding: 10, ...values }}
  >
    {children}
  </Theme>
);

export default () => (
  <CustomTheme values={{ backgroundColor: 'rebeccapurple' }}>
    {theme => <div style={theme}>I am themed.</div>}
  </CustomTheme>
);
