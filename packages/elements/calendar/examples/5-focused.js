// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { notToday, today } from './utils/_';

export default () => (
  <div>
    <h2>Today</h2>
    <CalendarStateless focused={today} />
    <h2>Not today</h2>
    <CalendarStateless focused={notToday} />
  </div>
);
