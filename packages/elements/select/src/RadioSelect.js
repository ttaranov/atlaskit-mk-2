// @flow
import React from 'react';

import Select from './Select';
import { RadioOption } from './components';

const RadioSelect = props => (
  <Select {...props} isMulti={false} components={{ Option: RadioOption }} />
);

export default RadioSelect;
