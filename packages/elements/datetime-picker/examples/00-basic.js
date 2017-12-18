// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Date picker" />
      <DatePicker autoFocus />
      <Label label="Time picker" />
      <TimePicker />
      <Label label="Date / time picker" />
      <DateTimePicker />
    </div>
  );
};
