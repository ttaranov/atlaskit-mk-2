// @flow

import React, { Component } from 'react';
import Input from '@atlaskit/input';

type Handler = (e: any) => void;
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
  props: Props;

  static defaultProps = {
    isDisabled: false,
    placeholder: undefined,
    value: null,
    onChange() {},
    onKeyDown() {},
    onFocus() {},
    onBlur() {},
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
      />
    );
  }
}
