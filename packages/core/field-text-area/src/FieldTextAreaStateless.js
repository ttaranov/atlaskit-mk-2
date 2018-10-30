// @flow
import React, { Component, type Node } from 'react';
import styled from 'styled-components';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Base, { Label } from '@atlaskit/field-base';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import TextArea from './styled/TextArea';

const Wrapper = styled.div`
  flex: 1 1 100%;
`;

type Props = {
  /** Set whether the fields should expand to fill available horizontal space. */
  compact?: boolean,
  /** Sets the field as uneditable, with a changed hover state. */
  disabled?: boolean,
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean,
  /** Add asterisk to label. Set required for form that the field is part of. */
  required?: boolean,
  /** Sets styling to indicate that the input is invalid. */
  isInvalid?: boolean,
  /** Label to be displayed above the input. */
  label: string,
  /** Name value to be passed to the html input. */
  name?: string,
  /** Text to display in the input if the input is empty. */
  placeholder?: string,
  /** The value of the input. */
  value?: string | number,
  /** Handler to be called when the input is blurred */
  onBlur?: (event: SyntheticInputEvent<HTMLTextAreaElement>) => mixed,
  /** Handler to be called when the input changes. */
  onChange?: (event: SyntheticInputEvent<HTMLTextAreaElement>) => mixed,
  /** Handler to be called when the input is focused */
  onFocus?: (event: SyntheticInputEvent<HTMLTextAreaElement>) => mixed,
  /** Id value to be passed to the html input. */
  id?: string,
  /** Sets whether to show or hide the label. */
  isLabelHidden?: boolean,
  /** Sets content text value to monospace */
  isMonospaced?: boolean,
  /** Provided component is rendered inside a modal dialogue when the field is
   selected. */
  invalidMessage?: Node,
  /** Ensure the input fits in to its containing element. If the field is still
   resizable, it will not be hotizontally resizable. */
  shouldFitContainer?: boolean,
  /** Sets whether to apply spell checking to the content. */
  isSpellCheckEnabled?: boolean,
  /** Sets whether the component should be automatically focused on component
   render. */
  autoFocus?: boolean,
  /** Set the maximum length that the entered text can be. */
  maxLength?: number,
  /** The minimum number of rows of text to display */
  minimumRows?: number,
  /** Enables the resizing of the textarea (in both directions, or restricted to one axis) */
  enableResize?: boolean | 'horizontal' | 'vertical',
  /** Type of field */
  type?: string, //eslint-disable-line react/no-unused-prop-types
  /** Hide the validation message and style. This is used by <Field> to disable Validation display handling by FieldBase
   */
  isValidationHidden?: boolean,
};

class FieldTextAreaStateless extends Component<Props, void> {
  input: any; // eslint-disable-line react/sort-comp

  static defaultProps = {
    compact: false,
    disabled: false,
    isReadOnly: false,
    required: false,
    isInvalid: false,
    label: '',
    type: 'text',
    isSpellCheckEnabled: true,
    minimumRows: 1,
    isValidationHidden: false,
  };

  focus() {
    this.input.focus();
  }

  render() {
    const {
      autoFocus,
      compact,
      disabled,
      id,
      invalidMessage,
      isInvalid,
      isLabelHidden,
      isMonospaced,
      isReadOnly,
      isSpellCheckEnabled,
      label,
      maxLength,
      minimumRows,
      name,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      enableResize,
      required,
      shouldFitContainer,
      value,
      isValidationHidden,
    } = this.props;

    return (
      <Wrapper>
        <Label
          htmlFor={id}
          isDisabled={disabled}
          isLabelHidden={isLabelHidden}
          isRequired={required}
          label={label}
        />
        <Base
          isCompact={compact}
          isDisabled={disabled}
          isInvalid={isInvalid}
          isReadOnly={isReadOnly}
          isRequired={required}
          invalidMessage={invalidMessage}
          isFitContainerWidthEnabled={shouldFitContainer}
          isValidationHidden={isValidationHidden}
        >
          <TextArea
            disabled={disabled}
            readOnly={isReadOnly}
            name={name}
            placeholder={placeholder}
            value={value}
            required={required}
            isMonospaced={isMonospaced}
            minimumRows={minimumRows}
            enableResize={enableResize}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            id={id}
            autoFocus={autoFocus}
            spellCheck={isSpellCheckEnabled}
            maxLength={maxLength}
            innerRef={input => {
              this.input = input;
            }}
          />
        </Base>
      </Wrapper>
    );
  }
}

export { FieldTextAreaStateless as FieldTextAreaStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'fieldTextArea',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'textArea',

      attributes: {
        componentName: 'fieldTextArea',
        packageName,
        packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'textArea',

      attributes: {
        componentName: 'fieldTextArea',
        packageName,
        packageVersion,
      },
    }),
  })(FieldTextAreaStateless),
);
