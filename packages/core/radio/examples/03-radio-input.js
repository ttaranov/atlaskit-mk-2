// @flow
import React, { Component } from 'react';
import { RadioInput } from '../src';

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
  onChange = (event: SyntheticEvent<*>) => {
    console.log('onChange()', event.currentTarget.value);
    this.setState({
      checkedValue: event.currentTarget.value,
    });
  };
  onClick = (event: SyntheticEvent<*>) => {
    console.log('onClick', event);
    this.setState({
      isChecked: true,
    });
  };
  render() {
    console.log(this.state.isChecked);
    return (
      <RadioInput
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
