// @flow
import React, { Component } from 'react';
import { Radio } from '../src';

type State = {
  isActive: boolean,
  isChecked: boolean,
  isFocused: boolean,
  isMouseDown: boolean,
  checkedValue: string,
};
export default class RadioInputExample extends Component<*, State> {
  state = {
    checkedValue: '',
    isActive: false,
    isChecked: false,
    isMouseDown: false,
    isFocused: false,
  };

  onBlur = () => {
    this.setState({
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });
  };

  onFocus = () => {
    this.setState({
      isFocused: true,
    });
  };
  onChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
  };
  render() {
    return (
      <Radio
        isChecked={this.state.isChecked}
        isActive
        isHovered
        isFocused
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onChange={this.onChange}
        name="radio-1"
        value={'radio-1'}
      />
    );
  }
}
