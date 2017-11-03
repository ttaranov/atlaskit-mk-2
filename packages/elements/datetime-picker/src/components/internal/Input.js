// @flow

import React, { Component, type ElementRef } from 'react';
import Input from '@atlaskit/input';
import { akColorN60, akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import type { Handler } from '../../types';

type Props = {
  isDisabled: bool,
  isActive: bool,
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
    isActive: true,
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

  getStyle() {
    return !this.props.isActive
      ? { color: akColorN60, width: `${akGridSizeUnitless * 12}px` }
      : { width: `${akGridSizeUnitless * 12}px` };
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
        style={this.getStyle()}
        ref={ref => { this.input = ref; }}
      />
    );
  }
}
