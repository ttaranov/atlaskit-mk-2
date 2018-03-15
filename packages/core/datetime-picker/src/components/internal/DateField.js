// @flow

import React, { Component, type ElementRef } from 'react';
import Input from './Input';
import type { Handler } from '../../types';

type Props = {
  autoFocus: boolean,
  value: string,
  onChange: Handler,
  onKeyDown: Handler,
  onTriggerOpen: Handler,
  onTriggerValidate: Handler,
};

export default class DateField extends Component<Props> {
  input: ?ElementRef<typeof Input>;

  static defaultProps = {
    autoFocus: false,
    value: '',
    onChange() {},
    onKeyDown() {},
    onTriggerOpen() {},
    onTriggerValidate() {},
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      this.props.onTriggerOpen();
    } else if (e.key === 'Enter') {
      this.props.onTriggerValidate(this.props.value);
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e);
    }
  };

  select() {
    if (this.input) {
      this.input.select();
    }
  }

  render() {
    return (
      <Input
        placeholder="yyyy/mm/dd"
        {...this.props}
        onKeyDown={this.handleKeyDown}
        ref={ref => {
          this.input = ref;
        }}
      />
    );
  }
}
