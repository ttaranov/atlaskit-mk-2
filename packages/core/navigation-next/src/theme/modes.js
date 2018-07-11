// @flow

import globalItem from '../components/GlobalItem/styles';
import globalNav from '../components/GlobalNav/styles';
import productNav from '../components/ProductNav/styles';
import item from '../components/Item/styles';
import heading from '../components/Heading/styles';
import separator from '../components/Separator/styles';
import scrollHint from '../components/ScrollableSectionInner/styles';

import type { Mode } from './types';

export const light: Mode = {
  globalItem: globalItem.light,
  globalNav: globalNav.light,
  productNav: productNav.light,
  item: item.light,
  heading: heading.light,
  separator: separator.light,
  scrollHint: scrollHint.light,
};

export const dark: Mode = {
  globalItem: globalItem.dark,
  globalNav: globalNav.dark,
  productNav: productNav.dark,
  item: item.dark,
  heading: heading.dark,
  separator: separator.dark,
  scrollHint: scrollHint.dark,
};

export const settings: Mode = {
  globalItem: globalItem.settings,
  globalNav: globalNav.settings,
  productNav: productNav.settings,
  item: item.settings,
  heading: heading.settings,
  separator: separator.settings,
  scrollHint: scrollHint.settings,
};
