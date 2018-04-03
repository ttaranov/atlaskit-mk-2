// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { gridSize } from '@atlaskit/theme';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Date picker" />
      <DatePicker innerProps={{ style: { width: gridSize() * 20 } }} />
      <Label label="Time picker" />
      <TimePicker innerProps={{ style: { width: gridSize() * 20 } }} />
      <Label label="Date / time picker" />
      <DateTimePicker innerProps={{ style: { width: gridSize() * 40 } }} />
    </div>
  );
};
