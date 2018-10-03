// @flow

import React, { Component } from 'react';
import FieldTextStateless from './FieldTextStateless';
import type { FieldTextProps } from './types';

type State = {
  value?: string | number,
};
export default class FieldText extends Component<FieldTextProps, State> {
  static defaultProps = {
    onChange: () => {},
    defaultValue: '',
  };

  input: ?HTMLInputElement;

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  state = {
    value: this.props.defaultValue,
  };

  handleOnChange = (e: any) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    const { props, state } = this;
    const value =
      typeof props.value === 'undefined' ? state.value : props.value;
    return (
      <FieldTextStateless
        {...this.props}
        value={value}
        onChange={this.handleOnChange}
        innerRef={(fieldRef: ?HTMLInputElement) => {
          this.input = fieldRef;
        }}
      />
    );
  }
}
