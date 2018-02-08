// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <h3>Date picker</h3>
      <Label label="default" />
      <DatePicker />
      <Label label="controlled (value)" />
      <DatePicker value="2018-01-02" />
      <Label label="uncontrolled (defaultValue)" />
      <DatePicker defaultValue="2018-01-02" />

      <h3>Time picker</h3>
      <Label label="default" />
      <TimePicker />
      <Label label="controlled (value)" />
      <TimePicker value="14:30" />
      <Label label="uncontrolled (defaultValue)" />
      <TimePicker defaultValue="14:30" />

      <h3>Date / time picker</h3>
      <Label label="default" />
      <DateTimePicker />
      <Label label="controlled (value=&quot;2018-01-02T14:30-08:00&quot;)" />
      <DateTimePicker value="2018-01-02T14:30-08:00" />
      <Label label="uncontrolled (defaultValue=&quot;2018-01-02T14:30+10:00&quot;)" />
      <DateTimePicker defaultValue="2018-01-02T14:30+10:00" />
    </div>
  );
};
