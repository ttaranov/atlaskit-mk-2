// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DateTimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <DateTimePicker onChange={console.log} />

      <Label label="Disabled input" />
      <DateTimePicker isDisabled onChange={console.log} />
    </div>
  );
};
