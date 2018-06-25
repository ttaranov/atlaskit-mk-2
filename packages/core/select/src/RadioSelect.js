// @flow
import React from 'react';
import { colors } from '@atlaskit/theme';

import Select from './Select';
import { RadioOption } from './components';

const optionStyles = (css, { isFocused }) => ({
  ...css,
  backgroundColor: isFocused ? colors.N30 : 'transparent',
  color: 'inherit',
  cursor: 'pointer',
  paddingLeft: '16px',
  ':active': {
    backgroundColor: colors.B50,
  },
});

const RadioSelect = (props: any) => (
  <Select
    {...props}
    isMulti={false}
    styles={{ option: optionStyles }}
    components={{ Option: RadioOption }}
  />
);

export default RadioSelect;
