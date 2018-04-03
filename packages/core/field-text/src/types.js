// @flow
import type { Node } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type FieldTextProps = {
  /** Standard HTML input autocomplete attribute. */
  autoComplete?: 'on' | 'off',
  /** Standard HTML input form attribute. This is useful if the input cannot be included directly
   inside a form. */
  form?: string,
  /** Standard HTML input pattern attribute, used for validating using a regular expression. */
  pattern?: string,
  /** Set whether the fields should expand to fill available horizontal space. */
  compact?: boolean,
  /** Type value to be passed to the html input. */
  type?: string,
  /** Sets the field as uneditable, with a changed hover state. */
  disabled?: boolean,
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean,
  /** Add asterisk to label. Set required for form that the field is part of. */
  required?: boolean,
  /** Sets styling to indicate that the input is invalid. */
  isInvalid?: boolean,
  /** Label to be displayed above the input. */
  label?: string,
  /** Name value to be passed to the html input. */
  name?: string,
  /** Standard input min attribute, to be used with type="number" */
  min?: number,
  /** Standard input max attribute, to be used with type="number" */
  max?: number,
  /** Text to display in the input if the input is empty. */
  placeholder?: string,
  /** The value of the input. */
  value?: string | number,
  /** Handler to be called when the input loses focus. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onBlur?: (e: SyntheticEvent<>, analyticsEvent?: UIAnalyticsEvent) => mixed,
  /** Handler to be called when the input changes. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onChange?: (
    e: SyntheticEvent<HTMLInputElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => mixed,
  /** Handler to be called when the input receives focus. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onFocus?: (e: SyntheticEvent<>, analyticsEvent?: UIAnalyticsEvent) => mixed,
  /** Standard input onkeydown event. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onKeyDown?: (
    e: SyntheticKeyboardEvent<>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => mixed,
  /** Standard input onkeypress event. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onKeyPress?: (
    e: SyntheticKeyboardEvent<>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => mixed,
  /** Standard input onkeyup event. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onKeyUp?: (
    e: SyntheticKeyboardEvent<>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => mixed,
  /** Id value to be passed to the html input. */
  id?: string,
  /** Sets whether to show or hide the label. */
  isLabelHidden?: boolean,
  /** Provided component is rendered inside a modal dialogue when the field is
   selected. */
  invalidMessage?: Node,
  /** Ensure the input fits in to its containing element. */
  shouldFitContainer?: boolean,
  /** Sets whether to apply spell checking to the content. */
  isSpellCheckEnabled?: boolean,
  /** Sets whether the component should be automatically focused on component
   render. */
  autoFocus?: boolean,
  /** Set the maximum length that the entered text can be. */
  maxLength?: number,
  /** A ref function to get a hold of the inner textarea DOM element. */
  innerRef?: (ref: ?HTMLInputElement) => void,
};
