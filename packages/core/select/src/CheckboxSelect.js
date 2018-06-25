// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import Select from './Select';
import { CheckboxOption } from './components';

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
const CheckboxSelect = (props: any) => (
  <Select
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    isMulti
    components={{ Option: CheckboxOption }}
    styles={{ option: optionStyles }}
    {...props}
  />
);

export default CheckboxSelect;
