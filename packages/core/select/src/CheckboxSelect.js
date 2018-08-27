// @flow

import React from 'react';

import Select from './Select';
import { CheckboxOption } from './components';
import { inputOptionStyles } from './components/input-options';

const CheckboxSelect = (props: any) => (
  <Select
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    isMulti
    components={{ Option: CheckboxOption }}
    styles={{ option: inputOptionStyles }}
    {...props}
  />
);

export default CheckboxSelect;
