// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="TimePicker - no icon by default" />
      <TimePicker onChange={console.log} />
      <Label label="TimePicker - icon provided" />
      <TimePicker onChange={console.log} icon={CalendarIcon} />
      <Label label="TimePicker - icon provided & subtle appearance" />
      <TimePicker
        onChange={console.log}
        icon={CalendarIcon}
        appearance="subtle"
      />

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
