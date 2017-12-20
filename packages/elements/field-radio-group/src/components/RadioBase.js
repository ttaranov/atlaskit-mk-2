import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { themed, colors } from '@atlaskit/theme';
import RadioIcon from '@atlaskit/icon/glyph/radio';
import { HiddenInput, IconWrapper, Label, Wrapper } from '../styled/Radio';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

/* eslint-disable jsx-a11y/label-has-for */
export default class Radio extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    isSelected: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    isDisabled: false,
    isSelected: false,
  };

  state = {
    isHovered: false,
    isFocused: false,
    isActive: false,
  };

  onBlur = () =>
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.mouseIsDown && this.state.isActive,
      isFocused: false,
    });
  onFocus = () => this.setState({ isFocused: true });
  onMouseLeave = () => this.setState({ isActive: false, isHovered: false });
  onMouseEnter = () => this.setState({ isHovered: true });
  onMouseUp = () => this.setState({ isActive: false, mouseIsDown: false });
  onMouseDown = () => this.setState({ isActive: true, mouseIsDown: true });

  // The secondary color represents the inner circle
  getSecondaryColor = (): string => {
    const { isSelected, isDisabled, ...rest } = this.props;
    const { isActive } = this.state;

    let color = themed({ light: colors.N0, dark: colors.DN10 });

    if (isDisabled && isSelected) {
      color = themed({ light: colors.N70, dark: colors.DN10 });
    } else if (isActive && isSelected && !isDisabled) {
      color = themed({ light: colors.B400, dark: colors.DN10 });
    } else if (!isSelected) {
      color = transparent;
    }
    return color(rest);
  };
  // The secondary color represents the outer circle
  getPrimaryColor = (): string => {
    const { isSelected, isDisabled, ...rest } = this.props;
    const { isHovered, isActive } = this.state;
    let color = backgroundColor;
    if (isDisabled && isSelected) {
      color = themed({ light: colors.B75, dark: colors.DN200 });
    } else if (isDisabled) {
      color = themed({ light: colors.N20A, dark: colors.DN10 });
    } else if (isActive) {
      color = themed({ light: colors.B75, dark: colors.B200 });
    } else if (isHovered && isSelected) {
      color = themed({ light: colors.B300, dark: colors.B75 });
    } else if (isHovered) {
      color = themed({ light: colors.N50A, dark: colors.DN30 });
    } else if (isSelected) {
      color = colors.blue;
    }

    return color(rest);
  };

  render() {
    const {
      children,
      isDisabled,
      isRequired,
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
          <IconWrapper
            isSelected={isSelected}
            isDisabled={isDisabled}
            isFocused={isFocused}
            isActive={isActive}
            isHovered={isHovered}
          >
            <RadioIcon
              primaryColor={this.getPrimaryColor()}
              secondaryColor={this.getSecondaryColor()}
              label="radioIcon"
            />
          </IconWrapper>
          <span>{children}</span>
        </Wrapper>
      </Label>
    );
  }
}
