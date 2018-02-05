// @flow

import React from 'react';
import { CalendarStateless } from '../src';

export default () => (
  <CalendarStateless onSelect={e => console.log('select', e)} />
);
