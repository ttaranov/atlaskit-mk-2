// @flow

import React from 'react';
import { CalendarStateless } from '../src';

export default () => (
  <CalendarStateless onChange={e => console.log('change', e)} />
);
