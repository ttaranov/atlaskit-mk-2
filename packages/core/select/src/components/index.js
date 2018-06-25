// @flow
import React from 'react';
import styled from 'styled-components';
import { components } from 'react-select';

export { CheckboxOption, RadioOption } from './input-options';
export { ClearIndicator, DropdownIndicator } from './indicators';
const Truncate = styled.div`
  text-overflow: ellipsis;
  overflow-x: hidden;
  flex: 1;
  white-space: nowrap;
`;

export const MultiValueLabel = ({ children, ...props }: any) => (
  <components.MultiValueLabel {...props}>
    <Truncate>{children}</Truncate>
  </components.MultiValueLabel>
);
export const MultiValueRemove = (props: any) => (
  <components.MultiValueRemove {...props}>
    <components.CrossIcon size={16} />
  </components.MultiValueRemove>
);
export const IndicatorSeparator = null;
