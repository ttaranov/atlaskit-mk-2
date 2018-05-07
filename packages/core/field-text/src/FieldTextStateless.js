// @flow

import React, { Component } from 'react';
import Base, { Label } from '@atlaskit/field-base';
import Input from './styled/Input';
import type { FieldTextProps } from './types';

export default class FieldTextStateless extends Component<
  FieldTextProps,
  void,
> {
  static defaultProps = {
    compact: false,
    disabled: false,
    isInvalid: false,
    isReadOnly: false,
    isSpellCheckEnabled: true,
    onChange: () => {},
    required: false,
    type: 'text',
    isValidationHidden: false,
  };

  input: ?HTMLInputElement;

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  handleInputRef = (input: HTMLInputElement) => {
    this.input = input;
  };

  render() {
    return (
      <div>
        <Label
          htmlFor={this.props.id}
          isDisabled={this.props.disabled}
          isLabelHidden={this.props.isLabelHidden}
          isRequired={this.props.required}
          label={this.props.label || ''}
        />
        <Base
          invalidMessage={this.props.invalidMessage}
          isCompact={this.props.compact}
          isDisabled={this.props.disabled}
          isFitContainerWidthEnabled={this.props.shouldFitContainer}
          isInvalid={this.props.isInvalid}
          isReadOnly={this.props.isReadOnly}
          isRequired={this.props.required}
          isValidationHidden={this.props.isValidationHidden}
        >
          <Input
            autoComplete={this.props.autoComplete}
            autoFocus={this.props.autoFocus}
            disabled={this.props.disabled}
            form={this.props.form}
            id={this.props.id}
            innerRef={this.handleInputRef}
            maxLength={this.props.maxLength}
            min={this.props.min}
            max={this.props.max}
            name={this.props.name}
            onBlur={this.props.onBlur}
            onChange={this.props.onChange}
            onFocus={this.props.onFocus}
            onKeyDown={this.props.onKeyDown}
            onKeyPress={this.props.onKeyPress}
            onKeyUp={this.props.onKeyUp}
            pattern={this.props.pattern}
            placeholder={this.props.placeholder}
            readOnly={this.props.isReadOnly}
            required={this.props.required}
            spellCheck={this.props.isSpellCheckEnabled}
            type={this.props.type}
            value={this.props.value}
          />
        </Base>
      </div>
    );
  }
}
