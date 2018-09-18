// @flow

import { colors, gridSize } from '@atlaskit/theme';
import { AppearanceType, PresenceType, SizeType } from '../types';

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

function getDimensions(props: ThemePropsType) {
  const borderWidth: number = props.includeBorderWidth
    ? BORDER_WIDTH[props.size] * 2
    : 0;
  const size: number = AVATAR_SIZES[props.size] + borderWidth;
  const width = `${size}px`;
  const height = width;
  return { height, width };
}

const getPresenceLayout = ({ appearance, size }: ThemePropsType) => {
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

const getStatusLayout = ({ appearance, size }: ThemePropsType) => {
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

export type ThemeType = {
  avatar?: ThemeAvatarProps => {
    backgroundColor: string,
    borderRadius: number,
    dimensions: { height: string, width: string },
    presence: { bottom: string, height: string, right: string, width: string },
    status: { bottom: string, height: string, right: string, width: string },
  },
  mode?: 'dark' | 'light',
};

export type ThemePropsType = {
  appearance: AppearanceType,
  includeBorderWidth: boolean,
  isLoading: boolean,
  presence: PresenceType,
  size: SizeType,
};

export function theme(parent: ThemeType): ThemeType {
  return {
    avatar(props) {
      return {
        backgroundColor: getBackgroundColor({
          isLoading: props.isLoading,
          mode: parent.mode,
        }),
        borderRadius: getBorderRadius(props),
        dimensions: getDimensions(props),
        presence: getPresenceLayout(props),
        status: getStatusLayout(props),
        ...(parent.avatar && parent.avatar(props)),
      };
    },
    mode: parent.mode || 'light',
    ...parent,
  };
}
