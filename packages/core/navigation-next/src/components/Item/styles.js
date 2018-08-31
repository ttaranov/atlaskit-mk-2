// @flow

import { colors, fontSize, gridSize as gridSizeFn } from '@atlaskit/theme';

import type { ThemedContentNavigationComponentStyles } from '../../theme/types';
import type { ItemPresentationProps } from './types';

const gridSize = gridSizeFn();

/**
 * Component tree structure:
 * - itemBase
 *   - beforeWrapper
 *   - contentWrapper
 *     - textWrapper
 *     - subTextWrapper
 *   - afterWrapper
 */

/**
 * We can't have semi-transparent background colors for items so I'm hard-coding
 * an opaque hex value here, where the designs specify them as an RGBA.
 */
const lightRootSelectedBackground = '#083D8D'; // N50A
const lightRootHoverBackground = '#0A357D'; // N80A
const darkActiveSelectedBackground = '#202B3D';
const darkHoverBackground = '#253247';
const settingsActiveBackground = '#374864'; // rgba(255, 255, 255, 0.08)

// These are the styles which are consistent regardless of theme or spacing
const baseStyles = {
  itemBase: {
    alignItems: 'center',
    border: 'none',
    borderRadius: '3px',
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    fontSize: 'inherit',
    height: gridSize * 5,
    outline: 'none',
    textAlign: 'left',
    textDecoration: 'none',
    width: '100%',

    '&:focus': {
      boxShadow: `0 0 0 2px ${colors.B100} inset`,
    },
  },
  beforeWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowX: 'hidden',
  },
  textWrapper: {
    flex: '1 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 16 / fontSize(),
  },
  subTextWrapper: {
    flex: '1 1 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  afterWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
  },
};

// These are styles which switch on the spacing prop
const layoutStyles = {
  compact: {
    itemBase: {
      paddingRight: gridSize,
      paddingLeft: gridSize,
    },
    beforeWrapper: {
      marginRight: gridSize,
    },
    subTextWrapper: {
      fontSize: '10px',
      lineHeight: 1.2,
    },
    afterWrapper: {
      marginLeft: gridSize,
    },
  },
  default: {
    itemBase: {
      paddingLeft: gridSize * 1.5,
      paddingRight: gridSize * 1.5,
    },
    beforeWrapper: {
      marginRight: gridSize * 2,
    },
    subTextWrapper: {
      fontSize: '12px',
      lineHeight: 14 / 12,
    },
    afterWrapper: {
      marginLeft: gridSize * 2,
    },
  },
};

// Light theme
const light = ({
  isActive,
  isHover,
  isSelected,
  spacing,
}: ItemPresentationProps) => ({
  container: {
    itemBase: {
      ...baseStyles.itemBase,
      ...layoutStyles[spacing].itemBase,
      backgroundColor: (() => {
        if (isActive) return colors.B50;
        if (isSelected || isHover) return colors.N30;
        return colors.N20;
      })(),
    },
    beforeWrapper: {
      ...baseStyles.beforeWrapper,
      ...layoutStyles[spacing].beforeWrapper,
      color: isSelected ? colors.B400 : colors.N500,
      fill: (() => {
        if (isActive) return colors.B50;
        if (isSelected || isHover) return colors.N30;
        return colors.N20;
      })(),
    },
    contentWrapper: baseStyles.contentWrapper,
    textWrapper: {
      ...baseStyles.textWrapper,
      color: isSelected ? colors.B400 : colors.N500,
    },
    subTextWrapper: {
      ...baseStyles.subTextWrapper,
      ...layoutStyles[spacing].subTextWrapper,
      color: colors.N200,
    },
    afterWrapper: {
      ...baseStyles.afterWrapper,
      ...layoutStyles[spacing].afterWrapper,
      fill: (() => {
        if (isActive) return colors.B50;
        if (isSelected || isHover) return colors.N30;
        return colors.N20;
      })(),
    },
  },
  product: {
    itemBase: {
      ...baseStyles.itemBase,
      ...layoutStyles[spacing].itemBase,
      backgroundColor: (() => {
        if (isActive) return colors.B200;
        if (isSelected) return lightRootSelectedBackground;
        if (isHover) return lightRootHoverBackground;
        return colors.B500;
      })(),
    },
    beforeWrapper: {
      ...baseStyles.beforeWrapper,
      ...layoutStyles[spacing].beforeWrapper,
      fill: (() => {
        if (isActive) return colors.B200;
        if (isSelected) return lightRootSelectedBackground;
        if (isHover) return lightRootHoverBackground;
        return colors.B500;
      })(),
    },
    contentWrapper: baseStyles.contentWrapper,
    textWrapper: {
      ...baseStyles.textWrapper,
      color: colors.B50,
    },
    subTextWrapper: {
      ...baseStyles.subTextWrapper,
      ...layoutStyles[spacing].subTextWrapper,
      color: colors.B75,
    },
    afterWrapper: {
      ...baseStyles.afterWrapper,
      ...layoutStyles[spacing].afterWrapper,
      fill: (() => {
        if (isActive) return colors.B200;
        if (isSelected) return lightRootSelectedBackground;
        if (isHover) return lightRootHoverBackground;
        return colors.B500;
      })(),
    },
  },
});

const darkContainerTextColor = ({ isActive, isSelected }) => {
  if (isActive) return colors.B100;
  if (isSelected) return colors.DN900;
  return colors.DN400;
};

