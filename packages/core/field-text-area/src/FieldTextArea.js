// @flow
import React, { Component, type Node } from 'react';
import FieldTextAreaStateless from './FieldTextAreaStateless';

type Props = {|
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
  label?: string,
  /** Name value to be passed to the html input. */
  name?: string,
  /** Text to display in the input if the input is empty. */
  placeholder?: string,
  /** The value of the input. */
  value?: string | number,
  /** Handler to be called when the input changes. */
  // onChange?: (event: Event) => mixed,
  onChange?: any,
  /** Id value to be passed to the html input. */
  id?: string,
  /** Sets whether to show or hide the label. */
  isLabelHidden?: boolean,
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
  /** Disables the resizing of the text area. */
  enableResize?: boolean,
|};

type State = {|
  /** The value to be used in the field text area. This is the value that will
   be returned on form submission. */
  value?: number | string,
|};

export default class FieldTextArea extends Component<Props, State> {
  props: Props; // eslint-disable-line react/sort-comp
  input: any; // eslint-disable-line react/sort-comp

  static defaultProps = {
    onChange: () => {},
  };

  state = {
    value: this.props.value,
  };

  handleOnChange = (e: any) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) this.props.onChange(e);
  };

  focus = () => {
    this.input.focus();
  };

  render() {
    return (
      <FieldTextAreaStateless
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
        ref={fieldRef => {
          this.input = fieldRef;
        }}
      />
    );
  }
}
