// @flow

import { colors, gridSize } from '@atlaskit/theme';

import type { ThemedGlobalNavigationComponentStyles } from '../../theme/types';
import type { GlobalItemPresentationProps } from './types';

/**
 * We can't have semi-transparent background colors for items so I'm hard-coding
 * an opaque hex value here, where the designs specify them as an RGBA.
 */
const lightActiveBackground = '#08367C'; // N80A
const darkActiveBackground = '#202B3D';
const darkHoverBackground = '#253247';
const settingsActiveBackground = '#374864'; // rgba(255, 255, 255, 0.08)
const settingsHoverBackground = '#0B2043'; // N700A

const baseStyles = {
  itemBase: {
    alignItems: 'center',
    border: 0,
    borderRadius: '50%',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    fontSize: 'inherit',
    justifyContent: 'center',
    lineHeight: 1,
    outline: 'none',
    padding: 0,
    position: 'relative', // allow badge positioning

    '&:focus': {
      boxShadow: `0 0 0 2px ${colors.B100}`,
    },
  },
  badgeWrapper: {
    pointerEvents: 'none',
    position: 'absolute',
    userSelect: 'none',
  },
};

const sizeStyles = {
  large: {
    itemBase: {
      height: `${gridSize() * 5}px`,
      width: `${gridSize() * 5}px`,
    },
    badgeWrapper: {
      left: `${gridSize() * 2}px`,
      top: 0,
    },
  },
  small: {
    itemBase: {
      height: `${gridSize() * 4}px`,
      marginTop: `${gridSize()}px`,
      width: `${gridSize() * 4}px`,
    },
    badgeWrapper: {
      left: `${gridSize() * 2.5}px`,
      top: `-${gridSize() / 2}px`,
    },
  },
};

const light = ({ isActive, isHover, size }) => ({
  itemBase: {
    ...baseStyles.itemBase,
    ...sizeStyles[size].itemBase,
    backgroundColor: (() => {
      if (isActive || isHover) return lightActiveBackground;
      return colors.B500;
    })(),
    color: colors.B50,
  },
  badgeWrapper: {
    ...baseStyles.badgeWrapper,
    ...sizeStyles[size].badgeWrapper,
  },
});

const dark = ({ isActive, isHover, size }) => ({
  itemBase: {
    ...baseStyles.itemBase,
    ...sizeStyles[size].itemBase,
    backgroundColor: (() => {
      if (isActive) return darkActiveBackground;
      if (isHover) return darkHoverBackground;
      return colors.DN0;
    })(),
    color: colors.DN400,
  },
  badgeWrapper: {
    ...baseStyles.badgeWrapper,
    ...sizeStyles[size].badgeWrapper,
  },
});

const settings = ({ isActive, isHover, size }) => ({
  itemBase: {
    ...baseStyles.itemBase,
    ...sizeStyles[size].itemBase,
    backgroundColor: (() => {
      if (isActive) return settingsActiveBackground;
      if (isHover) return settingsHoverBackground;
      return colors.N800;
    })(),
    color: colors.N0,
  },
  badgeWrapper: {
    ...baseStyles.badgeWrapper,
    ...sizeStyles[size].badgeWrapper,
  },
});

const theme: ThemedGlobalNavigationComponentStyles<
  GlobalItemPresentationProps,
> = {
  dark,
  light,
  settings,
};
export default theme;
