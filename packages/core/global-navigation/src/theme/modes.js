// @flow

import globalNav from '../components/GlobalNav/styles';
import scrollHint from '../components/ScrollableSectionInner/styles';

import type { Mode } from './types';

export const light: Mode = {
  globalNav: globalNav.light,
  scrollHint: scrollHint.light,
};

export const dark: Mode = {
  globalNav: globalNav.dark,
  scrollHint: scrollHint.dark,
};

export const settings: Mode = {
  globalNav: globalNav.settings,
  scrollHint: scrollHint.dark,
};
