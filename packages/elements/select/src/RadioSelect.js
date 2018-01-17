// @flow
import React from 'react';

import Select from './Select';
import { RadioOption } from './components';

const RadioSelect = (props: any) => (
  <Select {...props} isMulti={false} components={{ Option: RadioOption }} />
);

export default RadioSelect;
