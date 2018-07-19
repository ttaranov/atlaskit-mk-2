// @flow

import React from 'react';
import { colors, Theme, type ThemeDefinition } from '@atlaskit/theme';

export const backgroundColors = {
  added: { light: colors.G50, dark: colors.G50 },
  default: { light: colors.N40, dark: colors.DN70 },
  important: { light: colors.R400, dark: colors.R400 },
  primary: { light: colors.B400, dark: colors.B100 },
  /* Note that primary inverted is a temporary implementation. Once navigation has
  context of the nav location to pass down, this will be moved to the primary when
  viewed in a global context. */
  primaryInverted: { light: colors.N0, dark: colors.DN400 },
  removed: { light: colors.R50, dark: colors.R50 },
};

export const textColors = {
  added: { light: colors.G500, dark: colors.G500 },
  default: { light: colors.N800, dark: colors.DN900 },
  important: { light: colors.N0, dark: colors.N0 },
  primary: { light: colors.N0, dark: colors.DN0 },
  primaryInverted: { light: colors.B500, dark: colors.DN0 },
  removed: { light: colors.R500, dark: colors.R500 },
};

export default (props: DefaultThemeProps) => (
  <Theme
    values={{
      badge: (state, theme) => ({
        ...(typeof state.appearance === 'object'
          ? state.appearance
          : {
              backgroundColor: backgroundColors[state.appearance][theme.mode],
              textColor: textColors[state.appearance][theme.mode],
            }),
        ...theme.badge(state),
      }),
      mode: 'light',
      ...props.values,
    }}
  >
    {props.children}
  </Theme>
);

export type DefaultThemeProps = ThemeDefinition<{
  badge: ({ appearance: string | {} }) => {
    backgroundColor: string,
    textColor: string,
  },
  mode: string,
}>;
