// @flow

import React from 'react';
import { components } from 'react-select';
import { colors } from '@atlaskit/theme';

type OptionProps = { isFocused: boolean, isSelected: boolean };

// default ak styles for select option
const Option = ({ isFocused, isSelected, ...props }: OptionProps) => {
  let backgroundColor = 'transparent';
  if (isFocused) backgroundColor = colors.N20;
  if (isSelected) backgroundColor = colors.B200;

  const color = isSelected ? colors.N0 : 'inherit';

  return <components.Option style={{ backgroundColor, color }} {...props} />;
};

export default Option;
