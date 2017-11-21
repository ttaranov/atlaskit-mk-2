// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';
import { action } from './_';

export default () => {
  return (
    <div>
      <Label label="Date picker" />
      <DatePicker onChange={action('onChange')} />
      <Label label="Time picker" />
      <TimePicker onChange={action('onChange')} />
      <Label label="Date / time picker" />
      <DateTimePicker onChange={action('onChange')} />
    </div>
  );
};
