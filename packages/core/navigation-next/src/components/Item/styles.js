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
}: ItemPresentationProps) => {
  const containerTextColor = isSelected || isActive ? colors.B400 : colors.N500;
  const containerBackgroundColor = (() => {
    if (isActive) return colors.B50;
    if (isSelected || isHover) return colors.N30;
    return colors.N20;
  })();
  const productBackgroundColor = (() => {
    if (isActive) return colors.B200;
    if (isSelected) return lightRootSelectedBackground;
    if (isHover) return lightRootHoverBackground;
    return colors.B500;
  })();

  return {
    container: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: containerBackgroundColor,
        fill: containerBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
        color: containerTextColor,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: containerTextColor,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: colors.N200,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
      },
    },
    product: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: productBackgroundColor,
        fill: productBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
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
      },
    },
  };
};

// Dark theme
const dark = ({
  isActive,
  isHover,
  isSelected,
  spacing,
}: ItemPresentationProps) => {
  const containerTextColor = (() => {
    if (isActive) return colors.B100;
    if (isSelected) return colors.DN900;
    return colors.DN400;
  })();
  const containerBackgroundColor = (() => {
    if (isActive) return darkActiveSelectedBackground;
    if (isSelected) return darkActiveSelectedBackground;
    if (isHover) return darkHoverBackground;
    return colors.DN20;
  })();
  const productTextColor = (() => {
    if (isActive) return colors.B100;
    if (isSelected) return colors.DN900;
    return colors.DN400;
  })();
  const productBackgroundColor = (() => {
    if (isActive) return darkActiveSelectedBackground;
    if (isSelected) return darkActiveSelectedBackground;
    if (isHover) return darkHoverBackground;
    return colors.DN0;
  })();

  return {
    container: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: containerBackgroundColor,
        fill: containerBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
        color: containerTextColor,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: containerTextColor,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: colors.DN100,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
      },
    },
    product: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: productBackgroundColor,
        fill: productBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: productTextColor,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: colors.DN100,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
      },
    },
  };
};

// Settings theme
const settings = ({
  isActive,
  isHover,
  isSelected,
  spacing,
}: ItemPresentationProps) => {
  const containerTextColor = isActive ? colors.B100 : colors.N0;
  const containerBackgroundColor = (() => {
    if (isActive) return settingsActiveBackground;
    if (isSelected || isHover) return colors.N700A;
    return colors.N700;
  })();
  const productTextColor = isActive ? colors.B100 : colors.N0;
  const productBackgroundColor = (() => {
    if (isActive) return settingsActiveBackground;
    if (isSelected || isHover) return colors.N700A;
    return colors.N800;
  })();

  return {
    container: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: containerBackgroundColor,
        fill: containerBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: containerTextColor,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: colors.N70,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
      },
    },
    product: {
      itemBase: {
        ...baseStyles.itemBase,
        ...layoutStyles[spacing].itemBase,
        backgroundColor: productBackgroundColor,
        fill: productBackgroundColor,
      },
      beforeWrapper: {
        ...baseStyles.beforeWrapper,
        ...layoutStyles[spacing].beforeWrapper,
      },
      contentWrapper: baseStyles.contentWrapper,
      textWrapper: {
        ...baseStyles.textWrapper,
        color: productTextColor,
      },
      subTextWrapper: {
        ...baseStyles.subTextWrapper,
        ...layoutStyles[spacing].subTextWrapper,
        color: colors.N70,
      },
      afterWrapper: {
        ...baseStyles.afterWrapper,
        ...layoutStyles[spacing].afterWrapper,
      },
    },
  };
};

const themes: ThemedContentNavigationComponentStyles<ItemPresentationProps> = {
  dark,
  light,
  settings,
};
export default themes;
