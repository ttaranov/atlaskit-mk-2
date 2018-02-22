// @flow

import * as colors from './colors';

import * as math from './utils/math';
import getTheme from './utils/getTheme';
import themed from './utils/themed';
import AtlaskitThemeProvider from './components/AtlaskitThemeProvider';

export { colors, math, getTheme, themed, AtlaskitThemeProvider };

// backwards-compatible export with old AtlasKit case
export const AtlasKitThemeProvider = AtlaskitThemeProvider;

/*
  These theme values are expressed as functions so that if we decide to make
  them dependent on props in the future, it wouldn't require a significant
  refactor everywhere they are being used.

  Their flow typing now includes an optional first argument. We have disabled our eslint rule to account for this.
*/

/* eslint-disable no-unused-vars */
export const borderRadius = (props?: Object) => 3;
export const gridSize = (props?: Object) => 8;
export const fontSize = (props?: Object) => 14;
export const fontFamily = (props?: Object) =>
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
export const codeFontFamily = (props?: Object) =>
  '"SFMono-Medium", "SF Mono", "Segoe UI Mono", "Roboto Mono", "Ubuntu Mono", Menlo, Courier, monospace';

export const layers = {
  card: (props?: Object) => 100,
  dialog: (props?: Object) => 200,
  navigation: (props?: Object) => 300,
  layer: (props?: Object) => 400,
  blanket: (props?: Object) => 500,
  modal: (props?: Object) => 510,
  flag: (props?: Object) => 600,
  spotlight: (props?: Object) => 700,
  tooltip: (props?: Object) => 800,
};
/* eslint-enable no-unused-vars */
