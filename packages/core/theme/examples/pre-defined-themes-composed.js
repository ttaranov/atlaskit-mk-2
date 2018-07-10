// @flow

import React from 'react';
import { Theme } from '../src';

const ColorTheme = props => (
  <Theme backgroundColor="#333" color="#fff" {...props} />
);

const CustomTheme = props => <ColorTheme padding={10} {...props} />;

export default () => (
  <CustomTheme backgroundColor="rebeccapurple">
    {theme => <div style={theme}>I am themed.</div>}
  </CustomTheme>
);
