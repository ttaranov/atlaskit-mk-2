// @flow

import globalNav from '../components/GlobalNav/styles';

import type { Mode } from './types';

export const light: Mode = {
  globalNav: globalNav.light,
};

export const dark: Mode = {
  globalNav: globalNav.dark,
};

export const settings: Mode = {
  globalNav: globalNav.settings,
};
