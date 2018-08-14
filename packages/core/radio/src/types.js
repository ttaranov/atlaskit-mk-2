// @flow
import type { Node } from 'react';

// Used by RadioGroupStateless
export type ItemPropType = {
  isDisabled?: boolean,
  isSelected?: boolean,
  label?: Node,
  name?: string,
  value?: string,
};

export type ItemPropTypeSmart = {
  ...ItemPropType,
  defaultSelected?: boolean,
};

export type ItemsPropType = Array<ItemPropType>;

// Used by RadioGroup
export type ItemsPropTypeSmart = Array<ItemPropTypeSmart>;

export type RadioBasePropTypes = {
  children?: Node,
  /** Field disabled */
  isDisabled?: boolean,
  /** Marks this as a required field */
  isRequired?: boolean,
  /** Set the field as selected */
  isSelected?: boolean,
  /** Field name */
  name?: string,
  /** onChange event handler */
  onChange: any => mixed,
  /** Field value */
  value?: string,
};

export type RadioGroupBasePropTypes = {|
  /** Mark whether this field is required for form validation. */
  isRequired?: boolean,
  /** Label to display above the radio button options. */
  label?: string,
  /** Called when the value changes; passed the event */
  onRadioChange: any => mixed,
|};

export type RadioGroupStatelessPropTypes = {
  ...RadioGroupBasePropTypes,
  /** Items to be rendered by a single Radio component. Passes options down to
   an AkRadio component, with label passed as children. */
  items?: ItemsPropType,
};

export type RadioGroupPropTypes = {
  ...RadioGroupBasePropTypes,
  /** Items to be rendered by a single Radio component. Passes options down to
   an AkRadio component, with label passed as children. */
  items?: ItemsPropTypeSmart,
};
