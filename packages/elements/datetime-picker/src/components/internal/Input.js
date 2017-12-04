// @flow

import React, { Component, type ElementRef } from 'react';
import Input from '@atlaskit/input';
import { colors } from '@atlaskit/theme';
import type { Handler } from '../../types';

type Props = {
  isDisabled: boolean,
  isActive: boolean,
  placeholder: ?string,
  value: ?string,
  width: ?string,
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
    width: undefined,
    onChange() {},
    onKeyDown() {},
    onFocus() {},
    onBlur() {},
  };

  select = () => {
    if (this.input) {
      this.input.select();
    }
  };

  getStyle() {
    const width = this.props.width;
    return !this.props.isActive ? { color: colors.N100, width } : { width };
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
        ref={ref => {
          this.input = ref;
        }}
      />
    );
  }
}
