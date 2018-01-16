// @flow

import { colors, themed } from '@atlaskit/theme';

const lightButtonBackground = 'rgba(255, 255, 255, 0.08)';

export const flagBackgroundColor = themed('appearance', {
  error: { light: colors.R400, dark: colors.R300 },
  info: { light: colors.N500, dark: colors.N500 },
  normal: { light: colors.N0, dark: colors.DN50 },
  success: { light: colors.G400, dark: colors.G300 },
  warning: { light: colors.Y200, dark: colors.Y300 },
});

export const flagBorderColor = themed('appearance', {
  // $FlowFixMe TEMPORARY
  normal: { light: colors.N60A },
});

export const flagTextColor = themed('appearance', {
  error: { light: colors.N0, dark: colors.DN40 },
  info: { light: colors.N0, dark: colors.DN600 },
  normal: { light: colors.N500, dark: colors.DN600 },
  success: { light: colors.N0, dark: colors.DN40 },
  warning: { light: colors.N700, dark: colors.DN40 },
});

export const flagShadowColor = themed('appearance', {
  error: { light: colors.N50A, dark: colors.N50A },
  info: { light: colors.N50A, dark: colors.N50A },
  normal: { light: colors.N50A, dark: colors.N50A },
  success: { light: colors.N50A, dark: colors.N50A },
  warning: { light: colors.N50A, dark: colors.N50A },
});
// $FlowFixMe TEMPORARY
export const flagFocusRingColor = themed('appearance', {
  error: { light: colors.N40, dark: colors.N40 },
  info: { light: colors.N40, dark: colors.N40 },
  normal: { light: colors.B100, dark: colors.link },
  success: { light: colors.N40, dark: colors.N40 },
  warning: { light: colors.N200, dark: colors.N200 },
});

export const buttonBackgroundColor = themed('appearance', {
  error: { light: lightButtonBackground, dark: colors.N30A },
  info: { light: lightButtonBackground, dark: lightButtonBackground },
  normal: { light: 'none', dark: 'none' },
  success: { light: lightButtonBackground, dark: colors.N30A },
  warning: { light: colors.N30A, dark: colors.N30A },
});
// $FlowFixMe TEMPORARY
export const buttonTextColor = themed('appearance', {
  error: { light: colors.N0, dark: colors.DN40 },
  info: { light: colors.N0, dark: colors.DN600 },
  normal: { light: colors.link, dark: colors.link },
  success: { light: colors.N0, dark: colors.DN40 },
  warning: { light: colors.N700, dark: colors.DN40 },
});
