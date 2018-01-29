// @flow

import React from 'react';
import { Select } from './common/components';
import { cities } from './common/data';
import { SelectValidation } from '../src';

const errorMsg = 'This field is required.';
const successMsg = 'Great job selecting an option!';

export default () => (
  <div>
    <SelectValidation validationState="error" validationMessage={errorMsg}>
      <Select options={cities} placeholder="Choose a City" />
    </SelectValidation>
    <hr style={{ border: 0, margin: '1em 0' }} />
    <SelectValidation validationState="success" validationMessage={successMsg}>
      <Select options={cities} placeholder="Choose a City" />
    </SelectValidation>
  </div>
);
