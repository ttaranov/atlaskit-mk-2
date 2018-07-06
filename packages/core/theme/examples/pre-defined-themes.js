// @flow

import React from 'react';
import { Consumer, Provider } from '../src';

const CustomTheme = props => (
  <Provider backgroundColor="#333" color="#eee" padding={10} {...props} />
);

export default () => (
  <CustomTheme backgroundColor="palevioletred">
    <Consumer>{theme => <div style={theme}>I am themed.</div>}</Consumer>
  </CustomTheme>
);
