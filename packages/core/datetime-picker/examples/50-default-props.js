// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { TimePicker, DatePicker, DateTimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="DatePicker defaultValue defaultIsOpen" />
      <DatePicker defaultValue="2018-03-01" defaultIsOpen />

      <Label label="TimePicker defaultValue defaultIsOpen" />
      <TimePicker defaultValue="10:00am" defaultIsOpen />

      <Label label="DateTimePicker defaultValue" />
      <DateTimePicker defaultValue="2018-01-02T14:30-08:00" />
    </div>
  );
};
