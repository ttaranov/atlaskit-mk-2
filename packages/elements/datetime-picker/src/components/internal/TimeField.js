// @flow

import React, { Component } from 'react';
import Input from './Input';
import type { Handler } from '../../types';

type Props = {
  value: string,
  onChange: Handler,
  onKeyDown: Handler,
  onTriggerOpen: Handler,
  onTriggerValidate: Handler,
};

export default class TimeField extends Component<Props> {
  props: Props;
  input: any;

  static defaultProps = {
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
  }

  select() {
    if (this.input) {
      this.input.select();
    }
  }

  render() {
    return (
      <Input
        placeholder="e.g. 9:00am"
        {...this.props}
        onKeyDown={this.handleKeyDown}
        ref={ref => { this.input = ref; }}
      />
    );
  }
}
