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
  <Theme values={themeDefault}>
    <Theme values={themeCustom}>
      {theme => <div style={theme}>I am themed.</div>}
    </Theme>
  </Theme>
);
