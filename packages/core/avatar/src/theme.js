// @flow

import { colors, gridSize } from '@atlaskit/theme';
import { AppearanceType, PresenceType, SizeType } from './types';

// const TRANSITION_DURATION = '200ms';
const gridSizeValue: number = gridSize();

const AVATAR_SIZES: {
  xsmall: number,
  small: number,
  medium: number,
  large: number,
  xlarge: number,
  xxlarge: number,
} = {
  xsmall: gridSizeValue * 2,
  small: gridSizeValue * 3,
  medium: gridSizeValue * 4,
  large: gridSizeValue * 5,
  xlarge: gridSizeValue * 12,
  xxlarge: gridSizeValue * 16,
};

// border radius only applies to "square" avatars
const AVATAR_RADIUS: {
  xsmall: number,
  small: number,
  medium: number,
  large: number,
  xlarge: number,
  xxlarge: number,
} = {
  xsmall: 2,
  small: 2,
  medium: 3,
  large: 3,
  xlarge: 6,
  xxlarge: 12,
};

const BORDER_WIDTH: {
  xsmall: number,
  small: number,
  medium: number,
  large: number,
  xlarge: number,
  xxlarge: number,
} = {
  xsmall: 2,
  small: 2,
  medium: 2,
  large: 2,
  xlarge: 2,
  xxlarge: 2,
};

// const EXCESS_INDICATOR_FONT_SIZE: {
//   small: number,
//   medium: number,
//   large: number,
//   xlarge: number,
// } = {
//   small: 10,
//   medium: 11,
//   large: 12,
//   xlarge: 16,
// };

const ICON_SIZES: {
  small: number,
  medium: number,
  large: number,
  xlarge: number,
} = {
  small: 12,
  medium: 14,
  large: 15,
  xlarge: 18,
};

const ICON_OFFSET: {
  small: number,
  medium: number,
  large: number,
  xlarge: number,
} = {
  small: 0,
  medium: 0,
  large: 1,
  xlarge: 7,
};

const SQUARE_ICON_OFFSET: {
  small: number,
  medium: number,
  large: number,
  xlarge: number,
} = {
  small: 0,
  medium: 0,
  large: 0,
  xlarge: 1,
};

type Theme = {
  mode: 'light' | 'dark',
};

type Props = {
  appearance: AppearanceType,
  includeBorderWidth: boolean,
  isLoading: boolean,
  presence: PresenceType,
  size: SizeType,
};

function getBackgroundColor(props: { isLoading: boolean, mode: Mode }): string {
  const backgroundColors = {
    light: colors.N40,
    dark: colors.DN50,
  };
  return props.isLoading ? backgroundColors[props.mode] : 'transparent';
}

function getBorderRadius(props: {
  appearance: Appearance,
  includeBorderWidth: boolean,
  size: Size,
}) {
  const borderWidth = props.includeBorderWidth ? BORDER_WIDTH[props.size] : 0;
  const borderRadius =
    props.appearance === 'circle'
      ? '50%'
      : `${AVATAR_RADIUS[props.size] + borderWidth}px`;
  return borderRadius;
}

function getDimensions(props: Props) {
  const borderWidth: number = props.includeBorderWidth
    ? BORDER_WIDTH[props.size] * 2
    : 0;
  const size: number = AVATAR_SIZES[props.size] + borderWidth;
  const width = `${size}px`;
  const height = width;
  return { height, width };
}

const getPresenceLayout = ({ appearance, size }: Props) => {
  const presencePosition =
    appearance === 'square' ? -(BORDER_WIDTH[size] * 2) : ICON_OFFSET[size];
  const presenceSize = ICON_SIZES[size];

  return {
    bottom: `${presencePosition}px`,
    height: `${presenceSize}px`,
    right: `${presencePosition}px`,
    width: `${presenceSize}px`,
  };
};

const getStatusLayout = ({ appearance, size }: Props) => {
  const statusPosition =
    appearance === 'square' ? SQUARE_ICON_OFFSET[size] : ICON_OFFSET[size];
  const statusSize = ICON_SIZES[size];

  return {
    height: `${statusSize}px`,
    right: `${statusPosition}px`,
    top: `${statusPosition}px`,
    width: `${statusSize}px`,
  };
};

export type ThemeProps = {
  backgroundColor: string,
  borderRadius: number,
  dimensions: { height: string, width: string },
  presence: { bottom: string, height: string, right: string, width: string },
  mode: 'light' | 'dark',
  status: { bottom: string, height: string, right: string, width: string },
};

export default (props: Theme, state: Props): ThemeProps => {
  return {
    backgroundColor: getBackgroundColor({
      isLoading: state.isLoading,
      mode: props.mode,
    }),
    borderRadius: getBorderRadius(state),
    dimensions: getDimensions(state),
    mode: props.mode,
    presence: getPresenceLayout(state),
    status: getStatusLayout(state),
  };
};
