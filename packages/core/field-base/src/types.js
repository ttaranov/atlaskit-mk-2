// @flow
import type { Node } from 'react';

export type FieldBaseStatelessProps = {
  /**
   * controls the appearance of the field.
   * subtle shows styling on hover.
   * none hides all field styling.
   */
  appearance?: 'standard' | 'none' | 'subtle',
  /** children to render as dialog */
  children?: Node,
  /** message to show on the dialog when isInvalid and isDialogOpen  are true */
  invalidMessage?: Node,
  /** applies compact styling, making the field smaller */
  isCompact?: boolean,
  /** controls whether to show or hide the dialog */
  isDialogOpen?: boolean,
  /** disable the field and apply disabled styling */
  isDisabled?: boolean,
  /** whether the fit the field to the enclosing container */
  isFitContainerWidthEnabled?: boolean,
  /** apply styling based on whether the field is focused */
  isFocused?: boolean,
  /** set the field as invalid, triggering style and message */
  isInvalid?: boolean,
  /** show a loading indicator */
  isLoading?: boolean,
  /** disable padding styles */
  isPaddingDisabled?: boolean,
  /** apply read only styling */
  isReadOnly?: boolean,
  /** mark the field as required */
  isRequired?: boolean,
  /** handler for the onBlur event on the field element */
  onBlur: (event: any) => mixed,
  /** handler for the onBlur event on the dialog element */
  onDialogBlur?: (event: any) => mixed,
  /** handler for the click event on the dialog element */
  onDialogClick?: (event: any) => mixed,
  /** handler for the focus event on the dialog element */
  onDialogFocus?: (event: any) => mixed,
  /** handler for the focus event on the field element */
  onFocus: (event: any) => mixed,
  /** whether to call the onBlur handler inside componentDidUpdate */
  shouldReset?: boolean,
  /** the maximum width of the field-base in pixels. Don't include the "px". */
  maxWidth?: number,
  /** Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase
   */
  isValidationHidden?: boolean,
};

export type FieldBaseProps = FieldBaseStatelessProps & {
  /** focus the element when initially rendered */
  defaultIsFocused?: boolean,
};

export type FieldBaseDefaultProps = {
  defaultIsFocused: boolean,
  onFocus: () => mixed,
  onBlur: () => mixed,
};
