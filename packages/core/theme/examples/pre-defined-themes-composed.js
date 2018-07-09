// @flow

import React from 'react';
import { Consumer, Theme } from '../src';

const ColorTheme = props => (
  <Theme backgroundColor="#333" color="#eee" {...props} />
);

const CustomTheme = props => <ColorTheme padding={10} {...props} />;

export default () => (
  <CustomTheme backgroundColor="palevioletred">
    <Consumer>{theme => <div style={theme}>I am themed.</div>}</Consumer>
  </CustomTheme>
);
