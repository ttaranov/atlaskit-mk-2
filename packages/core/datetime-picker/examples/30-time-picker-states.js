// @flow

import React from 'react';
import { Label } from '@atlaskit/field-base';
import { TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="Stock" />
      <TimePicker />

      <Label label="Disabled input" />
      <TimePicker isDisabled />

      <Label label="Always open" />
      <TimePicker isOpen />
    </div>
  );
};
