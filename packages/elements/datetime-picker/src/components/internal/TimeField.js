// @flow

import React, { Component, type ElementRef } from 'react';
import Input from './Input';
import type { Handler } from '../../types';

type Props = {
  value: string,
  onChange: Handler,
  onKeyDown: Handler,
};

export default class TimeField extends Component<Props> {
  input: ?ElementRef<typeof Input>;

  static defaultProps = {
    value: '',
    onChange() {},
    onKeyDown() {},
  };

  select() {
    if (this.input) {
      this.input.select();
    }
  }

  render() {
    return (
      <Input
        placeholder="hh:MM"
        {...this.props}
        ref={ref => {
          this.input = ref;
        }}
      />
    );
  }
}
