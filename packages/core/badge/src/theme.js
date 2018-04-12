// @flow

import { colors } from '@atlaskit/theme';

type Theme = {
  [string]: string,
};

type ThemeMode = {
  default: Theme,
  [string]: Theme,
};

type ThemeVariation = {
  default: ThemeMode,
  [string]: ThemeMode,
};

function cascade(themes: ThemeVariation): ThemeVariation {
  const result = {};
  const defaultKeys = Object.keys(themes.default.default);
  Object.keys(themes).forEach(themeKey => {
    const variation = themes[themeKey];
    result[themeKey] = {};
    Object.keys(variation).forEach(variationKey => {
      const mode = variation[variationKey];
      result[themeKey][variationKey] = {};
      defaultKeys.forEach(defaultKey => {
        result[themeKey][variationKey][defaultKey] =
          mode[defaultKey] ||
          themes[themeKey].default[defaultKey] ||
          themes.default.default[defaultKey];
      });
    });
  });
  return result;
}

export default cascade({
  default: {
    default: {
      backgroundColor: colors.N30,
      textColor: colors.N800,
    },
    dark: {
      backgroundColor: colors.DN70,
      textColor: colors.DN900,
    },
  },
  added: {
    default: {
      backgroundColor: colors.G50,
      textColor: colors.G500,
    },
    dark: {
      backgroundColor: colors.G50,
      textColor: colors.G500,
    },
  },
  important: {
    default: {
      backgroundColor: colors.R300,
      textColor: colors.N0,
    },
    dark: {
      backgroundColor: colors.R300,
      textColor: colors.N0,
    },
  },
  primary: {
    default: {
      backgroundColor: colors.B400,
      textColor: colors.N0,
    },
    dark: {
      backgroundColor: colors.B100,
      textColor: colors.DN0,
    },
  },
  primaryInverted: {
    default: {
      backgroundColor: colors.N0,
      textColor: colors.B500,
    },
    dark: {
      backgroundColor: colors.DN400,
      textColor: colors.DN0,
    },
  },
  removed: {
    default: {
      backgroundColor: colors.R50,
      textColor: colors.R500,
    },
    dark: {
      backgroundColor: colors.R50,
      textColor: colors.R500,
    },
  },
});
