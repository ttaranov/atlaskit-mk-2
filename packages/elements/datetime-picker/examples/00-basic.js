// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Date picker (controlled)" />
      <DatePicker value="2018-01-02" />

      <Label label="Date picker (uncontrolled)" />
      <DatePicker defaultValue="2018-01-02" />

      <Label label="Time picker" />
      <TimePicker />

      <Label label="Date / time picker" />
      <DateTimePicker />
    </div>
  );
};
