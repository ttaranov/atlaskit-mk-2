// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { gridSize } from '@atlaskit/theme';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Date picker" />
      <div style={{ width: gridSize() * 20 }}>
        <DatePicker />
      </div>
      <Label label="Time picker" />
      <div style={{ width: gridSize() * 20 }}>
        <TimePicker />
      </div>
      <Label label="Date / time picker" />
      <div style={{ width: gridSize() * 40 }}>
        <DateTimePicker />
      </div>
    </div>
  );
};
