// @flow

import React from 'react';
import { withTheme, ThemeProvider } from 'styled-components';
import Navigation from './Navigation';

// $FlowFixMe
const NavigationWithTheme = withTheme(Navigation);

const emptyTheme = {};

export default function(props: {}) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <NavigationWithTheme {...props} />
    </ThemeProvider>
  );
}
