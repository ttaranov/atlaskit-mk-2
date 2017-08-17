// @flow
import { colors, themed } from '@atlaskit/theme';

export const backgroundColor = themed('appearance', {
  added: { light: colors.G50, dark: colors.G50 },
  default: { light: colors.N30, dark: colors.DN70 },
  important: { light: colors.R300, dark: colors.DN900 },
  primary: { light: colors.B400, dark: colors.DN600 },
  removed: { light: colors.R50, dark: colors.R50 },
});

export const textColor = themed('appearance', {
  added: { light: colors.G500, dark: colors.G500 },
  default: { light: colors.N500, dark: colors.DN900 },
  important: { light: colors.N0, dark: colors.DN0 },
  primary: { light: colors.N0, dark: colors.DN70 },
  removed: { light: colors.R500, dark: colors.R500 },
});
