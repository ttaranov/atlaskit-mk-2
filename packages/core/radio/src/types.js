// @flow
import type { Node } from 'react';

// Used by RadioGroupStateless
export type OptionPropType = {
  isDisabled?: boolean,
  isChecked?: boolean,
  label?: Node,
  name?: string,
  value?: string,
};

export type OptionsPropType = Array<OptionPropType>;

export type RadioIconProps = {
  /* Boolean for field active state */
  isActive?: boolean,
  /* Field checked state */
  isChecked?: boolean,
  /* Field disabled state */
  isDisabled?: boolean,
  /* Field focused state */
  isFocused?: boolean,
  /* Field hovered state */
  isHovered?: boolean,
  /* Field invalid state */
  isInvalid?: boolean,
};

export type RadioInputProps = RadioIconProps & {
  /* Field required state */
  isRequired?: boolean,
  /* Optional onError callback */
  onError?: (SyntheticEvent<*>) => void,
  /* onChange event handler */
  onChange: (SyntheticEvent<*>) => void,
  /* onBlur event handler */
  onBlur: (SyntheticEvent<*>) => void,
  /* onFocus event handler */
  onFocus: (SyntheticEvent<*>) => void,
  /* onInvalid event handler, to hook into native validation */
  onInvalid?: (SyntheticEvent<*>) => void,
  /* Field name */
  name?: string,
  /* Field value */
  value?: string,
};

export type RadioBasePropTypes = {
  children?: Node,
  /** Field disabled */
  isDisabled?: boolean,
  /** Field invalid */
  isInvalid: boolean,
  /** Marks this as a required field */
  isRequired?: boolean,
  /** Field is invalid */
  isInvalid?: boolean,
  /** Set the field as selected */
  isChecked?: boolean,
  /** Field name */
  name?: string,
  /** onChange event handler, passed into the props of each Radio Component instantiated within RadioGroup */
  onChange: (SyntheticEvent<*>) => void,
  /** onInvalid event handler, passed into the props of each Radio Component instantiated within RadioGroup */
  onInvalid?: (SyntheticEvent<*>) => void,
  /** Field value */
  value?: string,
};
