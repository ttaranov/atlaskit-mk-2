// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <h3>Date picker</h3>
      <Label htmlFor="react-select-datepicker-1--input" label="default" />
      <DatePicker id="datepicker-1" />
      <Label
        htmlFor="react-select-datepicker-2--input"
        label="controlled (value)"
      />
      <DatePicker id="datepicker-2" value="2018-01-02" />
      <Label
        htmlFor="react-select-datepicker-3--input"
        label="uncontrolled (defaultValue)"
      />
      <DatePicker id="datepicker-3" defaultValue="2018-01-02" />

      <h3>Time picker</h3>
      <Label htmlFor="react-select-timepicker-1--input" label="default" />
      <TimePicker id="timepicker-1" />
      <Label
        htmlFor="react-select-timepicker-2--input"
        label="controlled (value)"
      />
      <TimePicker id="timepicker-2" value="14:30" />
      <Label
        htmlFor="react-select-timepicker-3--input"
        label="uncontrolled (defaultValue)"
      />
      <TimePicker id="timepicker-3" defaultValue="14:30" />

      <h3>Date / time picker</h3>
      <Label htmlFor="react-select-datetimepicker-1--input" label="default" />
      <DateTimePicker id="datetimepicker-1" />
      <Label
        htmlFor="react-select-datetimepicker-2--input"
        label="controlled (UTC-08:00)"
      />
      <DateTimePicker id="datetimepicker-2" value="2018-01-02T14:30-08:00" />
      <Label
        htmlFor="react-select-datetimepicker-3--input"
        label="uncontrolled (UTC+10:00)"
      />
      <DateTimePicker
        id="datetimepicker-3"
        defaultValue="2018-01-02T14:30+10:00"
      />
    </div>
  );
};
