// @flow
import React, { Component } from 'react';
import RadioInput from './RadioInput';
import { Label } from './styled/Radio';
import type { RadioProps } from './types';

type State = {
  isHovered: boolean,
  isFocused: boolean,
  isActive: boolean,
  isMouseDown: boolean,
};

export default class Radio extends Component<RadioProps, State> {
  static defaultProps = {
    isDisabled: false,
    isInvalid: false,
    isChecked: false,
  };

  state: State = {
    isHovered: false,
    isFocused: false,
    isActive: false,
    isMouseDown: false,
  };

  onBlur = () => {
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });
  };
  onFocus = () => {
    this.setState({ isFocused: true });
  };
  onMouseLeave = () => this.setState({ isActive: false, isHovered: false });
  onMouseEnter = () => this.setState({ isHovered: true });
  onMouseUp = () => this.setState({ isActive: false, isMouseDown: false });
  onMouseDown = () => this.setState({ isActive: true, isMouseDown: true });

  render() {
    const {
      children,
      isDisabled,
      isRequired,
      isInvalid,
      isChecked,
      name,
      onChange,
      onInvalid,
      value,
      ...props
    } = this.props;
    const { isFocused, isHovered, isActive } = this.state;

    return (
      <Label
        {...props}
        isDisabled={isDisabled}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
      >
        <RadioInput
          isChecked={isChecked}
          isDisabled={isDisabled}
          isFocused={isFocused}
          isHovered={isHovered}
          isInvalid={isInvalid}
          isRequired={isRequired}
          isActive={isActive}
          onChange={onChange}
          onInvalid={onInvalid}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          name={name}
          value={value}
        />
        <span>{children}</span>
      </Label>
    );
  }
}
