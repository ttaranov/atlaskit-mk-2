// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DateTimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <DateTimePicker />

      <Label label="Disabled input" />
      <DateTimePicker isDisabled />

      <Label label="Always open" />
      <DateTimePicker isOpen />
    </div>
  );
};
