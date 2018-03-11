// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { gridSize } from '@atlaskit/theme';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Date picker" />
      <DatePicker width={gridSize() * 20} />
      <Label label="Time picker" />
      <TimePicker width={gridSize() * 20} />
      <Label label="Date / time picker" />
      <DateTimePicker width={gridSize() * 30} />
    </div>
  );
};
