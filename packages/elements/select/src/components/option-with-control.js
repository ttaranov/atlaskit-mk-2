// @flow

import React, { Component, type Node } from 'react';
import RadioIcon from '@atlaskit/icon/glyph/radio';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';

import Option from './option';

// maintains function shape
const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

// state of the parent option
type ControlProps = {
  isActive?: boolean,
  isDisabled?: boolean,
  isFocused?: boolean,
  isSelected?: boolean,
};

// the primary color represents the outer or background element
const getPrimaryColor = ({
  isActive,
  isDisabled,
  isFocused,
  isSelected,
  ...rest
}: ControlProps): string => {
  let color = backgroundColor;
  if (isDisabled && isSelected) {
    color = themed({ light: colors.B75, dark: colors.DN200 });
  } else if (isDisabled) {
    color = themed({ light: colors.N20A, dark: colors.DN10 });
  } else if (isActive) {
    color = themed({ light: colors.B75, dark: colors.B200 });
  } else if (isFocused && isSelected) {
    color = themed({ light: colors.B300, dark: colors.B75 });
  } else if (isFocused) {
    color = themed({ light: colors.N50A, dark: colors.DN30 });
  } else if (isSelected) {
    color = colors.blue;
  }
  // $FlowFixMe: TEMPORARY
  return color(rest);
};

// the secondary color represents the radio dot or checkmark
const getSecondaryColor = ({
  isActive,
  isDisabled,
  isSelected,
  ...rest
}: ControlProps): string => {
  let color = themed({ light: colors.N0, dark: colors.DN10 });

  if (isDisabled && isSelected) {
    color = themed({ light: colors.N70, dark: colors.DN10 });
  } else if (isActive && isSelected && !isDisabled) {
    color = themed({ light: colors.B400, dark: colors.DN10 });
  } else if (!isSelected) {
    color = transparent;
  }
  // $FlowFixMe: TEMPORARY
  return color(rest);
};

type OptionProops = {
  children: Node,
  Icon: CheckboxIcon | RadioIcon,
  isDisabled?: boolean,
  isFocused?: boolean,
  isSelected: boolean,
};
type OptionState = { isActive?: boolean };
class ControlOption extends Component<OptionProops, OptionState> {
  state: OptionState = { isActive: false };
  onMouseDown = () => this.setState({ isActive: true });
  onMouseUp = () => this.setState({ isActive: false });
  onMouseLeave = () => this.setState({ isActive: false });
  render() {
    const {
      Icon,
      isDisabled,
      isFocused,
      isSelected,
      children,
      ...props
    } = this.props;
    const { isActive } = this.state;

    let bg = 'transparent';
    if (isFocused) bg = colors.N20;
    if (isActive) bg = colors.B50;

    return (
      <Option
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseLeave={this.onMouseLeave}
        style={{
          alignItems: 'center',
          backgroundColor: bg,
          color: 'inherit',
          display: 'flex ',
        }}
        {...props}
      >
        <Icon
          primaryColor={getPrimaryColor({ ...this.props, ...this.state })}
          secondaryColor={getSecondaryColor({ ...this.props, ...this.state })}
        />
        {children}
      </Option>
    );
  }
}
export const CheckboxOption = (props: any) => (
  <ControlOption Icon={CheckboxIcon} {...props} />
);
export const RadioOption = (props: any) => (
  <ControlOption Icon={RadioIcon} {...props} />
);
