// @flow

import React from 'react';
import { CalendarStateless } from '../src';

const thisMonth = new Date().getMonth() + 1;
const notThisYear = new Date().getFullYear() + 1;
const notThisMonth = thisMonth === 10 ? 11 : 10;

export default () => (
  <div>
    <CalendarStateless month={notThisMonth} />
    <CalendarStateless year={notThisYear} />
  </div>
);
