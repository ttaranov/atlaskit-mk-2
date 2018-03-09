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
*/
export const borderRadius = () => 3;
export const gridSize = () => 8;
export const fontSize = () => 14;
export const fontFamily = () =>
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
export const codeFontFamily = () =>
  '"SFMono-Medium", "SF Mono", "Segoe UI Mono", "Roboto Mono", "Ubuntu Mono", Menlo, Courier, monospace';

export const layers = {
  card: () => 100,
  dialog: () => 200,
  navigation: () => 300,
  layer: () => 400,
  blanket: () => 500,
  modal: () => 510,
  flag: () => 600,
  spotlight: () => 700,
  tooltip: () => 800,
};
