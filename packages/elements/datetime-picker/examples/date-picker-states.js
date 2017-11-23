// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker } from '../src';

function now(day) {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${day}`;
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
    </div>
  );
};
