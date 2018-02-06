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

      <Label label="Time picker (controlled)" />
      <TimePicker value="14:30" />

      <Label label="Time picker (uncontrolled)" />
      <TimePicker defaultValue="14:30" />

      <Label label="Date / time picker (controlled)" />
      <DateTimePicker value="2018-01-02T14:30" />

      <Label label="Date / time picker (uncontrolled)" />
      <DateTimePicker defaultValue="2018-01-02T14:30" />
    </div>
  );
};
