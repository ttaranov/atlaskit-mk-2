// @flow

import React, { type Node } from 'react';
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

export type Appearance =
  | 'added'
  | 'default'
  | 'important'
  | 'primary'
  | 'primaryInverted'
  | 'removed'
  | {};

export type ThemeProps = {
  badge?: ({ appearance: Appearance }) => {
    backgroundColor?: string,
    textColor?: string,
  },
  mode?: string,
};

export type ThemeType<Props> = {
  children: Node,
  values: Props => Props,
};

export const ThemeDefault = ({
  children,
  values = v => v,
}: ThemeType<ThemeProps>) => (
  <Theme
    values={({ badge = v => ({}), mode = 'light' } = {}) =>
      values({
        badge: props => ({
          ...(typeof props.appearance === 'object'
            ? {
                ...{
                  backgroundColor: backgroundColors.default.light,
                  textColor: textColors.default.light,
                },
                ...props.appearance,
              }
            : {
                backgroundColor: backgroundColors[props.appearance][mode],
                textColor: textColors[props.appearance][mode],
              }),
          ...badge(props),
        }),
        mode,
      })
    }
  >
    {children}
  </Theme>
);

const createAppearanceTheme = (appearance: string) => ({
  children,
  values = v => v,
}: ThemeType<ThemeProps>) => (
  <ThemeDefault>
    <Theme
      values={theme =>
        values({
          ...theme,
          badge: props => theme.badge({ appearance }),
        })
      }
    >
      {children}
    </Theme>
  </ThemeDefault>
);

export const ThemeAdded = createAppearanceTheme('added');
export const ThemeImportant = createAppearanceTheme('important');
export const ThemePrimary = createAppearanceTheme('primary');
export const ThemePrimaryInverted = createAppearanceTheme('primaryInverted');
export const ThemeRemoved = createAppearanceTheme('removed');
