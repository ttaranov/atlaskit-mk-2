// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { getDates } from './_';

module.exports = () => (
  <div>
    <CalendarStateless selected={getDates()} />
    <CalendarStateless previouslySelected={getDates()} />
  </div>
);
