// @flow

import { format } from 'date-fns';
import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker } from '../src';

function now(day) {
  const date = new Date();
  date.setDate(day);
  return format(date, 'YYYY-MM-DD');
}

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <DatePicker />

      <Label label="Disabled input" />
      <DatePicker isDisabled />

      <Label label="Disabled dates" />
      <DatePicker disabled={[now(10), now(11), now(12)]} />

      <Label label="Always open" />
      <DatePicker isOpen />
    </div>
  );
};
