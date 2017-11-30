// @flow
import uuid from 'uuid';
import React, { Component } from 'react';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import { colors, themed } from '@atlaskit/theme';
import { Handle, IconWrapper, Inner, Input, Label, Slide } from './styled';
import defaultBaseProps from './defaultBaseProps';
import type { StatelessWithThemeProps, DefaultBaseProps } from './types';

type State = {|
  // not controlled by props but by browser focus
  isFocused: boolean,
|};

type DefaultProps = DefaultBaseProps & {
  isChecked: boolean,
  // Injected by the ThemeProvider
  theme: Object,
};

export default class ToggleStatelessWithTheme extends Component<
  StatelessWithThemeProps,
  State,
> {
  static defaultProps: DefaultProps = {
    ...defaultBaseProps,
    isChecked: false,
    theme: {},
  };

  state: State = {
    isFocused: false,
  };

  handleBlur = (event: Event) => {
    this.setState({
      isFocused: false,
    });
    this.props.onBlur(event);
  };
  handleFocus = (event: Event) => {
    this.setState({ isFocused: true });
    this.props.onFocus(event);
  };
  handleChange = (event: Event) => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onChange(event);
  };

  render() {
    const {
      isChecked,
      isDisabled,
      label,
      name,
      size,
      value,
      theme,
    } = this.props;
    const { isFocused } = this.state;

    const styledProps = {
      isChecked,
      isDisabled,
      isFocused,
      size,
    };
    const Icon = isChecked ? ConfirmIcon : CloseIcon;
    const id = uuid();
    const primaryColor = isChecked
      ? themed({ light: 'inherit', dark: colors.DN30 })(theme)
      : 'inherit';

    return (
      <Label size={size} isDisabled={isDisabled} htmlFor={id}>
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
