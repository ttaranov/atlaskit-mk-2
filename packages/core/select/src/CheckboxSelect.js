// @flow

import React from 'react';

import Select from './Select';
import { CheckboxOption } from './components';

const CheckboxSelect = (props: any) => (
  <Select
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    {...props}
    isMulti
    components={{ Option: CheckboxOption }}
  />
);

export default CheckboxSelect;
