// @flow

import React, { Component } from 'react';
import Input from './Input';
import type { Handler } from '../../types';

type Props = {
  onChange: Handler,
  onKeyDown: Handler,
  onTriggerOpen: Handler,
  value: string,
};

export default class DateField extends Component<Props> {
  props: Props;
  input: any;

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.props.onTriggerOpen();
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
        placeholder="yyyy/mm/dd"
        {...this.props}
        onKeyDown={this.handleKeyDown}
        ref={ref => { this.input = ref; }}
      />
    );
  }
}
