// @flow

import React from 'react';
import Calendar from '../src';

const log = msg => e => console.log(msg, e);

export default () => (
  <Calendar
    defaultDisabled={['2020-12-04']}
    defaultPreviouslySelected={['2020-12-06']}
    defaultSelected={['2020-12-08']}
    defaultMonth={12}
    defaultYear={2020}
    onBlur={log('blur')}
    onChange={log('change')}
    onFocus={log('focus')}
    onSelect={log('select')}
  />
);
