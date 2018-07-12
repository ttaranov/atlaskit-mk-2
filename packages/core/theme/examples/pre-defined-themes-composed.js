// @flow

import React from 'react';
import { Theme, type ThemeDefinition } from '../src';

type ColorThemeValues = {
  backgroundColor?: string,
  color?: string,
};

type CustomThemeValues = ColorThemeValues & { padding?: number };

const ColorTheme = ({
  children,
  values,
}: ThemeDefinition<ColorThemeValues>) => (
  <Theme values={{ color: '#eee', ...values }}>{children}</Theme>
);

const CustomTheme = ({
  children,
  values,
}: ThemeDefinition<CustomThemeValues>) => (
  <ColorTheme values={{ padding: 10, ...values }}>{children}</ColorTheme>
);

export default () => (
  <CustomTheme values={{ backgroundColor: 'rebeccapurple' }}>
    {theme => <div style={theme}>I am themed.</div>}
  </CustomTheme>
);
