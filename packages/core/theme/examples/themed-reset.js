// @flow

import React from 'react';
import { Reset, Theme } from '../src';

export default () => (
  <Theme values={() => ({ backgroundColor: '#333', textColor: '#eee' })}>
    <Reset style={{ padding: 10 }}>You can also theme a reset.</Reset>
  </Theme>
);
