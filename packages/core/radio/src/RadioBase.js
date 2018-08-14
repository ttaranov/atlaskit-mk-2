// @flow
import React, { Component } from 'react';
import RadioIcon from './RadioIcon';
import type { RadioBasePropTypes } from './types';
import { Wrapper, HiddenInput, Label } from './styled/Radio';

type State = {
  isHovered: boolean,
  isFocused: boolean,
  isActive: boolean,
  isMouseDown: boolean,
};

export default class Radio extends Component<RadioBasePropTypes, State> {
  static defaultProps = {
    isDisabled: false,
    isInvalid: false,
    isSelected: false,
  };

  state: State = {
    isHovered: false,
    isFocused: false,
    isActive: false,
    isMouseDown: false,
  };

  onBlur = () =>
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.isMouseDown && this.state.isActive,
      isFocused: false,
    });
  onFocus = () => this.setState({ isFocused: true });
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
      isSelected,
      name,
      onChange,
      value,
    } = this.props;
    const { isFocused, isHovered, isActive } = this.state;

    return (
      <Label
        isDisabled={isDisabled}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
      >
        <HiddenInput
          checked={isSelected}
          disabled={isDisabled}
          name={name}
          onChange={onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          required={isRequired}
          type="radio"
          value={value}
        />
        <Wrapper>
          <RadioIcon
            isActive={isActive}
            isChecked={isSelected}
            isDisabled={isDisabled}
            isFocused={isFocused}
            isHovered={isHovered}
            isInvalid={isInvalid}
          />
          <span>{children}</span>
        </Wrapper>
      </Label>
    );
  }
}
