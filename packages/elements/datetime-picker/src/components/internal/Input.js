// @flow

import React, { Component, type ElementRef } from 'react';
import Input from '@atlaskit/input';
import type { Handler } from '../../types';

type Props = {
    isDisabled: bool,
    placeholder: ?string,
    value: ?string,
    onChange: Handler,
    onKeyDown: Handler,
    onFocus: Handler,
    onBlur: Handler,
};

export default class InputField extends Component<Props> {
  input: ElementRef<typeof Input>;

  static defaultProps = {
    isDisabled: false,
    placeholder: undefined,
    value: null,
    onChange() {},
    onKeyDown() {},
    onFocus() {},
    onBlur() {},
  }

  select = () => {
    if (this.input) {
      this.input.select();
    }
  }

  render() {
    return (
      <Input
        disabled={this.props.isDisabled}
        isEditing
        placeholder={this.props.placeholder}
        value={this.props.value || ''}
        onChange={this.props.onChange}
        onKeyDown={this.props.onKeyDown}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        ref={ref => { this.input = ref; }}
      />
    );
  }
}
