// @flow

import { colors } from '@atlaskit/theme';

import type { ThemedProductComponentStyles } from '../../theme/types';
import { CONTENT_NAV_WIDTH } from '../../common/constants';

const baseStyles = {
  boxSizing: 'border-box',
  height: '100%',
  left: 0,
  minWidth: CONTENT_NAV_WIDTH,
  overflowX: 'hidden',
  position: 'absolute',
  top: 0,
  width: '100%',
  // Reset stacking context so scroll hints from the root nav don't sit above
  // container nav
  zIndex: 0,
};

const light = () => ({
  container: {
    ...baseStyles,
    backgroundColor: colors.N20,
    color: colors.N500,
  },
  root: {
    ...baseStyles,
    backgroundColor: colors.B500,
    color: colors.B50,
  },
});
const dark = () => ({
  container: {
    ...baseStyles,
    backgroundColor: colors.DN20,
    color: colors.DN400,
  },
  root: {
    ...baseStyles,
    backgroundColor: colors.DN0,
    color: colors.DN400,
  },
});
const settings = () => ({
  container: {
    ...baseStyles,
    backgroundColor: colors.N700,
    color: colors.N0,
  },
  root: {
    ...baseStyles,
    backgroundColor: colors.N800,
    color: colors.N0,
  },
});

const themes: ThemedProductComponentStyles<void> = { dark, light, settings };

export default themes;
