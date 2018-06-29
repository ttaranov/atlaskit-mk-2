// @flow
import React from 'react';

import Select from './Select';
import { RadioOption } from './components';
import { inputOptionStyles } from './components/input-options';

const RadioSelect = (props: any) => (
  <Select
    {...props}
    isMulti={false}
    styles={{ option: inputOptionStyles }}
    components={{ Option: RadioOption }}
  />
);

export default RadioSelect;
