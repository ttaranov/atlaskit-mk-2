// @flow

import React from 'react';
import { Theme } from '../src';

const myTheme = () => ({
  backgroundColor: '#333',
  color: '#eee',
  padding: 10,
});

export default () => (
  <Theme values={myTheme}>
    {theme => <div style={theme}>I am themed.</div>}
  </Theme>
);
