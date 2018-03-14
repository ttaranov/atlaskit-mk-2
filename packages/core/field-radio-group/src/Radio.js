// @flow
import React from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import Radio from './RadioBase';

// $FlowFixMe
const RadioWithTheme = withTheme(Radio);

const emptyTheme = {};
// $FlowFixMe
export default function(props) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <RadioWithTheme {...props} />
    </ThemeProvider>
  );
}
