// @flow

import { colors } from '@atlaskit/theme';

import type { ThemedGlobalNavigationComponentStyles } from '../../theme/types';
import { GLOBAL_NAV_WIDTH } from '../../common/constants';

const baseStyles = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  height: '100vh',
  justifyContent: 'space-between',
  paddingBottom: 16,
  paddingTop: 16,
  transition:
    'background-color 0.3s cubic-bezier(0.2, 0, 0, 1), color 0.3s cubic-bezier(0.2, 0, 0, 1)',
  width: GLOBAL_NAV_WIDTH,
};

const light = () => ({
  ...baseStyles,
  backgroundColor: colors.B500,
  color: colors.N0,
  fill: colors.B500,
});

const dark = () => ({
  ...baseStyles,
  backgroundColor: colors.DN0,
  color: colors.DN400,
  fill: colors.DN0,
});

const settings = () => ({
  ...baseStyles,
  backgroundColor: colors.N800,
  color: colors.N0,
  fill: colors.N800,
});

const themes: ThemedGlobalNavigationComponentStyles<void> = {
  dark,
  light,
  settings,
};

export default themes;
