// @flow

import React from 'react';
import { Reset, Provider } from '../src';

export default () => (
  <Provider backgroundColor="#333" textColor="#eee">
    <Reset style={{ padding: 10 }}>You can also theme a reset.</Reset>
  </Provider>
);
