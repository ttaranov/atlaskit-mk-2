// @flow
import React from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import Radio from './RadioBase';
import { type RadioBasePropTypes } from './types';

const RadioWithTheme = withTheme(Radio);
const emptyTheme = {};

export default (props: RadioBasePropTypes) => {
  return (
    <ThemeProvider theme={emptyTheme}>
      <RadioWithTheme {...props} />
    </ThemeProvider>
  );
};
