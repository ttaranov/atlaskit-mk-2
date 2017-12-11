// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { getDates } from './utils/_';

export default () => (
  <div>
    <CalendarStateless selected={getDates()} />
    <CalendarStateless previouslySelected={getDates()} />
  </div>
);
