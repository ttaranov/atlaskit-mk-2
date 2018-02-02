// @flow

import React from 'react';
import { cities } from './common/data';
import { Select } from './common/components';
import SelectWrapper from '../src/SelectWrapper';

const errorMsg = 'This field is required.';
const successMsg = 'Great job selecting an option!';

export default () => (
  <div>
    <SelectWrapper
      id="error"
      validationState="error"
      validationMessage={errorMsg}
    >
      <Select options={cities} placeholder="Choose a City" />
    </SelectWrapper>
    <hr style={{ border: 0, margin: '1em 0' }} />
    <SelectWrapper
      id="success"
      validationState="success"
      validationMessage={successMsg}
    >
      <Select
        options={cities}
        defaultValue={cities[0]}
        placeholder="Choose a City"
      />
    </SelectWrapper>
  </div>
);
