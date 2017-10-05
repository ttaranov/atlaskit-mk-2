// @flow
import { colors, themed } from '@atlaskit/theme';

export const backgroundColor = themed('appearance', {
  added: { light: colors.G50, dark: colors.G50 },
  default: { light: colors.N30, dark: colors.DN70 },
  important: { light: colors.R300, dark: colors.R300 },
  primary: { light: colors.B400, dark: colors.B100 },
  /* Note that primary inverted is a temporary implementation. Once navigation has
  context of the nav location to pass down, this will be moved to the primary when
  viewed in a global context. */
  primaryInverted: { light: colors.N0, dark: colors.DN400 },
  removed: { light: colors.R50, dark: colors.R50 },
});

export const textColor = themed('appearance', {
  added: { light: colors.G500, dark: colors.G500 },
  default: { light: colors.N800, dark: colors.DN900 },
  important: { light: colors.N0, dark: colors.N0 },
  primary: { light: colors.N0, dark: colors.DN0 },
  primaryInverted: { light: colors.B500, dark: colors.DN0 },
  removed: { light: colors.R500, dark: colors.R500 },
});
