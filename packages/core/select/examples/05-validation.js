// @flow

import React from 'react';
import { cities } from './common/data';
import Select from '../src';
import SelectWrapper from '../src/SelectWrapper'; // TEMP: waiting for @atlaskit/form support

const errorMsg = 'This field is required.';
const successMsg = 'Great job selecting an option!';

const ValidationExample = () => (
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

export default ValidationExample;
