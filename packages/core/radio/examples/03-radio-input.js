// @flow
import React, { Component } from 'react';
import { RadioInput } from '../src';

export default class RadioInputExample extends Component {
  state = {
    selectedValue: '',
    isChecked: false,
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
  onChange = event => {
    console.log('onChange()', event.target.value);
    this.setState({
      selectedValue: event.target.value,
    });
  };
  onClick = event => {
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
        name='radio-1'
        value={'radio-1'}
      />
    );
  }
}
