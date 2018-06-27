// @flow
import React from 'react';
import { components } from 'react-select';

export { CheckboxOption, RadioOption } from './input-options';
export { ClearIndicator, DropdownIndicator } from './indicators';

export const MultiValueRemove = (props: any) => (
  <components.MultiValueRemove {...props}>
    <components.CrossIcon size={16} />
  </components.MultiValueRemove>
);
export const IndicatorSeparator = null;
