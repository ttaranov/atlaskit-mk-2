// @flow
import type { Node, ElementRef } from 'react';
import DefaultInput from './components/Input';

export type InputProps = {
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance?: 'standard' | 'none' | 'subtle',
  /** Set whether the fields should expand to fill available horizontal space. */
  isCompact?: boolean,
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled?: boolean,
  /** Sets styling to indicate that the input is focused. */
  isFocused?: boolean,
  /** Sets styling to indicate that the input is invalid. */
  isInvalid?: boolean,
  /** Sets content text value to monospace */
  isMonospaced?: boolean,
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean,
  /** Add asterisk to label. Set required for form that the field is part of. */
  isRequired?: boolean,
  /** Forwarded ref */
  forwardedRef: ElementRef<*>,
};

export type TextFieldProps = {
  /** Sets a default value as input value */
  defaultValue?: string,
  /** Optional input Element from consumer */
  input: typeof DefaultInput,
  /** Handler to be called when the input loses focus. */
  onBlur?: (e: SyntheticEvent<>) => mixed,
  /** Handler to be called when the input changes. */
  onChange?: (e: SyntheticInputEvent<HTMLInputElement>) => mixed,
  /** Handler to be called when the input receives focus. */
  onFocus?: (e: SyntheticEvent<>) => mixed,
  /** Sets maximum width of input */
  size?: string | number,
  /** The value of the input. */
  value?: string | number,
  /** Forwarded ref */
  forwardedRef: ElementRef<*>,
};