// Dark theme
const dark = ({
  isActive,
  isHover,
  isSelected,
  spacing,
}: ItemPresentationProps) => ({
  container: {
    itemBase: {
      ...baseStyles.itemBase,
      ...layoutStyles[spacing].itemBase,
      backgroundColor: (() => {
        if (isActive) return darkActiveSelectedBackground;
        if (isSelected) return darkActiveSelectedBackground;
        if (isHover) return darkHoverBackground;
        return colors.DN20;
      })(),
    },
    beforeWrapper: {
      ...baseStyles.beforeWrapper,
      ...layoutStyles[spacing].beforeWrapper,
      color: darkContainerTextColor({ isActive, isSelected }),
      fill: (() => {
        if (isActive) return darkActiveSelectedBackground;
        if (isSelected) return darkActiveSelectedBackground;
        if (isHover) return darkHoverBackground;
        return colors.DN20;
      })(),
    },
    contentWrapper: baseStyles.contentWrapper,
    textWrapper: {
      ...baseStyles.textWrapper,
      color: darkContainerTextColor({ isActive, isSelected }),
    },
    subTextWrapper: {
      ...baseStyles.subTextWrapper,
      ...layoutStyles[spacing].subTextWrapper,
      color: colors.DN100,
    },
    afterWrapper: {
      ...baseStyles.afterWrapper,
      ...layoutStyles[spacing].afterWrapper,
      fill: (() => {
        if (isActive) return darkActiveSelectedBackground;
        if (isSelected) return darkActiveSelectedBackground;
        if (isHover) return darkHoverBackground;
        return colors.DN20;
      })(),
    },
  },
  product: {
    itemBase: {
      ...baseStyles.itemBase,
      ...layoutStyles[spacing].itemBase,
      backgroundColor: (() => {
        if (isActive) return darkActiveSelectedBackground;
        if (isSelected) return darkActiveSelectedBackground;
        if (isHover) return darkHoverBackground;
        return colors.DN0;
      })(),
    },
    beforeWrapper: {
      ...baseStyles.beforeWrapper,
      ...layoutStyles[spacing].beforeWrapper,
      fill: (() => {
        if (isActive) return darkActiveSelectedBackground;
        if (isSelected) return darkActiveSelectedBackground;
        if (isHover) return darkHoverBackground;
        return colors.DN0;
      })(),
    },
    contentWrapper: baseStyles.contentWrapper,
    textWrapper: {
      ...baseStyles.textWrapper,
      color: (() => {
        if (isActive) return colors.B100;
        if (isSelected) return colors.DN900;
        return colors.DN400;
      })(),
    },
    subTextWrapper: {
      ...baseStyles.subTextWrapper,
      ...layoutStyles[spacing].subTextWrapper,
      color: colors.DN100,
    },
    afterWrapper: {
      ...baseStyles.afterWrapper,
      ...layoutStyles[spacing].afterWrapper,
      fill: (() => {
        if (isActive) return darkActiveSelectedBackground;
        if (isSelected) return darkActiveSelectedBackground;
        if (isHover) return darkHoverBackground;
        return colors.DN0;
      })(),
    },
  },
});

// Settings theme
const settings = ({
  isActive,
  isHover,
  isSelected,
  spacing,
}: ItemPresentationProps) => ({
  container: {
    itemBase: {
      ...baseStyles.itemBase,
      ...layoutStyles[spacing].itemBase,
      backgroundColor: (() => {
        if (isActive) return settingsActiveBackground;
        if (isSelected || isHover) return colors.N700A;
        return colors.N700;
      })(),
    },
    beforeWrapper: {
      ...baseStyles.beforeWrapper,
      ...layoutStyles[spacing].beforeWrapper,
      fill: (() => {
        if (isActive) return settingsActiveBackground;
        if (isSelected || isHover) return colors.N700A;
        return colors.N700;
      })(),
    },
    contentWrapper: baseStyles.contentWrapper,
    textWrapper: {
      ...baseStyles.textWrapper,
      color: isActive ? colors.B100 : colors.N0,
    },
    subTextWrapper: {
      ...baseStyles.subTextWrapper,
      ...layoutStyles[spacing].subTextWrapper,
      color: colors.N70,
    },
    afterWrapper: {
      ...baseStyles.afterWrapper,
      ...layoutStyles[spacing].afterWrapper,
      fill: (() => {
        if (isActive) return settingsActiveBackground;
        if (isSelected || isHover) return colors.N700A;
        return colors.N700;
      })(),
    },
  },
  product: {
    itemBase: {
      ...baseStyles.itemBase,
      ...layoutStyles[spacing].itemBase,
      backgroundColor: (() => {
        if (isActive) return settingsActiveBackground;
        if (isSelected || isHover) return colors.N700A;
        return colors.N800;
      })(),
    },
    beforeWrapper: {
      ...baseStyles.beforeWrapper,
      ...layoutStyles[spacing].beforeWrapper,
      fill: (() => {
        if (isActive) return settingsActiveBackground;
        if (isSelected || isHover) return colors.N700A;
        return colors.N800;
      })(),
    },
    contentWrapper: baseStyles.contentWrapper,
    textWrapper: {
      ...baseStyles.textWrapper,
      color: isActive ? colors.B100 : colors.N0,
    },
    subTextWrapper: {
      ...baseStyles.subTextWrapper,
      ...layoutStyles[spacing].subTextWrapper,
      color: colors.N70,
    },
    afterWrapper: {
      ...baseStyles.afterWrapper,
      ...layoutStyles[spacing].afterWrapper,
      fill: (() => {
        if (isActive) return settingsActiveBackground;
        if (isSelected || isHover) return colors.N700A;
        return colors.N800;
      })(),
    },
  },
});

const themes: ThemedContentNavigationComponentStyles<ItemPresentationProps> = {
  dark,
  light,
  settings,
};
export default themes;
