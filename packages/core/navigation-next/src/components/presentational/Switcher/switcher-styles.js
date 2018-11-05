// @flow

import { colors, gridSize as gridSizeFn } from '@atlaskit/theme';
import { mergeStyles } from '@atlaskit/select';

const gridSize = gridSizeFn();

const defaultStyles = {
  option: (provided, { isActive, isFocused }) => {
    return {
      ...provided,
      alignItems: 'center',
      border: 'none',
      backgroundColor: isFocused ? colors.N30 : 'transparent',
      boxSizing: 'border-box',
      color: 'inherit',
      cursor: 'default',
      display: 'flex',
      flexShrink: 0,
      fontSize: 'inherit',
      height: gridSize * 6,
      outline: 'none',
      paddingRight: gridSize,
      paddingLeft: gridSize,
      textAlign: 'left',
      textDecoration: 'none',
      width: '100%',
      ...(isActive && { backgroundColor: colors.B50 }),
    };
  },
};

type SelectStyles = {
  [component: string]: (
    baseStyles: {},
    { isActive: boolean, isHover: boolean, isFocused: boolean },
  ) => {},
};

export const createStyles = (styles: SelectStyles): Object =>
  mergeStyles(defaultStyles, styles);
