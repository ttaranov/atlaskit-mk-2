// @flow

import React from 'react';
import { CalendarStateless } from '../src';

const today = new Date().getDate();
const notToday = today === 10 ? 11 : 10;

export default () => (
  <div>
    <h2>Today</h2>
    <CalendarStateless focused={today} />
    <h2>Not today</h2>
    <CalendarStateless focused={notToday} />
  </div>
);
