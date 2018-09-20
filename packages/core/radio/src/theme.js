// @flow
import { colors } from '@atlaskit/theme';
import type { RadioIconProps } from './types';

const getBorderColor = (props: RadioIconProps) => {
  if (props.isDisabled) return { light: '', dark: '' };
  if (props.isFocused) return { light: colors.B100, dark: colors.B75 };
  if (props.isActive) return { light: 'currentColor', dark: 'currentColor' };
  if (props.isInvalid) return { light: colors.R300, dark: colors.R300 };
  if (props.isChecked) return { light: 'currentColor', dark: 'currentColor' };
  return { light: colors.N40, dark: colors.DN80 };
};

const getDotColor = (props: RadioIconProps) => {
  const { isChecked, isDisabled, isActive } = props;

  let color = { light: colors.N10, dark: colors.DN10 };

  if (isDisabled && isChecked) {
    color = { light: colors.N70, dark: colors.DN90 };
  } else if (isActive && isChecked && !isDisabled) {
    color = { light: colors.B400, dark: colors.DN10 };
  } else if (!isChecked) {
    color = { light: 'transparent', dark: 'transparent' };
  }
  return color;
};

const getCircleColor = (props: RadioIconProps) => {
  const { isChecked, isDisabled, isActive, isHovered, isInvalid } = props;

  // set the default
  let color = { light: colors.N10, dark: colors.DN10 };

  if (isDisabled) {
    color = { light: colors.N20, dark: colors.DN10 };
  } else if (isActive) {
    color = { light: colors.B50, dark: colors.B200 };
  } else if (isHovered && isChecked) {
    color = { light: colors.B300, dark: colors.B75 };
  } else if (isHovered) {
    color = { light: colors.N30, dark: colors.DN30 };
  } else if (isChecked) {
    color = {
      light: colors.B400,
      dark: isInvalid ? colors.DN10 : colors.B400,
    };
  }
  return color;
};

const getTextColor = ({ isDisabled }) => {
  return isDisabled
    ? { light: colors.N80, dark: colors.N80 }
    : { light: colors.N900, dark: colors.DN600 };
};

export type ThemeProps = {
  radio?: (
    state: RadioIconProps,
  ) => {
    dotColor: string,
    circleColor: string,
    borderColor: string,
    textColor: string,
  },
  mode?: 'light' | 'dark',
};

export default function(props: ThemeProps) {
  const mode = props.mode || 'light';
  return {
    radio: (state: RadioIconProps) => ({
      dotColor: getDotColor(state)[mode],
      circleColor: getCircleColor(state)[mode],
      borderColor: getBorderColor(state)[mode],
      textColor: getTextColor(state)[mode],
      ...(props.radio ? props.radio(state) : null),
    }),
    mode,
    ...props,
  };
}
