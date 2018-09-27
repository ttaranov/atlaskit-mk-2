// @flow
import type { Node } from 'react';

// Used by RadioGroupStateless
export type OptionPropType = {
  isDisabled?: boolean,
  isChecked?: boolean,
  label?: Node,
  name?: string,
  value?: string | number,
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
  /* Aria-label for the hidden input */
  label?: string,
  /* Field name */
  name?: string,
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
  /* Field value */
  value?: string,
};

export type RadioProps = {
  /** the aria-label attribute associated with the radio element */
  ariaLabel?: string,
  /** Field disabled */
  isDisabled?: boolean,
  /** Field invalid */
  isInvalid: boolean,
  /** Marks this as a required field */
  isRequired?: boolean,
  /** Field is invalid */
  isInvalid?: boolean,
  /** Set the field as checked */
  isChecked?: boolean,
  /** The label value for the input rendered to the dom */
  label?: Node,
  /** Field name */
  name?: string,
  /** onChange event handler, passed into the props of each Radio Component instantiated within RadioGroup */
  onChange: (SyntheticEvent<*>) => void,
  onBlur?: (SyntheticInputEvent<*>) => void,
  onFocus?: (SyntheticInputEvent<*>) => void,
  onMouseDown?: (SyntheticInputEvent<*>) => void,
  onMouseUp?: (SyntheticInputEvent<*>) => void,
  onMouseEnter?: (SyntheticInputEvent<*>) => void,
  onMouseLeave?: (SyntheticInputEvent<*>) => void,
  /** onInvalid event handler, passed into the props of each Radio Component instantiated within RadioGroup */
  onInvalid?: (SyntheticEvent<*>) => void,
  /** Field value */
  value?: string | number,
};
