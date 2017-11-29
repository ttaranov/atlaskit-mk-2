// @flow
import uid from 'uid';
import React, { Component } from 'react';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import { colors, themed } from '@atlaskit/theme';
import { Handle, IconWrapper, Inner, Input, Label, Slide } from './styled';
import type { StatefulProps } from './types';

// currently all props are optional
type DefaultProps = StatefulProps;

type State = {|
  isActive: boolean,
  isFocused: boolean,
|};

export default class ToggleStateless extends Component<StatefulProps, State> {
  static defaultProps: DefaultProps = {
    isChecked: false,
    isDisabled: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    size: 'regular',
    // TODO: Should these be required?
    label: '',
    name: '',
    value: '',
  };

  state: State = {
    isFocused: false,
    isActive: false,
  };

  onMouseUp = () => this.setState({ isActive: false, mouseIsDown: false });
  onMouseDown = () => this.setState({ isActive: true, mouseIsDown: true });

  handleMouseDown = () => {
    this.setState({ isActive: true, mouseIsDown: true });
  };
  handleBlur = (event: Event) => {
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.mouseIsDown && this.state.isActive,
      isFocused: false,
    });
    this.props.onBlur(event);
  };
  handleChange = (event: Event) => {
    this.props.onChange(event);
  };
  handleFocus = (event: Event) => {
    this.setState({ isFocused: true });
    this.props.onFocus(event);
  };

  render() {
    const {
      isChecked,
      isDisabled,
      label,
      name,
      size,
      value,
      ...rest
    } = this.props;
    const { isFocused, isActive } = this.state;
    const styledProps = {
      isChecked,
      isDisabled,
      isFocused: isFocused || isActive,
      size,
    };
    const Icon = isChecked ? ConfirmIcon : CloseIcon;
    const id = uid();
    const primaryColor = isChecked
      ? themed({ light: 'inherit', dark: colors.DN30 })(rest)
      : 'inherit';

    return (
      <Label
        size={size}
        isDisabled={isDisabled}
        htmlFor={id}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <Input
          checked={isChecked}
          disabled={isDisabled}
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          type="checkbox"
          value={value}
        />
        <Slide {...styledProps}>
          <Inner {...styledProps}>
            <Handle isChecked={isChecked} isDisabled={isDisabled} size={size} />
            <IconWrapper isChecked={isChecked} size={size}>
              <Icon
                primaryColor={primaryColor}
                label={label || (isChecked ? 'Uncheck' : 'Check')}
                size={size === 'large' ? 'medium' : 'small'}
              />
            </IconWrapper>
          </Inner>
        </Slide>
      </Label>
    );
  }
}
