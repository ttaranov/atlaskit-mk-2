import React from 'react';
import { withTheme, ThemeProvider } from 'styled-components';
import ToggleStateless from './ToggleBase';

const ToggleWithTheme = withTheme(ToggleStateless);

const emptyTheme = {};

export default function (props) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <ToggleWithTheme {...props} />
    </ThemeProvider>
  );
}
