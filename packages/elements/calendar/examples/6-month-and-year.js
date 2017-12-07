// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { notThisMonth, notThisYear } from './utils/_';

export default () => (
  <div>
    <CalendarStateless month={notThisMonth} />
    <CalendarStateless year={notThisYear} />
  </div>
);
