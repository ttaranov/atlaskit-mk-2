// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';
import { action } from './_';

export default () => {
  return (
    <div>
      <Label>DatePicker</Label>
      <DatePicker onChange={action('onChange')} />
      <Label>TimePicker</Label>
      <TimePicker onChange={action('onChange')} />
      <Label>DateTimePicker</Label>
      <DateTimePicker onChange={action('onChange')} />
    </div>
  );
};
