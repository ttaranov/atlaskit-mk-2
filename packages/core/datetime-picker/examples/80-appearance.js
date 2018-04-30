// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="TimePicker - default appearance" />
      <TimePicker onChange={console.log} />
      <Label label="TimePicker - subtle appearance" />
      <TimePicker onChange={console.log} appearance="subtle" />

      <Label label="DatePicker - default appearance" />
      <DatePicker onChange={console.log} />
      <Label label="DatePicker - subtle appearance" />
      <DatePicker onChange={console.log} appearance="subtle" />

      <Label label="DateTimePicker - default appearance" />
      <DateTimePicker onChange={console.log} />
      <Label label="DateTimePicker - subtle appearance" />
      <DateTimePicker onChange={console.log} appearance="subtle" />
    </div>
  );
};
