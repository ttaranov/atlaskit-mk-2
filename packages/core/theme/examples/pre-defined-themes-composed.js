// @flow

import React from 'react';
import { Theme } from '../src';

const themeDefault = theme => ({
  backgroundColor: 'rebeccapurple',
  color: '#eee',
  ...theme,
});
const themeCustom = theme => ({ ...theme, padding: 10 });

export default () => (
  <Theme theme={themeDefault}>
    <Theme theme={themeCustom}>
      {theme => <div style={theme}>I am themed.</div>}
    </Theme>
  </Theme>
);
