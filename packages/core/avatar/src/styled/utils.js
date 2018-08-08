// @flow
import { colors, themed } from '@atlaskit/theme';
import {
  AVATAR_RADIUS,
  AVATAR_SIZES,
  BORDER_WIDTH,
  TRANSITION_DURATION,
} from './constants';
import type { AvatarPropTypes, AppearanceType, SizeType } from '../types';

const backgroundColorFocus = colors.B200;
const overlayColorDefault = 'transparent';
const overlayColorHover = colors.N70A;
const overlayColorSelected = colors.N200A;
const overlayColorDisabled = themed({
  light: 'rgba(255, 255, 255, 0.7)',
  dark: colors.DN80A,
});

// "square" avatars are explicit
export function getBorderRadius(
  props: { appearance: AppearanceType, size: SizeType },
  config: { includeBorderWidth: boolean } = { includeBorderWidth: false },
) {
  const borderWidth: number = config.includeBorderWidth
    ? BORDER_WIDTH[props.size]
    : 0;
  return props.appearance === 'circle'
    ? '50%'
    : `${AVATAR_RADIUS[props.size] + borderWidth}px`;
}

export const getSize = (props: { size: SizeType }) => AVATAR_SIZES[props.size]; // for testing
export function getAvatarDimensions(
  props: { size: SizeType },
  config: {
    includeBorderWidth: boolean,
    sizeOnly: boolean,
  } = {
    includeBorderWidth: false,
    sizeOnly: false,
  },
) {
  const borderWidth: number = config.includeBorderWidth
    ? BORDER_WIDTH[props.size] * 2
    : 0;
  const size: number = AVATAR_SIZES[props.size] + borderWidth;
  return config.sizeOnly
    ? size
    : {
        height: `${size}px;`,
        width: `${size}px;`,
      };
}

// expose here for use with multiple element types
export function getInnerStyles(
  props: AvatarPropTypes & { isInteractive?: boolean },
) {
  const boxSizing: string = 'content-box';
  const borderWidth: string = `${BORDER_WIDTH[props.size]}px`;
  const isInteractive: boolean = Boolean(
    props.isInteractive || props.href || props.onClick,
  );
  // We make the distinction between isInteractive and isClickable as supplying a tooltip
  // makes the avatar interactive but not clickable
  const isClickable = Boolean(props.href || props.onClick);

  let backgroundColor = props.borderColor || colors.background;
  // Inherit cursor styles so we don't cancel out pointer cursors in places like avatar group more dropdown
  let cursor = 'inherit';
  let outline = 'none';
  let overlayShade = overlayColorDefault;
  let overlayOpacity = 0;
  let pointerEvents = 'auto';
  let position = 'static';
  let transform = 'translateZ(0)';
  let transitionDuration = '0s';

  // Interaction: Hover
  if (isInteractive && (props.isActive || props.isHover)) {
    overlayShade = overlayColorHover;
    overlayOpacity = 1;
  }

  // Interaction: Active
  if (isClickable && props.isActive) {
    transform = 'scale(0.9)';
  }

  // Interaction: Focus
  if (isInteractive && props.isFocus && !props.isActive) {
    outline = 'none';
    backgroundColor = backgroundColorFocus;
    transitionDuration = TRANSITION_DURATION;
  }

  // Disabled
  if (props.isDisabled) {
    cursor = 'not-allowed';
    overlayShade = overlayColorDisabled;
    overlayOpacity = 1;
    pointerEvents = 'none';
  }

  // Clickable
  if (isClickable) {
    cursor = 'pointer';
  }

  // Loading
  if (props.isSelected) {
    overlayShade = overlayColorSelected;
    overlayOpacity = 1;
  }

  // Stack,
  if (props.stackIndex) {
    position = 'relative';
  }
  return {
    ...getAvatarDimensions(props),
    alignItems: 'stretch;',
    backgroundColor,
    border: 0,
    borderRadius: getBorderRadius(props, { includeBorderWidth: true }),
    padding: borderWidth,
    boxSizing,
    cursor,
    display: 'flex;',
    flexDirection: 'column;',
    justifyContent: 'center;',
    outline,
    overflow: 'hidden;',
    pointerEvents,
    position,
    transform,
    transition: `background-color ${transitionDuration} ease-out;`,

    'a &, button &': {
      cursor: 'pointer;',
    },

    '&::after': {
      backgroundColor: overlayShade,
      borderRadius: getBorderRadius(props),
      bottom: borderWidth,
      content: ' ',
      left: borderWidth,
      opacity: overlayOpacity,
      pointerEvents: 'none;',
      position: 'absolute',
      right: borderWidth,
      top: borderWidth,
      transition: `opacity ${TRANSITION_DURATION};`,
    },

    '&::-moz-focus-inner': {
      border: 0,
      margin: 0,
      padding: 0,
    },
  };
}
