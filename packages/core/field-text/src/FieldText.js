// @flow

import React, { Component } from 'react';
import FieldTextStateless from './FieldTextStateless';
import type { FieldTextProps } from './types';

type State = {
  value?: string | number,
};
export default function FieldText (props) {
  static defaultProps = {
    onChange: () => {},
  };

  input: ?HTMLInputElement;

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  const state = useState({
    value: this.props.value,
  };

  handleOnChange = (e: any) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    return (
      <FieldTextStateless
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
        innerRef={(fieldRef: ?HTMLInputElement) => {
          this.input = fieldRef;
        }}
      />
    );
  }
}
