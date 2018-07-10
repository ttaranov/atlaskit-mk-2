// @flow

import React from 'react';
import { Consumer, Theme } from '../src';

const CustomTheme = props => (
  <Theme backgroundColor="#333" color="#fff" padding={10} {...props} />
);

export default () => (
  <CustomTheme backgroundColor="rebeccapurple">
    <Consumer>{theme => <div style={theme}>I am themed.</div>}</Consumer>
  </CustomTheme>
);
